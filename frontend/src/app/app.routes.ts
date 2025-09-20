import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { BtnFormCrudWorkersComponent } from './components/btn-form-crud-workers/btn-form-crud-workers.component';
import { CrudWorkersComponent } from './pages/crud-workers/crud-workers.component';
import { CrudServicosComponent } from './pages/crud-servicos/crud-servicos.component';
import { Listar } from './pages/listar/listar';
import { HomeCliente } from './pages/home-cliente/home-cliente';
import { HomeFuncionarioComponent } from './pages/home-funcionario/home-funcionario';

export const routes: Routes = [
  { path: 'solicitacao/listar', component: Listar },
  { path: 'btn-form-crud-workers', component: BtnFormCrudWorkersComponent },
  { path: 'crud-workers', component: CrudWorkersComponent },
  { path: 'crud-servicos', component: CrudServicosComponent },
  { path: 'home-cliente', component: HomeCliente },
  { path: 'home-funcionario', component: HomeFuncionarioComponent },
  { path: 'solicitacao/criar', component: CrudServicosComponent },
  { path: '', component: LoginComponent },
];
