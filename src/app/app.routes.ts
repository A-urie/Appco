import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home-page/home-page').then((m) => m.HomePage),
    title: 'StyleBox, la mode accessible livrée chez vous',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login-page/login-page').then((m) => m.LoginPage),
    title: 'Connexion',
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register-page/register-page').then((m) => m.RegisterPage),
    title: 'Créer un compte',
  },
  { path: '**', redirectTo: '' },
];