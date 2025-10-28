import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule], // necessário para ngClass, ngIf, etc
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  @Input() codigo?: number; // HTTP code
  @Input() mensagem!: string; // mensagem do backend

  get corFundo(): string {
    if (this.codigo && this.codigo >= 200 && this.codigo < 300)
      return 'bg-green-500 border-green-500 shadow-green-500';
    if (this.codigo && this.codigo >= 400 && this.codigo < 500)
      return 'bg-red-500 border-red-500 shadow-red-500';
    return 'bg-yellow-400 border-yellow-400 shadow-yellow-400';
  }
}
