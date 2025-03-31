import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LoadingScreenComponent implements OnInit, OnChanges {
  @Input() loading: boolean = true;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) { }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // When loading becomes true, force a layout recalculation to ensure animations play
    if (changes['loading'] && changes['loading'].currentValue === true) {
      this.forceRender();
    }
  }
  
  // This method forces the browser to calculate layout by triggering reflow
  private forceRender(): void {
    // Run outside Angular's change detection to avoid optimization
    this.ngZone.runOutsideAngular(() => {
      // Get the loading screen element
      const element = this.elementRef.nativeElement.querySelector('.loading-screen');
      if (element) {
        // Force a reflow by accessing a layout property
        // This triggers the browser to immediately apply styles
        const forceReflow = element.offsetHeight;
      }
    });
  }
}