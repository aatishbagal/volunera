import { Routes } from '@angular/router';
import { NgoDashboardComponent } from './pages/dashboard-home/ngo-dashboard.component';
import { DashboardNotFoundComponent } from '../../shared/components/dashboard-not-found/dashboard-not-found.component';

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
    component: DashboardNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'events',
    component: DashboardNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'volunteers',
    component: DashboardNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'donations',
    component: DashboardNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'content',
    component: DashboardNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'insights',
    component: DashboardNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'settings',
    component: DashboardNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: '**',
    component: DashboardNotFoundComponent // Use our custom dashboard not found component
  }
];