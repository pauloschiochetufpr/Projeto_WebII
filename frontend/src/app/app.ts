import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TokenWatcherService } from './guards/token-watcher.service';
import { NavbarComponent } from './components';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, NavbarComponent, NgIf],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected readonly title = signal('sistema_manutencao');

  isLoginPage = false;

  constructor(
    private tokenWatcher: TokenWatcherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tokenWatcher.start();
    this.router.events.subscribe(() => {
    this.isLoginPage = this.router.url === '/login';
    });
  }
}
