import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgoService, NgoProfile } from '../../../../../app/auth/services/ngo.service';
import { AuthService } from '../../../../../app/auth/services/auth.service';

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
    RouterModule,
    FormsModule
  ]
})
export class NgoProfileComponent implements OnInit {
  // Organization data (will be populated from Firestore)
  organization: NgoProfile | null = null;
  
  // Default organization data as fallback
  defaultOrganization = {
    name: 'My Organization',
    email: 'loading@example.com',
    avatar: 'assets/images/orgs/default-ngo.png',
    profileCompletion: 30,
    description: 'Organization description not added yet.',
    website: '',
    phone: '',
    address: '',
    foundedYear: new Date().getFullYear(),
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: ''
    },
    categories: ['General']
  };
  
  // Current year for template use
  currentYear = new Date().getFullYear();
  
  // Editing state
  isEditProfileOpen = false;
  editForm: Partial<NgoProfile> = {};
  newCategory: string = '';

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

  constructor(
    private ngoService: NgoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Load NGO profile data
    this.loadNgoProfile();
  }
  
  // Load NGO profile data from service
  private loadNgoProfile(): void {
    this.ngoService.currentNgo$.subscribe(ngo => {
      if (ngo) {
        this.organization = ngo;
      }
    });
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
  
  // Get current year for template use
  getCurrentYear(): number {
    return this.currentYear;
  }
  
  // Open edit profile popup
  editProfile(): void {
    // Initialize form with current values
    this.editForm = {
      name: this.organization?.name || this.defaultOrganization.name,
      description: this.organization?.description || this.defaultOrganization.description,
      website: this.organization?.website || this.defaultOrganization.website,
      phone: this.organization?.phone || this.defaultOrganization.phone,
      address: this.organization?.address || this.defaultOrganization.address,
      foundedYear: this.organization?.foundedYear || this.defaultOrganization.foundedYear,
      categories: [...(this.organization?.categories || this.defaultOrganization.categories)],
      socialMedia: {
        facebook: this.organization?.socialMedia?.facebook || '',
        twitter: this.organization?.socialMedia?.twitter || '',
        instagram: this.organization?.socialMedia?.instagram || ''
      }
    };
    
    this.isEditProfileOpen = true;
  }
  
  // Close edit profile popup
  closeEditProfile(): void {
    this.isEditProfileOpen = false;
  }
  
  // Save profile changes
  async saveProfile(): Promise<void> {
    try {
      // Save changes to Firestore
      const success = await this.ngoService.updateNgoProfile(this.editForm);
      
      if (success) {
        // Close the popup on success
        this.isEditProfileOpen = false;
      } else {
        // Handle error
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }
  
  // Add a new category
  addCategory(category: string): void {
    if (!category || category.trim() === '') return;
    
    if (!this.editForm.categories) {
      this.editForm.categories = [];
    }
    
    if (!this.editForm.categories.includes(category)) {
      this.editForm.categories.push(category.trim());
    }
    
    this.newCategory = '';
  }
  
  // Remove a category
  removeCategory(category: string): void {
    if (this.editForm.categories) {
      this.editForm.categories = this.editForm.categories.filter(c => c !== category);
    }
  }
  
  // Format social media URL
  getSocialUrl(platform: string, username?: string): string {
    if (!username) return '#';
    
    switch (platform) {
      case 'facebook': return `https://facebook.com/${username}`;
      case 'twitter': return `https://twitter.com/${username}`;
      case 'instagram': return `https://instagram.com/${username}`;
      default: return '#';
    }
  }
}