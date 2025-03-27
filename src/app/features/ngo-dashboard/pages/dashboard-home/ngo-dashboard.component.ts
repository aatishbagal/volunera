import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VolunteerManagementComponent } from '../../components/volunteer-management/volunteer-management.component';
import { ActiveEventsComponent } from '../../components/active-events/active-events.component';

@Component({
  selector: 'app-ngo-dashboard',
  templateUrl: './ngo-dashboard.component.html',
  styleUrls: ['./ngo-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    VolunteerManagementComponent,
    ActiveEventsComponent
  ]
})
export class NgoDashboardComponent implements OnInit {
  organization = {
    name: 'GreenEarth Foundation',
    email: 'contact@greenearth.org',
    avatar: '/assets/images/ngo-logo.png',
    profileCompletion: 72
  };

  stats = {
    totalVolunteers: 248,
    activeVolunteers: 187,
    hoursContributed: 3240,
    eventsCompleted: 34
  };

  recentRegistrations = [
    { id: 1, name: 'James Wilson', email: 'james.w@example.com', date: new Date(2025, 2, 21), avatar: '/assets/images/avatars/james.jpg' },
    { id: 2, name: 'Emma Davis', email: 'emma.d@example.com', date: new Date(2025, 2, 20), avatar: '/assets/images/avatars/emma.jpg' },
    { id: 3, name: 'Michael Brown', email: 'michael.b@example.com', date: new Date(2025, 2, 19), avatar: '/assets/images/avatars/michael.jpg' }
  ];

  activeEvents = [
    { id: 1, title: 'Community Garden Planting', date: new Date(2025, 2, 25), location: 'Central Park, NY', registrations: 18, maxSpots: 25 },
    { id: 2, title: 'Urban Forest Clean-up', date: new Date(2025, 2, 28), location: 'Riverside Park, NY', registrations: 22, maxSpots: 30 },
    { id: 3, title: 'Environmental Workshop', date: new Date(2025, 3, 5), location: 'Liberty Community Center', registrations: 12, maxSpots: 20 }
  ];

  donationStats = {
    monthly: 3850,
    previousMonth: 3260,
    monthlyChange: 18.1,
    totalItems: 124,
    previousItems: 98,
    itemsChange: 26.5
  };

  constructor() { }

  ngOnInit(): void {
    // Initialize dashboard data if needed
  }

  navigateTo(section: string): void {
    console.log(`Navigating to ${section}`);
    // Will be implemented with actual navigation
  }
}