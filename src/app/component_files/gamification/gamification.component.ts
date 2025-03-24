import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface PointSystem {
  activity: string;
  points: string;
}

interface Badge {
  icon: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-gamification',
  templateUrl: './gamification.component.html',
  styleUrls: ['./gamification.component.scss'],
  standalone: true,
  imports: [NgFor]
})
export class GamificationComponent implements OnInit {
  pointSystem: PointSystem[] = [
    {
      activity: 'Event Participation',
      points: '10-50 points per event'
    },
    {
      activity: 'Consistent Volunteering',
      points: '100 bonus points per month'
    },
    {
      activity: 'Positive Feedback',
      points: '30 points per recognition'
    },
    {
      activity: 'Volunteering Milestones',
      points: '200 points per 10 events'
    }
  ];

  badges: Badge[] = [
    {
      icon: 'fa-award',
      name: '"First Step"',
      description: 'Complete first volunteering event'
    },
    {
      icon: 'fa-medal',
      name: '"Local Hero"',
      description: 'Volunteer 50+ hours in your community'
    },
    {
      icon: 'fa-star',
      name: '"Dedication Star"',
      description: 'Volunteer consistently for 6 months'
    },
    {
      icon: 'fa-trophy',
      name: '"Impact Champion"',
      description: 'Make a measurable difference in 3+ projects'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}