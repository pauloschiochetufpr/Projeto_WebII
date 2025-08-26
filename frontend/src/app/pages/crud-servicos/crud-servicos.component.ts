import { Component } from '@angular/core';

type Status = "Aberto" | "Em Andamento" | "Concluído" | "Inativo";

interface Servico {
  id: number;
  descricao: string;
  status: Status;
}

@Component({
  selector: 'app-crud-servicos',
  templateUrl: './crud-servicos.component.html',
  styleUrls: ['./crud-servicos.component.css']
})
export class CrudServicosComponent {servicos: Servico[] = [
    { id: 1, descricao: "Trocar tela de celular", status: "Aberto" },
    { id: 2, descricao: "Manutenção em notebook", status: "Em Andamento" }
  ];
}

/* AINDA PRECISO FAZER OS SEGUINTES: ADICIONAR, EDITAR, EXCLUIR, ATUALIZAR E INATIVAR, FAVOR NÃO MEXER DRASTICAMENTE */