import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators'; // Added missing import

import { NavbarComponent } from './component_files/navbar/navbar.component';
import { HeroComponent } from './component_files/hero/hero.component';
import { HowItWorksComponent } from './component_files/how-it-works/how-it-works.component';
import { FeaturesComponent } from './component_files/features/features.component';
import { NgoSpotlightComponent } from './component_files/ngo-spotlight/ngo-spotlight.component';
import { GamificationComponent } from './component_files/gamification/gamification.component';
import { DonationComponent } from './component_files/donation/donation.component';
import { CtaComponent } from './component_files/cta/cta.component';
import { FooterComponent } from './component_files/footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet, // Added RouterOutlet to imports
    NavbarComponent,
    HeroComponent,
    HowItWorksComponent,
    FeaturesComponent,
    NgoSpotlightComponent,
    GamificationComponent,
    DonationComponent,
    CtaComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'volunera';
  currentRoute: string = '';
  
  constructor(private router: Router) {
    // Subscribe to router events to track current route
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd) // Fixed typing
    ).subscribe((event: NavigationEnd) => { // Fixed typing
      this.currentRoute = event.url;
    });
  }
  
  ngOnInit() {
    // Add scroll event listener for navbar color change
    window.addEventListener('scroll', this.handleScroll);
    
    // Load Font Awesome icons
    this.loadFontAwesome();
  }
  
  isHomeRoute() {
    return this.currentRoute === '/' || this.currentRoute === '';
  }
  
  handleScroll = () => {
    const navbar = document.querySelector('.navbar-container') as HTMLElement;
    
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      navbar.style.padding = '8px 30px';
    } else {
      navbar.style.backgroundColor = '#ffffff';
      navbar.style.padding = '10px 30px';
    }
  }
  
  loadFontAwesome() {
    // Create a link element for Font Awesome
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  }
}