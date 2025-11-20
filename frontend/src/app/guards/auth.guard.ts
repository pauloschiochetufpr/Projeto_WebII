import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: string;
  tipoUsuario: string;
  exp: string;
}

export const authGuard: CanActivateFn = (route, state) => {
   console.info(
    '🟦 [AuthGuard] Iniciando verificação de acesso para rota:',
    state.url
  ); 

  const router = inject(Router);

  // Verificação especial para rota de login
  if (state.url === '/login') {
    const hasToken = !!localStorage.getItem('accessToken');
    console.log(
      '🔍 Acesso à rota de login detectado. Token presente?',
      hasToken
    );

    if (hasToken) {
      console.warn('⚠️ Usuário já autenticado — redirecionando para "/"');
      router.navigate(['/']);
      return false;
    }

    console.log('✅ Nenhum token — permitindo acesso ao login');
    return true;
  }

  const token = localStorage.getItem('accessToken');
  console.log('🔍 Token encontrado no localStorage:', token);

  if (!token) {
    console.warn('🚫 Nenhum token encontrado — redirecionando para /login');
    router.navigate(['/login']);
    console.log('↩️ Return false (sem token)');
    return false;
  }

  try {
    console.info('📦 Decodificando token...');
    const decoded = jwtDecode<TokenPayload>(token);
    console.log('✅ Token decodificado com sucesso:', decoded);

    // Valida expiração
    const expiracao = new Date(decoded.exp).getTime();
    console.log(
      '🕒 Data de expiração (ms):',
      expiracao * 1000,
      '| Agora:',
      Date.now()
    );

    if (Date.now() > expiracao * 1000) {
      console.warn('⏰ Token expirado — removendo tokens e redirecionando');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.navigate(['/login']);
      console.log('↩️ Return false (token expirado)');
      return false;
    }

    // Protege rota
    const rolesPermitidos = route.data?.['roles'] as string[] | undefined;
    console.log('🎯 Roles permitidos para rota:', rolesPermitidos);
    console.log('👤 Tipo de usuário no token:', decoded.tipoUsuario);

    if (!rolesPermitidos || rolesPermitidos.includes(decoded.tipoUsuario)) {
      console.info('✅ Acesso permitido à rota:', state.url);
      console.log('↩️ Return true (autorizado)');
      return true;
    }

    console.warn('🚫 Acesso negado — role incompatível.');
    router.navigate(['/']);
    console.log('↩️ Return false (role incompatível)');
    return false;
  } catch (e) {
    console.error('💥 Erro ao decodificar ou validar token:', e);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.navigate(['/login']);
    console.log('↩️ Return false (erro no try/catch)');
    return false;
  }
};
