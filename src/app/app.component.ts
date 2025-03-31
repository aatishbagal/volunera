import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { NavbarComponent } from './component_files/navbar/navbar.component';
import { FooterComponent } from './component_files/footer/footer.component';
import { LoadingScreenComponent } from './component_files/loading-screen/loading-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoadingScreenComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'volunera';
  currentRoute: string = '';
  loading: boolean = true;
  
  constructor(private router: Router, private renderer: Renderer2) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        const urlToNavigate = this.getBaseUrl(event.url);
        const currentBaseUrl = this.getBaseUrl(this.currentRoute);
        
        if (urlToNavigate !== currentBaseUrl) {
          this.loading = true;
        }
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        if (this.loading) {
          setTimeout(() => {
            this.exitLoadingScreen();
          }, 800);
        }
        
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
        }
      }
    });
  }
  
  ngOnInit() {
    window.addEventListener('scroll', this.handleScroll);
    this.loadFontAwesome();
    
    setTimeout(() => {
      this.exitLoadingScreen();
    }, 2500);
  }
  
  getBaseUrl(url: string): string {
    return url.split('?')[0].split('#')[0];
  }
  
  exitLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      this.renderer.addClass(loadingScreen, 'exit');
      
      setTimeout(() => {
        this.loading = false;
        
        setTimeout(() => {
          if (loadingScreen) {
            this.renderer.removeClass(loadingScreen, 'exit');
          }
        }, 100);
      }, 900);
    } else {
      this.loading = false;
    }
  }
  
  isHomeRoute() {
    return this.currentRoute === '/' || this.currentRoute === '';
  }
  
  isDashboardRoute(): boolean {
    return this.currentRoute.includes('/volunteer/dashboard') || 
           this.currentRoute.includes('/ngo/dashboard');
  }
  
  isOnboardingRoute(): boolean {
    return this.currentRoute.includes('/auth/volunteer/onboarding') || 
           this.currentRoute.includes('/auth/ngo/onboarding');
  }
  
  isAuthRoute(): boolean {
    return this.currentRoute.includes('/auth/volunteer/login') || 
           this.currentRoute.includes('/auth/ngo/login');
  }
  
  shouldShowNavbarFooter(): boolean {
    return !this.isDashboardRoute() && !this.isOnboardingRoute() && !this.isAuthRoute();
  }
  
  handleScroll = () => {
    const navbar = document.querySelector('.navbar-container') as HTMLElement;
    if (!navbar) return;
    
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      navbar.style.padding = '8px 30px';
    } else {
      navbar.style.backgroundColor = '#ffffff';
      navbar.style.padding = '10px 30px';
    }
  }
  
  loadFontAwesome() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  }
}