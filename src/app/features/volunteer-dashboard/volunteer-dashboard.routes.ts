import { Routes } from '@angular/router';
import { VolunteerDashboardComponent } from './pages/dashboard-home/volunteer-dashboard.component';
import { PageNotFoundComponent } from '../../shared/components/page-not-found/page-not-found.component';

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
    component: PageNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'events',
    component: PageNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'leaderboards',
    component: PageNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'settings',
    component: PageNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: 'history',
    component: PageNotFoundComponent // Will be replaced with actual component later
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];