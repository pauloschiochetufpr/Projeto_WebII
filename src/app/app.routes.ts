import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { App } from './app';
import { BtnFormCrudWorkersComponent } from './btn-form-crud-workers/btn-form-crud-workers.component';
import { CrudWorkersComponent } from './crud-workers/crud-workers.component';

export const routes: Routes = [
  { path: 'btn-form-crud-workers', component: BtnFormCrudWorkersComponent },
  { path: 'crud-workers', component: CrudWorkersComponent },
  { path: '', component: LoginComponent },
];
