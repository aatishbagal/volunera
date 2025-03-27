import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgoDashboardComponent } from './pages/dashboard-home/ngo-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { NGO_ROUTES } from './ngo-dashboard.routes';

// You'll need to create these components later
import { VolunteerManagementComponent } from './components/volunteer-management/volunteer-management.component';
import { ActiveEventsComponent } from './components/active-events/active-events.component';

@NgModule({
  declarations: [
    NgoDashboardComponent,
    VolunteerManagementComponent,
    ActiveEventsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(NGO_ROUTES),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class NgoDashboardModule { }