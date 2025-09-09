import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


type Status = "Aberto" | "Em Andamento" | "Concluído" | "Inativo";

interface Servico {
  id: number;
  descricao: string;
  status: Status;
}

@Component({
  selector: 'app-crud-servicos',
  imports: [CommonModule],
  templateUrl: './crud-servicos.component.html',
  styleUrls: ['./crud-servicos.component.css']
})
//tem que fazer isso no backend, por enquanto só tem os components
//o crud ta bem cru mesmo, mas imagino que deve gerar uma resposta
export class CrudServicosComponent {
  servicos: Servico[] = [
    { id: 1, descricao: "Trocar tela de celular", status: "Aberto" },
    { id: 2, descricao: "Manutenção em notebook", status: "Em Andamento" }
  ];

  nextId: number = this.servicos.length + 1;
  novaDescricao: string = "";

  adicionarServico() {
    if (!this.novaDescricao.trim()) return;
    this.servicos.push({
      id: this.nextId++,
      descricao: this.novaDescricao,
      status: "Aberto"
    });
    this.novaDescricao = "";
  }

  editarServico(id: number) {
    const novoTexto = prompt("Nova descrição:");
    if (novoTexto) {
      const servico = this.servicos.find(s => s.id === id);
      if (servico) servico.descricao = novoTexto;
    }
  }

  excluirServico(id: number) {
    this.servicos = this.servicos.filter(s => s.id !== id);
  }

  atualizarStatus(id: number) {
    const servico = this.servicos.find(s => s.id === id);
    if (servico) {
      if (servico.status === "Aberto") servico.status = "Em Andamento";
      else if (servico.status === "Em Andamento") servico.status = "Concluído";
      else servico.status = "Aberto";
    }
  }

  inativarServico(id: number) {
    const servico = this.servicos.find(s => s.id === id);
    if (servico) servico.status = "Inativo";
  }
}
