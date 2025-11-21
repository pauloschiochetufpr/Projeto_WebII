import { Component, Input } from '@angular/core';
import { Funcionario } from '../../../models/usuario.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal-usuario',
  imports: [],
  templateUrl: './modal-usuario.html',
  styleUrl: './modal-usuario.css'
})

export class ModalUsuarioComponent {
  @Input() funcionario: Funcionario = new Funcionario();
  constructor(public activeModal: NgbActiveModal) {}
}
