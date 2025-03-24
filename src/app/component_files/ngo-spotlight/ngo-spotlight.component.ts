import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface NGO {
  name: string;
  mission: string;
  impact: string;
  volunteers: number;
  events: number;
}

@Component({
  selector: 'app-ngo-spotlight',
  templateUrl: './ngo-spotlight.component.html',
  styleUrls: ['./ngo-spotlight.component.scss'],
  standalone: true,
  imports:[NgFor]
})
export class NgoSpotlightComponent implements OnInit {
  ngos: NGO[] = [
    {
      name: 'GreenEarth Foundation',
      mission: 'Restoring urban green spaces through community action',
      impact: 'Planted 5,000+ trees and revitalized 15 community gardens in 2024',
      volunteers: 450,
      events: 32
    },
    {
      name: 'Tech4All',
      mission: 'Bridging the digital divide through education and access',
      impact: 'Provided digital literacy training to 2,500 seniors and underserved youth',
      volunteers: 285,
      events: 46
    },
    {
      name: 'Helping Hands',
      mission: 'Empowering communities through sustainable development initiatives',
      impact: 'Supported over 1,200 families with essential services and skill training',
      volunteers: 380,
      events: 28
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}