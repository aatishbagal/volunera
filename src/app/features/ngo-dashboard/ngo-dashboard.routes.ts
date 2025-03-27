import { Routes } from '@angular/router';
import { NgoDashboardComponent } from './pages/dashboard-home/ngo-dashboard.component';
import { PageNotFoundComponent } from '../../shared/components/page-not-found/page-not-found.component';

export const NGO_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: NgoDashboardComponent
  },
  {
    path: 'profile',
    component: PageNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'events',
    component: PageNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'volunteers',
    component: PageNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'donations',
    component: PageNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'settings',
    component: PageNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];