import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/clientes/login/login')
      .then(m => m.Login)
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/clientes/register/register')
      .then(m => m.Register)
  },
  {
    path: '',
    loadComponent: () => import('./features/layout/app-nav/app-nav.component')
      .then(m => m.AppNavComponent),
    children: [
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
      },
      {
        path: 'productos',
        loadComponent: () => import('./features/productos/todos-los-productos/todos-los-productos')
          .then(m => m.TodosLosProductos)
      },
      {
        path: 'productos/:id',
        loadComponent: () => import('./features/productos/un-producto/un-producto')
          .then(m => m.UnProducto)
      },
      {
        path: 'grupos',
        loadComponent: () => import('./features/productos/grupos-de-productos/grupos-de-productos')
          .then(m => m.GruposDeProductos)
      },
      {
        path: 'grupos/:id',
        loadComponent: () => import('./features/productos/grupos-de-productos-individual/grupos-de-productos-individual')
          .then(m => m.GruposDeProductosIndividual)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'productos'
  }
];