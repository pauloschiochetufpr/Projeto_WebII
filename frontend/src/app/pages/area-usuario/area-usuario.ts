import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NotificationComponent } from '../../components';
import { Router } from '@angular/router';

@Component({
  selector: 'area-usuario',
  standalone: true,
  templateUrl: './area-usuario.html',
  imports: [CommonModule, LucideAngularModule],
})
export class AreaUsuario {
  paginaAtual: string = 'Perfil';

  selecionar(pagina: string) {
    this.paginaAtual = pagina;
  }
}
