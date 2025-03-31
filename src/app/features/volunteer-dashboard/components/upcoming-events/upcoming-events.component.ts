import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Event {
  id: number;
  title: string;
  organization: string;
  date: Date;
  location: string;
  registered: boolean;
}

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class UpcomingEventsComponent implements OnInit {
  @Input() events: Event[] = [];
  
  constructor() { }

  ngOnInit(): void {
    // If no events are provided, use default data
    if (!this.events || this.events.length === 0) {
      this.events = [
        { id: 1, title: 'Community Garden Planting', organization: 'GreenEarth Foundation', date: new Date(2025, 2, 25), location: 'Central Park, NY', registered: true },
        { id: 2, title: 'Senior Tech Workshop', organization: 'Tech4All', date: new Date(2025, 2, 28), location: 'Liberty Center, NY', registered: true },
        { id: 3, title: 'Animal Shelter Help Day', organization: 'PetRescue', date: new Date(2025, 3, 2), location: 'Happy Paws Shelter, Brooklyn', registered: false }
      ];
    }
  }

  registerForEvent(event: Event): void {
    // This would call a service to register the user for the event
    console.log('Register for event:', event.title);
    event.registered = true;
  }

  viewEventDetails(event: Event): void {
    // This would navigate to the event details page
    console.log('View event details:', event.title);
  }

  viewCalendar(): void {
    // This would navigate to the calendar view
    console.log('View calendar');
  }
}