import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Login } from './app/login/login';
import { CrudWorkersComponent } from './app/crud-workers/crud-workers.component';
import { BtnFormCrudWorkersComponent } from './app/btn-form-crud-workers/btn-form-crud-workers.component';


bootstrapApplication(App, appConfig).catch((err) => console.error(err));
bootstrapApplication(Login, appConfig).catch((err) => console.error(err));
bootstrapApplication(CrudWorkersComponent, appConfig).catch((err) => console.error(err)); 
bootstrapApplication(BtnFormCrudWorkersComponent, appConfig).catch((err) => console.error(err))