import { Routes } from '@angular/router';
import { VolunteerDashboardLayoutComponent } from './components/layout/volunteer-dashboard-layout.component';
import { VolunteerDashboardComponent } from './pages/dashboard-home/volunteer-dashboard.component';
import { VolunteerProfileComponent } from './pages/volunteer-profile/volunteer-profile.component';
import { DashboardNotFoundComponent } from '../../shared/components/dashboard-not-found/dashboard-not-found.component';

export const VOLUNTEER_ROUTES: Routes = [
  {
    path: '',
    component: VolunteerDashboardLayoutComponent,
    children: [
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
        component: VolunteerProfileComponent
      },
      {
        path: 'donate',
        component: DashboardNotFoundComponent
      },
      {
        path: 'team-up',
        component: DashboardNotFoundComponent
      },
      {
        path: 'events',
        component: DashboardNotFoundComponent
      },
      {
        path: 'leaderboards',
        component: DashboardNotFoundComponent
      },
      {
        path: '**',
        component: DashboardNotFoundComponent
      }
    ]
  }
];