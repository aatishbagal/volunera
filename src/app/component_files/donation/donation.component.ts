import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Impact {
  icon: string;
  title: string;
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
      title: 'Essential Resources',
      description: 'Your donations provide essential resources for communities in need, including food, education materials, and healthcare supplies.'
    },
    {
      icon: 'fa-box-open',
      title: 'Multiple Ways to Help',
      description: 'Support both financial contributions and goods donations through our transparent platform.'
    },
    {
      icon: 'fa-chart-line',
      title: 'Impact Tracking',
      description: 'Track the impact of your contributions with our detailed reporting system to see exactly how your donations help.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}