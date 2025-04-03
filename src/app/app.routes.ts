import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { HomeComponent } from './component_files/home/home.component';
import { NotFoundComponent } from './component_files/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'auth', 
    children: [
      { 
        path: 'volunteer', 
        children: [
          { 
            path: 'login', 
            loadComponent: () => import('./auth/login-volunteer/login-volunteer.component').then(m => m.LoginVolunteerComponent) 
          },
          { 
            path: 'onboarding', 
            loadComponent: () => import('./auth/onboarding-volunteer/onboarding-volunteer.component').then(m => m.OnboardingVolunteerComponent),
            canActivate: [AuthGuard],
            data: { userType: 'volunteer', requiresOnboarding: false }
          }
        ] 
      },
      { 
        path: 'ngo', 
        children: [
          { 
            path: 'login', 
            loadComponent: () => import('./auth/login-ngo/login-ngo.component').then(m => m.LoginNgoComponent) 
          },
          { 
            path: 'onboarding', 
            loadComponent: () => import('./auth/onboarding-ngo/onboarding-ngo.component').then(m => m.OnboardingNgoComponent),
            canActivate: [AuthGuard],
            data: { userType: 'ngo', requiresOnboarding: false }
          }
        ] 
      }
    ] 
  },
  { 
    path: 'volunteer', 
    children: [
      { 
        path: 'dashboard',
        loadChildren: () => import('./features/volunteer-dashboard/volunteer-dashboard.module').then(m => m.VolunteerDashboardModule),
        canActivate: [AuthGuard],
        data: { userType: 'volunteer', requiresOnboarding: true }
      },
      // Catch-all route for volunteer section
      { 
        path: '**', 
        loadComponent: () => import('./shared/components/dashboard-not-found/dashboard-not-found.component').then(m => m.DashboardNotFoundComponent),
        canActivate: [AuthGuard],
        data: { userType: 'volunteer', requiresOnboarding: true, dashboardType: 'volunteer' }
      }
    ] 
  },
  { 
    path: 'ngo', 
    children: [
      { 
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      { 
        path: 'dashboard',
        loadChildren: () => import('./features/ngo-dashboard/ngo-dashboard.module').then(m => m.NgoDashboardModule),
        canActivate: [AuthGuard],
        data: { userType: 'ngo', requiresOnboarding: true }
      },
      { 
        path: 'verification-pending',
        loadComponent: () => import('./auth/verification-pending/verification-pending.component').then(m => m.VerificationPendingComponent),
        canActivate: [AuthGuard],
        data: { userType: 'ngo', requiresOnboarding: true }
      },
      // Catch-all route for ngo section
      { 
        path: '**', 
        loadComponent: () => import('./shared/components/dashboard-not-found/dashboard-not-found.component').then(m => m.DashboardNotFoundComponent),
        canActivate: [AuthGuard],
        data: { userType: 'ngo', requiresOnboarding: true, dashboardType: 'ngo' }
      }
    ] 
  },
  { path: 'join-volunteer', redirectTo: '/auth/volunteer/login', pathMatch: 'full' },
  { path: 'register-ngo', redirectTo: '/auth/ngo/login', pathMatch: 'full' },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];