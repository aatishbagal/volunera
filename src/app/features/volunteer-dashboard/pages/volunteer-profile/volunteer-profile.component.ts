import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, UserProfile } from '../../../../auth/services/auth.service';
import { Subscription } from 'rxjs';
import { Firestore, doc, getDoc, collection, query, where, getDocs, orderBy, limit } from '@angular/fire/firestore';

// Interface definitions
interface Activity {
  id: string;
  eventName: string;
  organization: string;
  date: Date;
  points: number;
  role: string;
  location: string;
  status: 'completed' | 'upcoming' | 'cancelled';
}

interface VolunteerProfile extends UserProfile {
  bio?: string;
  level?: number;
  totalPoints?: number;
  nextLevelPoints?: number;
  profileCompletion?: number;
}

@Component({
  selector: 'app-volunteer-profile',
  templateUrl: './volunteer-profile.component.html',
  styleUrls: ['./volunteer-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class VolunteerProfileComponent implements OnInit, OnDestroy {
  // User data
  user: VolunteerProfile | null = null;
  
  // Default user data as fallback
  defaultUser = {
    displayName: 'Volunteer',
    email: 'loading@example.com',
    photoURL: '/assets/images/avatar.png',
    bio: 'Passionate about volunteering and making a difference.',
    level: 1,
    totalPoints: 0,
    nextLevelPoints: 100,
    profileCompletion: 30
  };

  // Stats data - will be calculated based on activity
  stats = {
    eventsThisMonth: 0,
    pointsThisMonth: 0,
    totalEvents: 0,
    totalPoints: 0,
  };

  // Activity history data - will be fetched from Firestore
  activityHistory: Activity[] = [];
  isLoadingActivities = true;

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

  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }
  
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Load user profile and activities
  private loadUserProfile(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(async (userProfile) => {
      if (userProfile) {
        // Load volunteer profile data
        try {
          const volunteerDoc = doc(this.firestore, 'volunteers', userProfile.uid);
          const volunteerSnapshot = await getDoc(volunteerDoc);
          
          if (volunteerSnapshot.exists()) {
            // Combine user profile with volunteer specific data
            this.user = {
              ...userProfile,
              ...volunteerSnapshot.data() as Partial<VolunteerProfile>
            };
            
            // Calculate level if not set
            if (!this.user.level || !this.user.nextLevelPoints) {
              this.calculateUserLevel();
            }
          } else {
            // No volunteer profile yet, use basic user data
            this.user = {
              ...userProfile,
              bio: this.defaultUser.bio,
              level: this.defaultUser.level,
              totalPoints: this.defaultUser.totalPoints,
              nextLevelPoints: this.defaultUser.nextLevelPoints
            };
          }
          
          // Load activity history
          this.loadActivityHistory(userProfile.uid);
          
        } catch (error) {
          console.error('Error loading volunteer profile:', error);
          this.user = {
            ...userProfile,
            ...this.defaultUser
          };
        }
      } else {
        // No user logged in or loading
        this.user = null;
      }
    });
  }
  
  // Load volunteer activity history
  private async loadActivityHistory(userId: string): Promise<void> {
    this.isLoadingActivities = true;
    
    try {
      const activitiesRef = collection(this.firestore, 'activities');
      const activitiesQuery = query(
        activitiesRef,
        where('volunteerId', '==', userId),
        orderBy('date', 'desc'),
        limit(10)
      );
      
      const activitiesSnapshot = await getDocs(activitiesQuery);
      
      // Process activities
      const activities: Activity[] = [];
      let totalPoints = 0;
      let eventsThisMonth = 0;
      let pointsThisMonth = 0;
      
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      
      activitiesSnapshot.forEach((doc) => {
        const activity = doc.data() as any;
        const activityDate = activity.date.toDate(); // Convert Firestore timestamp to JS Date
        
        // Check if activity is from this month
        if (activityDate.getMonth() === thisMonth && activityDate.getFullYear() === thisYear) {
          eventsThisMonth++;
          pointsThisMonth += activity.points;
        }
        
        totalPoints += activity.points;
        
        activities.push({
          id: doc.id,
          eventName: activity.eventName,
          organization: activity.organizationName,
          date: activityDate,
          points: activity.points,
          role: activity.role || 'Volunteer',
          location: activity.location,
          status: activity.status
        });
      });
      
      // Update state
      this.activityHistory = activities;
      this.stats = {
        eventsThisMonth,
        pointsThisMonth,
        totalEvents: activities.length,
        totalPoints
      };
      
      // If no totalPoints was set in user profile, use the calculated one
      if (this.user && (!this.user.totalPoints || this.user.totalPoints !== totalPoints)) {
        this.user.totalPoints = totalPoints;
        this.calculateUserLevel();
      }
      
    } catch (error) {
      console.error('Error loading activity history:', error);
    } finally {
      this.isLoadingActivities = false;
    }
  }
  
  // Calculate user level based on total points
  private calculateUserLevel(): void {
    if (!this.user) return;
    
    const totalPoints = this.user.totalPoints || 0;
    
    // Find the highest level the user has reached
    let currentLevel = 1;
    let nextLevelPoints = 100;
    
    for (let i = this.levelSystem.length - 1; i >= 0; i--) {
      if (totalPoints >= this.levelSystem[i].pointsRequired) {
        currentLevel = this.levelSystem[i].level;
        
        // Set next level points
        if (i < this.levelSystem.length - 1) {
          nextLevelPoints = this.levelSystem[i + 1].pointsRequired;
        } else {
          // Max level reached
          nextLevelPoints = totalPoints;
        }
        
        break;
      }
    }
    
    this.user.level = currentLevel;
    this.user.nextLevelPoints = nextLevelPoints;
  }
  
  // Get level title based on points
  getLevelTitle(): string {
    if (!this.user) return this.levelSystem[0].title;
    
    const currentLevel = this.levelSystem.find(level => level.level === this.user?.level);
    return currentLevel ? currentLevel.title : 'Volunteer';
  }
  
  // Calculate progress percentage to next level
  getProgressToNextLevel(): number {
    if (!this.user) return 0;
    
    const currentLevel = this.levelSystem.find(level => level.level === this.user?.level);
    const nextLevel = this.levelSystem.find(level => level.level === (this.user?.level || 0) + 1);
    
    if (!currentLevel || !nextLevel) return 100;
    
    const pointsForCurrentLevel = currentLevel.pointsRequired;
    const pointsForNextLevel = nextLevel.pointsRequired;
    const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
    const pointsAchieved = (this.user?.totalPoints || 0) - pointsForCurrentLevel;
    
    return Math.min(Math.floor((pointsAchieved / pointsNeeded) * 100), 100);
  }
  
  // Get points needed for next level
  getPointsToNextLevel(): number {
    if (!this.user) return 100;
    
    const nextLevel = this.levelSystem.find(level => level.level === (this.user?.level || 0) + 1);
    if (!nextLevel) return 0;
    return nextLevel.pointsRequired - (this.user?.totalPoints || 0);
  }
}