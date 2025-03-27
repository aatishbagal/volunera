import { Component, OnInit, Input } from '@angular/core';

interface Volunteer {
  id: number;
  name: string;
  email: string;
  date: Date;
  avatar: string;
}

@Component({
  selector: 'app-volunteer-management',
  templateUrl: './volunteer-management.component.html',
  styleUrls: ['./volunteer-management.component.scss']
})
export class VolunteerManagementComponent implements OnInit {
  @Input() volunteers: Volunteer[] = [];
  
  constructor() { }

  ngOnInit(): void {
    // If no volunteers are provided, use default data
    if (!this.volunteers || this.volunteers.length === 0) {
      this.volunteers = [
        { id: 1, name: 'James Wilson', email: 'james.w@example.com', date: new Date(2025, 2, 21), avatar: '/assets/images/avatars/james.jpg' },
        { id: 2, name: 'Emma Davis', email: 'emma.d@example.com', date: new Date(2025, 2, 20), avatar: '/assets/images/avatars/emma.jpg' },
        { id: 3, name: 'Michael Brown', email: 'michael.b@example.com', date: new Date(2025, 2, 19), avatar: '/assets/images/avatars/michael.jpg' }
      ];
    }
  }

  viewProfile(volunteer: Volunteer): void {
    console.log('View profile for:', volunteer.name);
    // Implement navigation to volunteer profile
  }

  sendMessage(volunteer: Volunteer): void {
    console.log('Send message to:', volunteer.name);
    // Implement messaging functionality
  }
}