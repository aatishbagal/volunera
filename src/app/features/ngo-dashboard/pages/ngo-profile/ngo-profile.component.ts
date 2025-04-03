import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Interface definitions
interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  registeredVolunteers: number;
  capacity: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface Statistic {
  id: number;
  label: string;
  value: number;
  icon: string;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'stable';
}

@Component({
  selector: 'app-ngo-profile',
  templateUrl: './ngo-profile.component.html',
  styleUrls: ['./ngo-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class NgoProfileComponent implements OnInit {
  // Organization data
  organization = {
    name: 'GreenEarth Foundation',
    email: 'info@greenearthfoundation.org',
    avatar: '/assets/images/orgs/greenearth.png',
    profileCompletion: 75,
    description: 'GreenEarth Foundation is dedicated to environmental conservation through community action. We focus on urban reforestation, park cleanups, and environmental education programs to create a more sustainable future.',
    website: 'www.greenearthfoundation.org',
    phone: '+1 (555) 123-4567',
    address: '123 Green Street, New York, NY 10001',
    foundedYear: 2015,
    socialMedia: {
      facebook: 'greenearthfoundation',
      twitter: 'greenearth',
      instagram: 'greenearthfdn'
    },
    categories: ['Environment', 'Conservation', 'Education']
  };

  // Stats data
  organizationStats: Statistic[] = [
    { id: 1, label: 'Total Events', value: 124, icon: 'calendar', trend: 12, trendDirection: 'up' },
    { id: 2, label: 'Active Volunteers', value: 753, icon: 'users', trend: 8, trendDirection: 'up' },
    { id: 3, label: 'Total Donations', value: 28500, icon: 'dollar-sign', trend: 5, trendDirection: 'up' },
    { id: 4, label: 'Trees Planted', value: 5420, icon: 'tree', trend: 0, trendDirection: 'stable' }
  ];

  // Recent events
  recentEvents: Event[] = [
    {
      id: 1, 
      title: 'Community Garden Planting', 
      date: new Date(2025, 2, 15), 
      location: 'Central Park, NY', 
      registeredVolunteers: 25, 
      capacity: 25,
      status: 'completed'
    },
    {
      id: 2, 
      title: 'Park Cleanup Drive', 
      date: new Date(2025, 2, 28), 
      location: 'Riverside Park, NY', 
      registeredVolunteers: 12, 
      capacity: 20,
      status: 'upcoming'
    },
    {
      id: 3, 
      title: 'Environmental Workshop', 
      date: new Date(2025, 1, 10), 
      location: 'Public Library, NY', 
      registeredVolunteers: 35, 
      capacity: 40,
      status: 'completed'
    },
    {
      id: 4, 
      title: 'Tree Planting Initiative', 
      date: new Date(2025, 3, 5), 
      location: 'Botanical Garden, NY', 
      registeredVolunteers: 8, 
      capacity: 15,
      status: 'upcoming'
    },
    {
      id: 5, 
      title: 'Youth Environmental Camp', 
      date: new Date(2025, 2, 5), 
      location: 'Summit Park, NY', 
      registeredVolunteers: 18, 
      capacity: 20,
      status: 'completed'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialize profile component
  }
  
  // Format currency for display
  formatCurrency(value: number): string {
    return '$' + value.toLocaleString();
  }
  
  // Get trend icon class based on direction
  getTrendIconClass(direction?: 'up' | 'down' | 'stable'): string {
    if (!direction) return 'fa-minus text-secondary'; // Default for undefined
    
    switch (direction) {
      case 'up': return 'fa-arrow-up text-success';
      case 'down': return 'fa-arrow-down text-danger';
      default: return 'fa-minus text-secondary';
    }
  }
  
  // Navigate to edit profile
  editProfile(): void {
    console.log('Navigate to edit profile');
    // This would navigate to the edit profile page
  }
  
  // Format social media URL
  getSocialUrl(platform: string, username: string): string {
    switch (platform) {
      case 'facebook': return `https://facebook.com/${username}`;
      case 'twitter': return `https://twitter.com/${username}`;
      case 'instagram': return `https://instagram.com/${username}`;
      default: return '#';
    }
  }
}