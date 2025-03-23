import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Step {
  number: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss'],
  standalone: true,
  imports:[NgFor]
})
export class HowItWorksComponent implements OnInit {
  volunteerSteps: Step[] = [
    {
      number: 1,
      title: 'Create Your Profile',
      description: 'Sign up and tell us about your skills, interests, and availability'
    },
    {
      number: 2,
      title: 'Discover Opportunities',
      description: 'Find perfect volunteering matches based on your preferences and location'
    },
    {
      number: 3,
      title: 'Make an Impact',
      description: 'Volunteer, earn points, track your growth, and connect with your community'
    }
  ];

  ngoSteps: Step[] = [
    {
      number: 1,
      title: 'Register Your Organization',
      description: 'Create your NGO profile with your mission, needs, and impact stories'
    },
    {
      number: 2,
      title: 'Post Opportunities',
      description: 'Share events, workshops, and donation needs with our community'
    },
    {
      number: 3,
      title: 'Find Dedicated Volunteers',
      description: 'Connect with skilled volunteers passionate about your cause'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}