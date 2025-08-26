import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { BtnFormCrudWorkersComponent } from './components/btn-form-crud-workers/btn-form-crud-workers.component';
import { CrudWorkersComponent } from './pages/crud-workers/crud-workers.component';
import { Listar } from './pages/listar/listar';

export const routes: Routes = [
  { path: 'listar', component: Listar },
  { path: 'btn-form-crud-workers', component: BtnFormCrudWorkersComponent },
  { path: 'crud-workers', component: CrudWorkersComponent },
  { path: '', component: LoginComponent },
];
