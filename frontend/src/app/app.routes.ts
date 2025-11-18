import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { CrudWorkersComponent } from './pages/crud-workers/crud-workers.component';
import { Listar } from './pages/listar/listar';
import { Home } from './pages/home/home';
import { HomeFuncionario } from './components/home-funcionario/home-funcionario';
import { SolicitarManutencaoComponent } from './components/solicitar-manutencao/solicitar-manutencao';
import { CategoriaEquipamentoComponent } from './pages/categoria-equipamento/categoria-equipamento.component';
import { Inserir } from './pages/categoria-equipamento/inserir/inserir';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'solicitacao',
    component: Listar,
    canActivate: [authGuard],
    data: { roles: ['funcionario'] },
  },
  {
    path: 'crud-workers',
    component: CrudWorkersComponent,
    canActivate: [authGuard],
    data: { roles: ['funcionario'] },
  },
  {
    path: '',
    component: CrudWorkersComponent,
    canActivate: [authGuard],
    data: { roles: ['funcionario', 'cliente'] },
  },
  {
    path: 'home-funcionario',
    component: CrudWorkersComponent,
  },
  {
    path: 'solicitacao/criar',
    component: SolicitarManutencaoComponent,
    canActivate: [authGuard],
    data: { roles: ['funcionario'] },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
    data: { roles: ['funcionario', 'cliente'] },
  },
  {
    path: 'categoriaEquipamento',
    component: CategoriaEquipamentoComponent,
    canActivate: [authGuard],
    data: { roles: ['funcionario'] },
  },
  {
    path: 'categoriaEquipamento/novaCategoria',
    component: Inserir,
    canActivate: [authGuard],
    data: { roles: ['funcionario'] },
  },
];
