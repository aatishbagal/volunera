import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>We're sorry, the page you requested could not be found.</p>
        <p>This feature is coming soon!</p>
        <button class="btn btn-primary" (click)="goHome()">Return Home</button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ffffff;
      color: #021a02;
      text-align: center;
    }
    
    .not-found-content {
      max-width: 500px;
      padding: 2rem;
    }
    
    h1 {
      font-size: 6rem;
      margin-bottom: 0;
    }
    
    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    p {
      margin-bottom: 1.5rem;
    }
    
    .btn {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 30px;
      border: none;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: #021a02;
      color: #ffffff;
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  `]
})
export class NotFoundComponent {
  constructor(private router: Router) {}
  
  goHome() {
    this.router.navigate(['/']);
  }
}