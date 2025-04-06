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
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: NgoDashboardComponent
      },
      {
        path: 'profile',
        component: NgoProfileComponent
      },
      {
        path: 'events',
        component: DashboardNotFoundComponent
      },
      {
        path: 'volunteers',
        component: DashboardNotFoundComponent
      },
      {
        path: 'donations',
        component: DashboardNotFoundComponent
      },
      {
        path: 'insights',
        component: DashboardNotFoundComponent
      },
      {
        path: 'settings',
        component: DashboardNotFoundComponent
      },
      {
        path: '**',
        component: DashboardNotFoundComponent
      }
    ]
  }
];