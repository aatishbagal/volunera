import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  standalone: true,
  imports:[NgFor],
})
export class FeaturesComponent implements OnInit {
  features: Feature[] = [
    {
      icon: 'fa-handshake',
      title: 'Smart Matching',
      description: 'Our intelligent algorithm connects you with opportunities that match your skills and interests'
    },
    {
      icon: 'fa-users',
      title: 'Community Building',
      description: 'Join location-based groups to connect with like-minded volunteers in your area'
    },
    {
      icon: 'fa-graduation-cap',
      title: 'Skill Development',
      description: 'Access workshops and resources to grow while making a difference'
    },
    {
      icon: 'fa-map-marker-alt',
      title: 'Geo-Location',
      description: 'Find volunteer opportunities near you with our location-based search and recommendations'
    },
    {
      icon: 'fa-chart-line',
      title: 'Impact Tracking',
      description: 'Measure and visualize your volunteering impact with detailed analytics and reporting'
    },
    {
      icon: 'fa-gift',
      title: 'Donation Management',
      description: 'Facilitate both financial and goods donations through our transparent platform'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}