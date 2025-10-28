import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { CrudWorkersComponent } from './pages/crud-workers/crud-workers.component';
import { Listar } from './pages/listar/listar';
import { HomeCliente } from './pages/home-cliente/home-cliente';
import { HomeFuncionarioComponent } from './pages/home-funcionario/home-funcionario';
import { SolicitarManutencaoComponent } from './components/solicitar-manutencao/solicitar-manutencao';
import { CategoriaEquipamentoComponent } from './pages/categoria-equipamento/categoria-equipamento.component';

export const routes: Routes = [
  { path: 'solicitacao/listar', component: Listar },
  { path: 'crud-workers', component: CrudWorkersComponent },
  { path: 'home-cliente', component: HomeCliente },
  { path: 'home-funcionario', component: HomeFuncionarioComponent },
  { path: 'solicitacao/criar', component: SolicitarManutencaoComponent },
<<<<<<< HEAD
  { path: '', component: LoginComponent },
=======
  { path: 'login', component: LoginComponent },
>>>>>>> 83fb1a8c6fc0b7c25f5688c10cb80bc154b8365b
  { path: 'categoriaEquipamento', component: CategoriaEquipamentoComponent },
];
