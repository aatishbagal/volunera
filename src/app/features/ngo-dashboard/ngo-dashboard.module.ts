import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NGO_ROUTES } from './ngo-dashboard.routes';

// Import standalone components
import { NgoDashboardComponent } from './pages/dashboard-home/ngo-dashboard.component';
import { VolunteerManagementComponent } from './components/volunteer-management/volunteer-management.component';
import { ActiveEventsComponent } from './components/active-events/active-events.component';

@NgModule({
  imports: [
    RouterModule.forChild(NGO_ROUTES),
    SharedModule,
    // Import standalone components here instead of declaring them
    NgoDashboardComponent,
    VolunteerManagementComponent,
    ActiveEventsComponent
  ]
})
export class NgoDashboardModule { }