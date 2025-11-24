/* token-watcher.service.ts */
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface TokenPayload {
  idCliente?: string | number;
  tipoUsuario?: string;
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class TokenWatcherService implements OnDestroy {
  private running = false;
  private loopTimeoutId: any = null;

  private readonly CHECK_BASE_MS = 30_000;
  private readonly JITTER_MAX_MS = 10_000;
  private readonly REFRESH_THRESHOLD_MS = 3 * 60 * 1000;
  private readonly EXPIRED_REFRESH_MAX = 7;
  private readonly LOGOUT_RETRIES = 3;
  private readonly REFRESH_FLAG_KEY = 'isRefreshing';
  private readonly EXPIRED_COUNTER_KEY = 'expiredRefreshCount';

  private readonly REFRESH_ENDPOINT = `${environment.apiUrl}/token/refresh`;
  private readonly LOGOUT_ENDPOINT = `${environment.apiUrl}/auth/logout`;

  constructor(private http: HttpClient, private router: Router) {}

  start() {
    if (this.running) return;
    console.log('[TokenWatcher] Inicializando watcher de tokens');
    if (!this.getFlag()) this.setFlag(false);
    this.running = true;
    this.loopTick();
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    if (this.loopTimeoutId) {
      clearTimeout(this.loopTimeoutId);
      this.loopTimeoutId = null;
    }
    console.log('[TokenWatcher] Parado.');
  }

  ngOnDestroy() {
    this.stop();
  }

  private loopTick() {
    if (!this.running) return;
    const jitter = Math.floor(Math.random() * this.JITTER_MAX_MS);
    const nextInterval = this.CHECK_BASE_MS + jitter;

    (async () => {
      try {
        await this.checkOnce();
      } catch (e) {
        console.error('[TokenWatcher] Erro na checagem:', e);
      } finally {
        if (this.running) {
          this.loopTimeoutId = setTimeout(() => this.loopTick(), nextInterval);
        }
      }
    })();
  }

  private async checkOnce(): Promise<void> {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      this.router.navigate(['/login']);
      return;
    }

    let decoded: TokenPayload;
    try {
      decoded = jwtDecode<TokenPayload>(accessToken);
    } catch (e) {
      console.warn('[TokenWatcher] Decodificação falhou — logout de segurança');
      await this.performLogout(refreshToken);
      return;
    }

    const expSeconds = decoded.exp;
    if (!expSeconds) {
      console.warn('[TokenWatcher] Token sem exp — logout');
      await this.performLogout(refreshToken);
      return;
    }

    const expMs = expSeconds * 1000;
    const now = Date.now();

    if (now >= expMs) {
      console.info('[TokenWatcher] accessToken expirado');
      const counter = this.incrementExpiredCounter();
      console.info(`[TokenWatcher] expiredRefreshCount = ${counter}`);

      if (counter <= this.EXPIRED_REFRESH_MAX) {
        console.info('[TokenWatcher] Tentando refresh mesmo expirado');
        const ok = await this.tryRefreshWithGuard(refreshToken);
        if (!ok) await this.performLogout(refreshToken);
      } else {
        console.warn('[TokenWatcher] Limite atingido → logout');
        this.resetExpiredCounter();
        await this.performLogout(refreshToken);
      }
      return;
    }

    const remaining = expMs - now;
    if (remaining <= this.REFRESH_THRESHOLD_MS) {
      console.info(
        `[TokenWatcher] Token expira em ${Math.floor(
          remaining / 1000
        )}s — refresh`
      );
      const ok = await this.tryRefreshWithGuard(refreshToken);
      if (!ok) await this.performLogout(refreshToken);
      return;
    }
  }

  private getFlag(): boolean {
    return localStorage.getItem(this.REFRESH_FLAG_KEY) === 'true';
  }
  private setFlag(value: boolean) {
    localStorage.setItem(this.REFRESH_FLAG_KEY, value ? 'true' : 'false');
  }

  private incrementExpiredCounter(): number {
    const raw = localStorage.getItem(this.EXPIRED_COUNTER_KEY);
    let n = raw ? parseInt(raw, 10) : 0;
    n = isNaN(n) ? 1 : n + 1;
    localStorage.setItem(this.EXPIRED_COUNTER_KEY, String(n));
    return n;
  }
  private resetExpiredCounter() {
    localStorage.setItem(this.EXPIRED_COUNTER_KEY, '0');
  }

  private async tryRefreshWithGuard(refreshToken: string): Promise<boolean> {
    if (this.getFlag()) {
      if (this.getFlag()) {
        console.warn('[TokenWatcher] Em andamento — abortando');
        return false;
      }
    }

    this.setFlag(true);

    try {
      const ok = await this.performRefresh(refreshToken);
      return ok;
    } finally {
      this.setFlag(false);
    }
  }

  private async performRefresh(refreshToken: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http
          .post<AuthResponse>(
            this.REFRESH_ENDPOINT,
            { refreshToken },
            { responseType: 'json' }
          )
          .pipe(timeout(8000))
      );

      if (!response || !response.accessToken || !response.refreshToken) {
        console.error('[TokenWatcher] Refresh inválido →', response);
        return false;
      }

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      console.info('[TokenWatcher] Refresh bem-sucedido');
      return true;
    } catch (err) {
      console.error('[TokenWatcher] Falha no refresh:', err);
      return false;
    }
  }

  private async performLogout(refreshToken?: string) {
    console.info('[TokenWatcher] Executando logout');
    if (refreshToken) {
      for (let i = 0; i < this.LOGOUT_RETRIES; i++) {
        try {
          await firstValueFrom(
            this.http
              .post(
                this.LOGOUT_ENDPOINT,
                { refreshToken },
                { responseType: 'json' }
              )
              .pipe(timeout(5000))
          );
          console.info(`[TokenWatcher] Logout notificado (tentativa ${i + 1})`);
          break;
        } catch (e) {
          console.warn(
            `[TokenWatcher] Falha ao notificar (tentativa ${i + 1})`,
            e
          );
          await this.sleep(500);
        }
      }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.setFlag(false);
    this.resetExpiredCounter();
    try {
      this.router.navigate(['/login']);
    } catch (e) {
      console.warn('[TokenWatcher] Erro ao redirecionar /login', e);
    }
    console.info('[TokenWatcher] Logout finalizado');
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
