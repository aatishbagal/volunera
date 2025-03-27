import { Component, OnInit, Input } from '@angular/core';

interface ImpactData {
  hoursVolunteered: number;
  hoursChange: number;
  pointsEarned: number;
  pointsChange: number;
  weeklyData: number[];
}

@Component({
  selector: 'app-impact-card',
  templateUrl: './impact-card.component.html',
  styleUrls: ['./impact-card.component.scss']
})
export class ImpactCardComponent implements OnInit {
  @Input() impactData: ImpactData | null = null;
  activePeriod: 'week' | 'month' | 'year' = 'week';
  dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  constructor() { }

  ngOnInit(): void {
    // If no data is provided, use default data
    if (!this.impactData) {
      this.impactData = {
        hoursVolunteered: 14,
        hoursChange: 8,
        pointsEarned: 450,
        pointsChange: 12,
        weeklyData: [40, 65, 85, 50, 75, 30, 20] // Percentages for chart bars
      };
    }
  }

  changePeriod(period: 'week' | 'month' | 'year'): void {
    this.activePeriod = period;
    // In a real app, this would fetch new data for the selected period
    console.log('Changed period to:', period);
  }
}