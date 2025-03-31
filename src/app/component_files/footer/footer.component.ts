import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  emailSubscription: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  subscribeToNewsletter(): void {
    if (this.validateEmail(this.emailSubscription)) {
      // Here you would typically call a service to handle the subscription
      console.log('Subscribing email:', this.emailSubscription);
      this.emailSubscription = '';
      alert('Thank you for subscribing to our newsletter!');
    } else {
      alert('Please enter a valid email address.');
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }
}