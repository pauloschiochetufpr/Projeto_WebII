import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { BtnFormCrudWorkersComponent } from './btn-form-crud-workers/btn-form-crud-workers.component';
import { CrudWorkersComponent } from './crud-workers/crud-workers.component';
import { Listar } from './listar/listar';

export const routes: Routes = [
  { path: 'listar', component: Listar },
  { path: 'btn-form-crud-workers', component: BtnFormCrudWorkersComponent },
  { path: 'crud-workers', component: CrudWorkersComponent },
  { path: '', component: LoginComponent },
];
