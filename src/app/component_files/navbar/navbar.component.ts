import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';

interface NavbarColors {
  bg: string;
  text: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  currentSectionColor: NavbarColors = {
    bg: '#021a02',  // Default dark green
    text: '#ffffff'  // White text
  };

  // Sections with dark backgrounds where navbar should be light
  darkSections = ['features', 'gamification'];
  
  constructor() { }

  ngOnInit(): void {
    // Load Font Awesome if needed
    this.loadFontAwesome();
  }

  loadFontAwesome() {
    if (!document.getElementById('font-awesome-css')) {
      const link = document.createElement('link');
      link.id = 'font-awesome-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
      document.head.appendChild(link);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
    this.updateNavbarColor();
  }

  updateNavbarColor() {
    const currentSection = this.getCurrentSection();
    
    if (this.darkSections.includes(currentSection)) {
      // Light navbar for dark backgrounds
      this.currentSectionColor = {
        bg: '#ffffff',
        text: '#021a02'
      };
    } else {
      // Dark navbar for light backgrounds
      this.currentSectionColor = {
        bg: '#021a02',
        text: '#ffffff'
      };
    }
  }

  getCurrentSection(): string {
    // Get all section elements
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    // Find which section is most visible in the viewport
    let maxVisibleHeight = 0;
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      
      if (visibleHeight > maxVisibleHeight) {
        maxVisibleHeight = visibleHeight;
        currentSection = section.id;
      }
    });
    
    return currentSection;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.isMobileMenuOpen = false;
    }
  }
}