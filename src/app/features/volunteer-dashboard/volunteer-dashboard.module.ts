import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VolunteerDashboardComponent } from './pages/dashboard-home/volunteer-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { VOLUNTEER_ROUTES } from './volunteer-dashboard.routes';

// Dashboard components
import { ImpactCardComponent } from './components/impact-card/impact-card.component';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';

@NgModule({
  declarations: [
    VolunteerDashboardComponent,
    ImpactCardComponent,
    UpcomingEventsComponent,
    RecentActivityComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(VOLUNTEER_ROUTES),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class VolunteerDashboardModule { }