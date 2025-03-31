import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-not-found',
  templateUrl: './dashboard-not-found.component.html',
  styleUrls: ['./dashboard-not-found.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardNotFoundComponent {
  constructor(private router: Router, private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  goToDashboard(): void {
    // Navigate to the appropriate dashboard based on user role
    // You can modify this logic based on your authentication service
    const isNgo = this.router.url.includes('/ngo');
    
    if (isNgo) {
      this.router.navigate(['/ngo/dashboard']);
    } else {
      this.router.navigate(['/volunteer/dashboard']);
    }
  }
}