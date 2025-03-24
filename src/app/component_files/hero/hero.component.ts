import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {

  // Reference to the video element
  @ViewChild('heroVideo') videoElement!: ElementRef;
  
  // Text color is now static white

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Wait for the DOM to fully render
    setTimeout(() => {
      this.setupVideo();
      
      // Start analyzing video for text color
      this.startColorAnalysis();
    }, 100);
  }

  ngOnDestroy(): void {
    // No interval to clean up anymore
  }

  setupVideo(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;
      
      // Make sure video properties are set correctly
      video.muted = true;
      video.loop = true;
      
      // Force the video to play
      const playPromise = video.play();
      
      // Handle play promise (important for some browsers)
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video playback started successfully');
          })
          .catch((error: Error) => {
            console.error('Video playback failed:', error);
            // Try again after a short delay (helps with some browser policies)
            setTimeout(() => {
              video.play().catch((e: Error) => console.error('Retry failed:', e));
            }, 300);
          });
      }
      
      // Add event listeners to monitor video state
      video.addEventListener('playing', () => {
        console.log('Video is now playing');
      });
      
      video.addEventListener('pause', () => {
        console.log('Video paused');
        // Try to resume if it pauses unexpectedly
        video.play().catch((e: Error) => console.error('Resume failed:', e));
      });
    } else {
      console.error('Video element not found in the DOM');
    }
  }

  startColorAnalysis(): void {
    // Set text color immediately and no need for interval
    this.analyzeVideoColor();
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Navigation methods for the buttons
  navigateToVolunteer(): void {
    this.router.navigate(['/join-volunteer']);
  }
  
  navigateToNGO(): void {
    this.router.navigate(['/register-ngo']);
  }

  // Function to set permanent white text color (no dynamic analysis)
  analyzeVideoColor(): void {
    // Get hero content element
    const heroContent = document.querySelector('.hero-content');
    
    // Safely check and cast heroContent before using style property
    if (heroContent) {
      const htmlElement = heroContent as HTMLElement;
      
      // Set text color to white permanently
      htmlElement.style.color = '#ffffff';
    }
  }
}