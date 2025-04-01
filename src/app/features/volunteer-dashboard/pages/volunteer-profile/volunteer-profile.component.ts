import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface definitions
interface Activity {
  id: number;
  eventName: string;
  organization: string;
  date: Date;
  points: number;
  role: string;
  location: string;
  status: 'completed' | 'upcoming' | 'cancelled';
}

@Component({
  selector: 'app-volunteer-profile',
  templateUrl: './volunteer-profile.component.html',
  styleUrls: ['./volunteer-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class VolunteerProfileComponent implements OnInit {
  // User data
  user = {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: '/assets/images/avatar.png',
    bio: 'Passionate about environmental conservation and community building. Love to spend my weekends volunteering and making a difference.',
    profileCompletion: 85,
    level: 4,
    totalPoints: 780,
    nextLevelPoints: 1000
  };

  // Stats data
  stats = {
    eventsThisMonth: 3,
    pointsThisMonth: 120,
    totalEvents: 12,
    totalPoints: 780,
  };

  // Activity history data
  activityHistory: Activity[] = [
    {
      id: 1,
      eventName: 'Community Garden Planting',
      organization: 'GreenEarth Foundation',
      date: new Date(2025, 2, 15),
      points: 45,
      role: 'Team Lead',
      location: 'Central Park, NY',
      status: 'completed'
    },
    {
      id: 2,
      eventName: 'Tech Literacy Workshop',
      organization: 'Tech4All',
      date: new Date(2025, 2, 8),
      points: 35,
      role: 'Instructor',
      location: 'Downtown Library',
      status: 'completed'
    },
    {
      id: 3,
      eventName: 'Food Drive',
      organization: 'Community Helpers',
      date: new Date(2025, 2, 1),
      points: 40,
      role: 'Volunteer',
      location: 'Community Center',
      status: 'completed'
    },
    {
      id: 4,
      eventName: 'Park Cleanup',
      organization: 'GreenEarth Foundation',
      date: new Date(2025, 1, 22),
      points: 30,
      role: 'Volunteer',
      location: 'Riverside Park',
      status: 'completed'
    },
    {
      id: 5,
      eventName: 'Senior Care Visit',
      organization: 'Care For All',
      date: new Date(2025, 1, 15),
      points: 50,
      role: 'Lead Volunteer',
      location: 'Sunset Retirement Home',
      status: 'completed'
    }
  ];

  // Level system mechanics
  levelSystem = [
    { level: 1, pointsRequired: 0, title: 'Newcomer' },
    { level: 2, pointsRequired: 100, title: 'Helper' },
    { level: 3, pointsRequired: 300, title: 'Contributor' },
    { level: 4, pointsRequired: 600, title: 'Champion' },
    { level: 5, pointsRequired: 1000, title: 'Hero' },
    { level: 6, pointsRequired: 1500, title: 'Leader' },
    { level: 7, pointsRequired: 2200, title: 'Mentor' },
    { level: 8, pointsRequired: 3000, title: 'Advocate' },
    { level: 9, pointsRequired: 4000, title: 'Visionary' },
    { level: 10, pointsRequired: 5000, title: 'Legend' }
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialize the profile page
  }
  
  // Get level title based on points
  getLevelTitle(): string {
    const currentLevel = this.levelSystem.find(level => level.level === this.user.level);
    return currentLevel ? currentLevel.title : 'Volunteer';
  }
  
  // Calculate progress percentage to next level
  getProgressToNextLevel(): number {
    const currentLevel = this.levelSystem.find(level => level.level === this.user.level);
    const nextLevel = this.levelSystem.find(level => level.level === this.user.level + 1);
    
    if (!currentLevel || !nextLevel) return 100;
    
    const pointsForCurrentLevel = currentLevel.pointsRequired;
    const pointsForNextLevel = nextLevel.pointsRequired;
    const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
    const pointsAchieved = this.user.totalPoints - pointsForCurrentLevel;
    
    return Math.min(Math.floor((pointsAchieved / pointsNeeded) * 100), 100);
  }
  
  // Get points needed for next level
  getPointsToNextLevel(): number {
    const nextLevel = this.levelSystem.find(level => level.level === this.user.level + 1);
    if (!nextLevel) return 0;
    return nextLevel.pointsRequired - this.user.totalPoints;
  }
}