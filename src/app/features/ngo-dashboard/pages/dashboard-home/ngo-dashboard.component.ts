import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OrganizationStatsComponent } from '../../components/organization-stats/organization-stats.component';
import { EventManagementComponent } from '../../components/event-management/event-management.component';

// Create a pipe for safe URLs
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

// Interface definitions
interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  registeredVolunteers: number;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface Donation {
  id: number;
  type: 'financial' | 'items';
  donor: string;
  date: Date;
  amount?: number;
  items?: string;
  status: 'received' | 'pending';
}

interface Post {
  id: number;
  orgName: string;
  orgAvatar: string;
  content: string;
  date: Date;
  image?: string;
  likes: number;
  comments: number;
  reach: number;
  isOwnOrg: boolean;
}

@Component({
  selector: 'app-ngo-dashboard',
  templateUrl: './ngo-dashboard.component.html',
  styleUrls: ['./ngo-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    OrganizationStatsComponent,
    EventManagementComponent,
    SafePipe
  ]
})
export class NgoDashboardComponent implements OnInit {
  // Sidebar state - we will only use this on mobile now
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isMobileView = false;
  
  // Organization data
  organization = {
    name: 'GreenEarth Foundation',
    email: 'info@greenearthfoundation.org',
    avatar: '/assets/images/orgs/greenearth.png',
    profileCompletion: 75
  };

  // Upcoming events
  upcomingEvents: Event[] = [
    { 
      id: 1, 
      title: 'Community Garden Planting', 
      date: new Date(2025, 2, 25), 
      location: 'Central Park, NY', 
      registeredVolunteers: 18, 
      capacity: 25,
      status: 'upcoming'
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
      title: 'Tree Planting Workshop', 
      date: new Date(2025, 3, 5), 
      location: 'Botanical Garden, NY', 
      registeredVolunteers: 8, 
      capacity: 15,
      status: 'upcoming'
    }
  ];

  // Recent donations
  recentDonations: Donation[] = [
    {
      id: 1,
      type: 'financial',
      donor: 'John Smith',
      date: new Date(2025, 2, 22),
      amount: 250,
      status: 'received'
    },
    {
      id: 2,
      type: 'items',
      donor: 'Clara Martinez',
      date: new Date(2025, 2, 21),
      items: 'Gardening tools (5 spades, 3 rakes, 10 gloves)',
      status: 'received'
    },
    {
      id: 3,
      type: 'financial',
      donor: 'Robert Lee',
      date: new Date(2025, 2, 19),
      amount: 100,
      status: 'received'
    }
  ];

  // All NGO posts (including own and other NGOs)
  allNgoPosts: Post[] = [
    {
      id: 1,
      orgName: 'GreenEarth Foundation',
      orgAvatar: '/assets/images/orgs/greenearth.png',
      content: 'Join us for our upcoming tree planting event this weekend! We\'ll be planting 100 native trees in Central Park to combat urban heat and improve air quality.',
      date: new Date(2025, 2, 28),
      image: '/assets/images/posts/tree-planting.jpg',
      likes: 42,
      comments: 7,
      reach: 523,
      isOwnOrg: true
    },
    {
      id: 2,
      orgName: 'GreenEarth Foundation',
      orgAvatar: '/assets/images/orgs/greenearth.png',
      content: 'Thanks to all our amazing volunteers who helped with last week\'s park cleanup! Together we collected over 200 lbs of trash and recyclables.',
      date: new Date(2025, 2, 20),
      image: '/assets/images/posts/cleanup-results.jpg',
      likes: 35,
      comments: 5,
      reach: 412,
      isOwnOrg: true
    },
    {
      id: 3,
      orgName: 'Tech4All',
      orgAvatar: '/assets/images/orgs/tech4all.png',
      content: 'We\'re excited to announce our new digital literacy program for underserved communities! Starting next month, we\'ll be offering free computer skills workshops every weekend.',
      date: new Date(2025, 2, 27),
      image: '/assets/images/posts/digital-literacy.jpg',
      likes: 38,
      comments: 6,
      reach: 470,
      isOwnOrg: false
    },
    {
      id: 4,
      orgName: 'Urban Wildlife Protection',
      orgAvatar: '/assets/images/orgs/wildlife.png',
      content: 'Our wildlife rescue team successfully rehabilitated and released 5 injured birds back into their natural habitat this week! We\'re grateful for the support of our volunteers and donors.',
      date: new Date(2025, 2, 25),
      image: '/assets/images/posts/wildlife-release.jpg',
      likes: 51,
      comments: 8,
      reach: 612,
      isOwnOrg: false
    },
    {
      id: 5,
      orgName: 'GreenEarth Foundation',
      orgAvatar: '/assets/images/orgs/greenearth.png',
      content: 'We\'re excited to announce our new partnership with the City Parks Department to expand our urban forestry initiative!',
      date: new Date(2025, 2, 15),
      likes: 28,
      comments: 4,
      reach: 378,
      isOwnOrg: true
    }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  // Check screen size on window resize
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  // Check if mobile view
  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 768;
    
    // Auto-collapse sidebar on desktop if width is between 768px and 1200px
    if (window.innerWidth > 768 && window.innerWidth < 1200) {
      this.isSidebarCollapsed = true;
    } else if (window.innerWidth >= 1200) {
      this.isSidebarCollapsed = false;
    }
  }

  // Toggle mobile menu
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Add/remove body scroll lock when mobile menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  // Toggle sidebar on desktop or mobile menu on mobile
  toggleSidebarOrMenu() {
    if (this.isMobileView) {
      this.toggleMobileMenu();
    } else {
      // On desktop, just toggle sidebar collapse state
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  // Method to create a new event
  createEvent(): void {
    console.log('Create new event');
    // This would navigate to event creation page
  }

  // Method to post an update
  createPost(): void {
    console.log('Create new post');
    // This would open a post creation modal or navigate to post creation page
  }

  // Method to view all events
  viewAllEvents(): void {
    console.log('View all events');
    // This would navigate to events management page
  }

  // Method to view all donations
  viewAllDonations(): void {
    console.log('View all donations');
    // This would navigate to donations management page
  }

  // Method to view post insights
  viewPostInsights(post: Post): void {
    console.log('View insights for post:', post);
    // This would open post insights modal or navigate to post insights page
  }
}