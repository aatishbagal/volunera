import { Routes } from '@angular/router';
import { VolunteerDashboardComponent } from './pages/dashboard-home/volunteer-dashboard.component';
import { DashboardNotFoundComponent } from '../../shared/components/dashboard-not-found/dashboard-not-found.component';

export const VOLUNTEER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: VolunteerDashboardComponent
  },
  {
    path: 'profile',
    component: DashboardNotFoundComponent  // Will be replaced with actual component later
  },
  {
    path: 'events',
    component: DashboardNotFoundComponent  // Will be replaced with actual component later
  },
  {
    path: 'leaderboards',
    component: DashboardNotFoundComponent  // Will be replaced with actual component later
  },
  {
    path: 'settings',
    component: DashboardNotFoundComponent  // Will be replaced with actual component later
  },
  {
    path: 'history',
    component: DashboardNotFoundComponent  // Will be replaced with actual component later
  },
  {
    path: '**',
    component: DashboardNotFoundComponent 
  }
];