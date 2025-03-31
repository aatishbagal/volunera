import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OrganizationStats {
  totalVolunteers: number;
  activeVolunteers: number;
  totalHours: number;
  totalEvents: number;
  totalDonations: number;
  averageRating: number;
  weeklyData: number[];
}

@Component({
  selector: 'app-organization-stats',
  templateUrl: './organization-stats.component.html',
  styleUrls: ['./organization-stats.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class OrganizationStatsComponent implements OnInit {
  @Input() stats: OrganizationStats | null = null;
  activePeriod: 'week' | 'month' | 'year' = 'week';
  dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  changePeriod(period: 'week' | 'month' | 'year'): void {
    this.activePeriod = period;
    // In a real app, this would fetch new data for the selected period
    console.log('Changed period to:', period);
  }

  constructor() { }

  ngOnInit(): void {
    // If no stats are provided, use default data
    if (!this.stats) {
      this.stats = {
        totalVolunteers: 572,
        activeVolunteers: 312,
        totalHours: 4856,
        totalEvents: 145,
        totalDonations: 28300,
        averageRating: 4.8,
        weeklyData: [65, 72, 85, 78, 90, 76, 82] // Percentages for chart bars
      }
    }
  }
}
