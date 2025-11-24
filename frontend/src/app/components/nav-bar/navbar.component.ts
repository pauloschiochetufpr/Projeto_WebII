import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  isOpen = false;

  // Pegar do Token
  userName = 'Usuário';

  constructor(private router: Router) {}

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  //Logout fake, por hora
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}
