import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { CrudWorkersComponent } from './pages/crud-workers/crud-workers.component';
import { Listar } from './pages/listar/listar';
import { AreaUsuario } from './pages/area-usuario/area-usuario';
import { Home } from './pages/home/home';
import { SolicitarManutencaoComponent } from './components/solicitar-manutencao/solicitar-manutencao';
import { CategoriaEquipamentoComponent } from './pages/categoria-equipamento/categoria-equipamento.component';
import { Inserir } from './pages/categoria-equipamento/inserir/inserir';
import { authGuard } from './guards/auth.guard';
import { EditarCategoria } from './pages/categoria-equipamento/editar-categoria/editar-categoria';

export const routes: Routes = [
  {
    path: 'area-usuario',
    component: AreaUsuario,
    canActivate: [authGuard],
    data: { roles: ['funcionario', 'cliente'] },
  },
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
    component: Home,
    canActivate: [authGuard],
    data: { roles: ['funcionario', 'cliente'] },
  },
  {
    path: 'solicitacao/criar',
    component: SolicitarManutencaoComponent,
    canActivate: [authGuard],
    data: { roles: ['cliente'] },
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
  {
    path: 'categoriaEquipamento/editarCategoria/:id',
    component: EditarCategoria,
    canActivate: [authGuard],
    data: { roles: ['funcionario'] },
  },
];
