import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, UserProfile } from '../../../../auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-volunteer-dashboard-layout',
  templateUrl: './volunteer-dashboard-layout.component.html',
  styleUrls: ['./volunteer-dashboard-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class VolunteerDashboardLayoutComponent implements OnInit, OnDestroy {
  // Sidebar state - we will only use this on mobile now
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isMobileView = false;
  
  // Profile dropdown state
  isProfileDropdownOpen = false;
  
  // Logout confirmation state
  showLogoutConfirmation = false;
  
  // User data - will be populated from Firestore
  user: UserProfile | null = null;
  
  // Default user data as fallback
  defaultUser = {
    displayName: 'Volunteer',
    email: 'loading@example.com',
    photoURL: '/assets/images/avatar.png',
    profileCompletion: 45
  };
  
  // Volunteer profile specific data
  volunteerProfileData = {
    profileCompletion: 45
  };

  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Load user profile data
  private loadUserProfile(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user;
      
      // In the future, we could load volunteer-specific profile data here
      // For now, we're using the default value
      // Example of future implementation:
      // this.volunteerService.getVolunteerProfile(user.uid).then(profile => {
      //   if (profile) {
      //     this.volunteerProfileData.profileCompletion = profile.profileCompletion;
      //   }
      // });
    });
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
  
  // Toggle profile dropdown
  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }
  
  // Close profile dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const profileElement = document.querySelector('.user-profile-container');
    if (profileElement && !profileElement.contains(event.target as Node) && this.isProfileDropdownOpen) {
      this.isProfileDropdownOpen = false;
    }
  }
  
  // Show logout confirmation modal
  confirmLogout(): void {
    this.showLogoutConfirmation = true;
  }
  
  // Handle logout confirmation
  async handleLogout(confirmed: boolean): Promise<void> {
    this.showLogoutConfirmation = false;
    
    if (confirmed) {
      try {
        await this.authService.logout();
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  }
  
  // Get profile completion percentage
  getProfileCompletion(): number {
    // Check if we can get profileCompletion from Firebase, otherwise use default value
    // This would ideally come from a volunteer profile document in Firestore
    return this.volunteerProfileData.profileCompletion;
  }
}