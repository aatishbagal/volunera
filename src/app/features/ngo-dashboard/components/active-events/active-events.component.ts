import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  registrations: number;
  maxSpots: number;
}

@Component({
  selector: 'app-active-events',
  templateUrl: './active-events.component.html',
  styleUrls: ['./active-events.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ActiveEventsComponent implements OnInit {
  @Input() events: Event[] = [];
  
  constructor() { }

  ngOnInit(): void {
    // If no events are provided, use default data
    if (!this.events || this.events.length === 0) {
      this.events = [
        { id: 1, title: 'Community Garden Planting', date: new Date(2025, 2, 25), location: 'Central Park, NY', registrations: 18, maxSpots: 25 },
        { id: 2, title: 'Urban Forest Clean-up', date: new Date(2025, 2, 28), location: 'Riverside Park, NY', registrations: 22, maxSpots: 30 },
        { id: 3, title: 'Environmental Workshop', date: new Date(2025, 3, 5), location: 'Liberty Community Center', registrations: 12, maxSpots: 20 }
      ];
    }
  }

  editEvent(event: Event): void {
    console.log('Edit event:', event.title);
    // Implement event editing
  }

  shareEvent(event: Event): void {
    console.log('Share event:', event.title);
    // Implement event sharing
  }

  createNewEvent(): void {
    console.log('Create new event');
    // Implement new event creation
  }
}