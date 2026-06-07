import { Routes } from '@angular/router';
//Este archivo se encarga de Redirijir la aplicacion
//La neta esto es nuevo xd
//Pero en pocas palabras utiliza funciones Lambda para cargar el componente
//Dependiendo de la palabra que este en la URL carga ese componente
export const routes: Routes = [
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
    path: '**',
    redirectTo: 'productos' // cualquier ruta que no exista redirige a productos
  }
];