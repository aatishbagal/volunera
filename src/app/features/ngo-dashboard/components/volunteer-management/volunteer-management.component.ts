import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Volunteer {
  id: number;
  name: string;
  avatar?: string;
  joinedDate: Date;
  hoursContributed: number;
  points: number;
  skills: string[];
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-volunteer-management',
  templateUrl: './volunteer-management.component.html',
  styleUrls: ['./volunteer-management.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class VolunteerManagementComponent implements OnInit {
  @Input() volunteers: Volunteer[] = [];
  
  constructor() { }

  ngOnInit(): void {
    // If no volunteers are provided, use default data
    if (!this.volunteers || this.volunteers.length === 0) {
      this.volunteers = [
        {
          id: 1,
          name: 'Sarah Johnson',
          avatar: '/assets/images/avatars/avatar1.png',
          joinedDate: new Date(2025, 2, 20),
          hoursContributed: 12,
          points: 350,
          skills: ['Gardening', 'Teaching'],
          status: 'active'
        },
        {
          id: 2,
          name: 'Michael Chen',
          avatar: '/assets/images/avatars/avatar2.png',
          joinedDate: new Date(2025, 2, 18),
          hoursContributed: 8,
          points: 220,
          skills: ['Photography', 'Social Media'],
          status: 'active'
        },
        {
          id: 3,
          name: 'Emma Wilson',
          avatar: '/assets/images/avatars/avatar3.png',
          joinedDate: new Date(2025, 2, 15),
          hoursContributed: 5,
          points: 150,
          skills: ['Event Planning', 'Leadership'],
          status: 'active'
        }
      ];
    }
  }

  contactVolunteer(volunteer: Volunteer): void {
    // This would open a contact modal or navigate to the volunteer contact page
    console.log('Contact volunteer:', volunteer.name);
  }

  manageVolunteer(volunteer: Volunteer): void {
    // This would open a management dropdown or modal
    console.log('Manage volunteer:', volunteer.name);
  }

  viewAllVolunteers(): void {
    // This would navigate to the volunteer management page
    console.log('View all volunteers');
  }
}