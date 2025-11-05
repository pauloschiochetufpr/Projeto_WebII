import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { CrudWorkersComponent } from './pages/crud-workers/crud-workers.component';
import { Listar } from './pages/listar/listar';
import { HomeCliente } from './pages/home-cliente/home-cliente';
import { HomeFuncionarioComponent } from './pages/home-funcionario/home-funcionario';
import { SolicitarManutencaoComponent } from './components/solicitar-manutencao/solicitar-manutencao';
import { CategoriaEquipamentoComponent } from './pages/categoria-equipamento/categoria-equipamento.component';
import { Inserir } from './pages/categoria-equipamento/inserir/inserir';

export const routes: Routes = [
  { path: 'solicitacao/listar', component: Listar },
  { path: 'crud-workers', component: CrudWorkersComponent },
  { path: '', component: HomeCliente },
  { path: 'home-funcionario', component: HomeFuncionarioComponent },
  { path: 'solicitacao/criar', component: SolicitarManutencaoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'categoriaEquipamento', component: CategoriaEquipamentoComponent },
  { path: 'categoriaEquipamento/novaCategoria', component: Inserir}
];
