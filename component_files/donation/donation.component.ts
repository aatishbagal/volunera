import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Impact {
  icon: string;
  description: string;
}

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss'],
  standalone: true,
  imports: [NgFor]
})
export class DonationComponent implements OnInit {
  impacts: Impact[] = [
    {
      icon: 'fa-hand-holding-heart',
      description: 'Your donations provide essential resources for communities in need'
    },
    {
      icon: 'fa-box-open',
      description: 'Support both financial and goods donations through our platform'
    },
    {
      icon: 'fa-chart-line',
      description: 'Track the impact of your contributions with our transparent reporting'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}