import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-volunteer-dashboard',
  templateUrl: './volunteer-dashboard.component.html',
  styleUrls: ['./volunteer-dashboard.component.scss']
})
export class VolunteerDashboardComponent implements OnInit {
  user = {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: '/assets/images/avatar.png',
    profileCompletion: 45
  };

  stats = {
    hoursVolunteered: 78,
    pointsEarned: 2540,
    eventsAttended: 12,
    rank: 32
  };

  recentActivities = [
    { type: 'event', title: 'Beach Cleanup', organization: 'OceanGuardians', date: new Date(2025, 2, 20), points: 120 },
    { type: 'donation', title: 'Book Donation', organization: 'LiteracyFirst', date: new Date(2025, 2, 18), points: 75 },
    { type: 'event', title: 'Food Bank Volunteering', organization: 'CommunityTableNYC', date: new Date(2025, 2, 15), points: 150 }
  ];

  upcomingEvents = [
    { id: 1, title: 'Community Garden Planting', organization: 'GreenEarth Foundation', date: new Date(2025, 2, 25), location: 'Central Park, NY', registered: true },
    { id: 2, title: 'Senior Tech Workshop', organization: 'Tech4All', date: new Date(2025, 2, 28), location: 'Liberty Center, NY', registered: true },
    { id: 3, title: 'Animal Shelter Help Day', organization: 'PetRescue', date: new Date(2025, 3, 2), location: 'Happy Paws Shelter, Brooklyn', registered: false }
  ];

  recommendedNGOs = [
    { id: 1, name: 'GreenEarth Foundation', category: 'Environment', match: 95 },
    { id: 2, name: 'Tech4All', category: 'Education', match: 88 },
    { id: 3, name: 'HomelessSupport', category: 'Social Welfare', match: 82 }
  ];

  constructor() { }

  ngOnInit(): void {
    // Load dashboard data
  }

  navigateTo(section: string): void {
    console.log(`Navigating to ${section}`);
    // Will be implemented with actual navigation
  }
}