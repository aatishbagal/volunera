import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Create a pipe for safe URLs
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

interface NGOPost {
  id: number;
  ngoName: string;
  ngoAvatar?: string;
  date: Date;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  liked: boolean;
}

interface Event {
  id: number;
  title: string;
  organization: string;
  date: Date;
  location: string;
  registered: boolean;
}

@Component({
  selector: 'app-volunteer-dashboard',
  templateUrl: './volunteer-dashboard.component.html',
  styleUrls: ['./volunteer-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SafePipe
  ]
})
export class VolunteerDashboardComponent implements OnInit {
  // Dashboard data
  calendarUrl: string = 'https://calendar.google.com/calendar/embed?src=c_classroomf65b04c4%40group.calendar.google.com&ctz=America%2FNew_York&mode=AGENDA';

  // NGO Posts data
  ngoPosts: NGOPost[] = [
    {
      id: 1,
      ngoName: 'GreenEarth Foundation',
      ngoAvatar: '/assets/images/orgs/greenearth.png',
      date: new Date(2025, 2, 28),
      content: 'Join us for our upcoming tree planting event this weekend! We\'ll be planting 100 native trees in Central Park to combat urban heat and improve air quality.',
      image: '/assets/images/posts/tree-planting.jpg',
      likes: 42,
      comments: 7,
      liked: true
    },
    {
      id: 2,
      ngoName: 'Tech4All',
      ngoAvatar: '/assets/images/orgs/tech4all.png',
      date: new Date(2025, 2, 26),
      content: 'Our senior tech literacy workshops have helped over 500 seniors this month learn essential digital skills. Thank you to all our amazing volunteers!',
      likes: 28,
      comments: 3,
      liked: false
    },
    {
      id: 3,
      ngoName: 'PetRescue',
      ngoAvatar: '/assets/images/orgs/petrescue.png',
      date: new Date(2025, 2, 24),
      content: 'Great news! Thanks to our dedicated volunteers, we\'ve found forever homes for 15 dogs and 12 cats this week! 🐾',
      image: '/assets/images/posts/rescued-pets.jpg',
      likes: 56,
      comments: 11,
      liked: false
    }
  ];

  // Event data
  nextEvent: Event = {
    id: 1, 
    title: 'Community Garden Planting', 
    organization: 'GreenEarth Foundation', 
    date: new Date(2025, 2, 25), 
    location: 'Central Park, NY', 
    registered: true 
  };

  recommendedNGOs = [
    { id: 1, name: 'GreenEarth Foundation', category: 'Environment', match: 95, logo: '/assets/images/orgs/greenearth.png' },
    { id: 2, name: 'Tech4All', category: 'Education', match: 88, logo: '/assets/images/orgs/tech4all.png' },
    { id: 3, name: 'HomelessSupport', category: 'Social Welfare', match: 82, logo: '/assets/images/orgs/homelesssupport.png' }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Initialize the dashboard
  }

  // Toggle post like
  toggleLike(post: NGOPost): void {
    post.liked = !post.liked;
    if (post.liked) {
      post.likes++;
    } else {
      post.likes--;
    }
  }
}