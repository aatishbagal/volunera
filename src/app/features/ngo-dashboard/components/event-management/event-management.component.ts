import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  registeredVolunteers: number;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class EventManagementComponent implements OnInit {
  @Input() events: Event[] = [];
  
  constructor() { }

  ngOnInit(): void {
    // If no events are provided, use default data
    if (!this.events || this.events.length === 0) {
      this.events = [
        { 
          id: 1, 
          title: 'Community Garden Planting', 
          date: new Date(2025, 2, 25), 
          location: 'Central Park, NY', 
          registeredVolunteers: 18, 
          capacity: 25,
          status: 'upcoming'
        },
        { 
          id: 2, 
          title: 'Park Cleanup Drive', 
          date: new Date(2025, 2, 28), 
          location: 'Riverside Park, NY', 
          registeredVolunteers: 12, 
          capacity: 20,
          status: 'upcoming'
        },
        { 
          id: 3, 
          title: 'Tree Planting Workshop', 
          date: new Date(2025, 3, 5), 
          location: 'Botanical Garden, NY', 
          registeredVolunteers: 8, 
          capacity: 15,
          status: 'upcoming'
        }
      ];
    }
  }

  manageEvent(event: Event): void {
    // This would navigate to the event management page for this specific event
    console.log('Manage event:', event.title);
  }

  createEvent(): void {
    // This would navigate to the event creation page
    console.log('Create new event');
  }

  viewAllEvents(): void {
    // This would navigate to the events management page
    console.log('View all events');
  }
}