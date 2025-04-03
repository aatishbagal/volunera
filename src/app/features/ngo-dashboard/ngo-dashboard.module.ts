import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgoDashboardLayoutComponent } from './components/layout/ngo-dashboard-layout.component';
import { NgoDashboardComponent } from './pages/dashboard-home/ngo-dashboard.component';
import { NgoProfileComponent } from './pages/ngo-profile/ngo-profile.component';
import { DashboardNotFoundComponent } from '../../shared/components/dashboard-not-found/dashboard-not-found.component';
import { NGO_ROUTES } from './ngo-dashboard.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(NGO_ROUTES),
    NgoDashboardLayoutComponent,
    NgoDashboardComponent,
    NgoProfileComponent
  ]
})
export class NgoDashboardModule { }