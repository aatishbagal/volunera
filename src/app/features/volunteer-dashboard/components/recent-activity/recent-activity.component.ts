import { Component, OnInit, Input } from '@angular/core';

interface Activity {
  id: number;
  type: 'event' | 'donation' | 'achievement';
  title: string;
  organization: string;
  date: Date;
  points: number;
}

@Component({
  selector: 'app-recent-activity',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.scss']
})
export class RecentActivityComponent implements OnInit {
  @Input() activities: Activity[] = [];
  
  constructor() { }

  ngOnInit(): void {
    // If no activities are provided, use default data
    if (!this.activities || this.activities.length === 0) {
      this.activities = [
        { id: 1, type: 'event', title: 'Beach Cleanup', organization: 'OceanGuardians', date: new Date(2025, 2, 20), points: 120 },
        { id: 2, type: 'donation', title: 'Book Donation', organization: 'LiteracyFirst', date: new Date(2025, 2, 18), points: 75 },
        { id: 3, type: 'event', title: 'Food Bank Volunteering', organization: 'CommunityTableNYC', date: new Date(2025, 2, 15), points: 150 },
        { id: 4, type: 'achievement', title: 'First Step Badge', organization: '', date: new Date(2025, 2, 14), points: 50 }
      ];
    }
  }

  viewActivity(activity: Activity): void {
    // This would navigate to the activity details page
    console.log('View activity:', activity.title);
  }

  viewAllActivities(): void {
    // This would navigate to the full activity history page
    console.log('View all activities');
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'event':
        return 'fa-calendar-check';
      case 'donation':
        return 'fa-gift';
      case 'achievement':
        return 'fa-award';
      default:
        return 'fa-star';
    }
  }
}