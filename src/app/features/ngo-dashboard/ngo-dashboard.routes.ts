import { Routes } from '@angular/router';
import { NgoDashboardLayoutComponent } from './components/layout/ngo-dashboard-layout.component';
import { NgoDashboardComponent } from './pages/dashboard-home/ngo-dashboard.component';
import { NgoProfileComponent } from './pages/ngo-profile/ngo-profile.component';
import { DashboardNotFoundComponent } from '../../shared/components/dashboard-not-found/dashboard-not-found.component';

export const NGO_ROUTES: Routes = [
  {
    path: '',
    component: NgoDashboardLayoutComponent,
    children: [
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
        component: NgoProfileComponent
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
        path: 'insights',
        component: DashboardNotFoundComponent // Will be replaced with actual component later
      },
      {
        path: 'settings',
        component: DashboardNotFoundComponent // Will be replaced with actual component later
      },
      {
        path: '**',
        component: DashboardNotFoundComponent // Use custom dashboard not found component
      }
    ]
  }
];