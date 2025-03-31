import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verification-pending',
  templateUrl: './verification-pending.component.html',
  styleUrls: ['./verification-pending.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class VerificationPendingComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Check if user is authenticated and is an NGO
    this.authService.getCurrentUser()
      .then(user => {
        if (!user) {
          this.router.navigate(['/auth/ngo/login']);
        } else if (user.userType !== 'ngo') {
          this.router.navigate(['/auth/volunteer/login']);
        }
      });
  }

  goToDashboard(): void {
    this.router.navigate(['/ngo/dashboard']);
  }

  contactSupport(): void {
    // Open email client with support email
    window.location.href = 'mailto:support@volunera.org?subject=NGO Verification Support';
  }
}