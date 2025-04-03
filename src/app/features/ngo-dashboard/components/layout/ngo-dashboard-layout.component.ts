import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-ngo-dashboard-layout',
  templateUrl: './ngo-dashboard-layout.component.html',
  styleUrls: ['./ngo-dashboard-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule
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

  // Organization data
  organization = {
    name: 'GreenEarth Foundation',
    email: 'info@greenearthfoundation.org',
    avatar: '/assets/images/orgs/greenearth.png',
    profileCompletion: 75
  };

  // Menu items for the sidebar
  menuItems = [
    { label: 'Dashboard', icon: 'th-large', route: '/ngo/dashboard' },
    { label: 'Events', icon: 'calendar', route: '/ngo/events' },
    { label: 'Donations', icon: 'gift', route: '/ngo/donations' },
    { label: 'Volunteers', icon: 'users', route: '/ngo/volunteers' },
    { label: 'Insights', icon: 'chart-line', route: '/ngo/insights' }
  ];

  constructor() {}

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
      // Handle actual logout logic here
      console.log('Organization logged out');
      // Navigate to login page
      // this.router.navigate(['/login']);
    }
  }
}