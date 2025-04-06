import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../../app/auth/services/auth.service';
import { NgoService, NgoProfile } from '../../../../../app/auth/services/ngo.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from '../../../../shared/global-services/toast.service';

@Component({
  selector: 'app-ngo-dashboard-layout',
  templateUrl: './ngo-dashboard-layout.component.html',
  styleUrls: ['./ngo-dashboard-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule
  ]
})

export class NgoDashboardLayoutComponent implements OnInit {
  // Sidebar state - we will only use this on mobile now
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isMobileView = false;
  
  // Profile dropdown state
  isProfileDropdownOpen = false;
  
  // Logout confirmation state
  showLogoutConfirmation = false;

  // Organization data (will be populated from Firestore)
  organization: NgoProfile | null = null;

  // Default fallback in case data isn't loaded
  defaultOrganization = {
    name: 'My Organization',
    email: 'loading@example.com',
    avatar: 'assets/images/orgs/default-ngo.png',
    profileCompletion: 30
  };

  // Menu items for the sidebar
  menuItems = [
    { label: 'Dashboard', icon: 'th-large', route: '/ngo/dashboard/home' },
    { label: 'Profile', icon: 'user-circle', route: '/ngo/dashboard/profile' },
    { label: 'Events', icon: 'calendar', route: '/ngo/dashboard/events' },
    { label: 'Donations', icon: 'gift', route: '/ngo/dashboard/donations' },
    { label: 'Volunteers', icon: 'users', route: '/ngo/dashboard/volunteers' },
    { label: 'Insights', icon: 'chart-line', route: '/ngo/dashboard/insights' }
  ];

  constructor(
    private authService: AuthService,
    private ngoService: NgoService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadNgoProfile();
  }
  
  // Load NGO profile data from Firestore
  private loadNgoProfile(): void {
    this.ngoService.currentNgo$.subscribe(ngo => {
      if (ngo) {
        this.organization = ngo;
      }
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
  handleLogout(confirmed: boolean): void {
    this.showLogoutConfirmation = false;
    if (confirmed) {
      // Handle actual logout
      this.authService.logout()
        .then(() => {
          console.log('Organization logged out');
          
          // Show toast notification
          this.toastService.show('Logged out successfully', 'success');
          
          // Wait a moment for the toast to be visible before redirecting
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        })
        .catch(error => {
          console.error('Logout error:', error);
          this.toastService.show('Logout failed. Please try again.', 'error');
        });
    }
  }
}