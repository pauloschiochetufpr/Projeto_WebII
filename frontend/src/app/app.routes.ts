import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { Listar } from './pages/listar/listar';
import { Home } from './pages/home/home';
import { SolicitarManutencaoComponent } from './components/solicitar-manutencao/solicitar-manutencao';
import { CategoriaEquipamentoComponent } from './pages/categoria-equipamento/categoria-equipamento.component';
import { Inserir } from './pages/categoria-equipamento/inserir/inserir';
//import { authGuard } from './guards/auth.guard';
import { EditarCategoria } from './pages/categoria-equipamento/editar-categoria/editar-categoria';
import { ListarUsuario } from './pages/crud-usuarios/listar-usuario/listar-usuario';
import { InserirEditarUsuario } from './pages/crud-usuarios/inserir-editar-usuario/inserir-editar-usuario';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'solicitacao',
    component: Listar,
    //canActivate: [authGuard],
    data: { roles: ['funcionario'] },
  },
  {
    path: 'usuarios',
    redirectTo: 'usuarios/listar'
  },
  {
    path: 'usuarios/listar',
    component: ListarUsuario,
    //canActivate: [authGuard],
    data: { roles: ['funcionario'] },
  },
  {
    path: 'usuarios/novo',
    component: InserirEditarUsuario,
    canActivate: [authGuard],
    data: { roles: ['funcionario']},
  },
  {
    path: 'usuarios/editar/:id',
    component: InserirEditarUsuario,
    canActivate: [authGuard],
    data: { roles: ['funcionario']}
  },
  {
    path: '',
    component: Home,
   // canActivate: [authGuard],
    data: { roles: ['funcionario', 'cliente'] },
  },
  {
    path: 'solicitacao/criar',
    component: SolicitarManutencaoComponent,
   // canActivate: [authGuard],
    data: { roles: ['cliente'] },
  },
  {
    path: 'login',
    component: LoginComponent,
   // canActivate: [authGuard],
    data: { roles: ['funcionario', 'cliente'] },
  },
  {
    path: 'categoriaEquipamento',
    component: CategoriaEquipamentoComponent,
    //canActivate: [authGuard],
    //data: { roles: ['funcionario'] },
  },
  {
    path: 'categoriaEquipamento/novaCategoria',
    component: Inserir,
    //canActivate: [authGuard],
    //data: { roles: ['funcionario'] },
  },
  {
    path: 'categoriaEquipamento/editarCategoria/:id',
    component: EditarCategoria,
    //canActivate: [authGuard],
    //data: { roles: ['funcionario'] }, 
  }
];
