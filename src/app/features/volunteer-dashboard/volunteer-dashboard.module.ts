import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { VOLUNTEER_ROUTES } from './volunteer-dashboard.routes';

// Import standalone components
import { VolunteerDashboardComponent } from './pages/dashboard-home/volunteer-dashboard.component';
import { ImpactCardComponent } from './components/impact-card/impact-card.component';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';

@NgModule({
  imports: [
    RouterModule.forChild(VOLUNTEER_ROUTES),
    SharedModule,
    // Import standalone components here instead of declaring them
    VolunteerDashboardComponent,
    ImpactCardComponent,
    UpcomingEventsComponent,
    RecentActivityComponent
  ]
})
export class VolunteerDashboardModule { }