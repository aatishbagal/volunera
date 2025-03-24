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
  
  // For dynamic text coloring
  colorUpdateInterval: any;

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
    // Clean up interval when component is destroyed
    if (this.colorUpdateInterval) {
      clearInterval(this.colorUpdateInterval);
    }
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
    // This will analyze video colors and adjust text accordingly
    this.colorUpdateInterval = setInterval(() => {
      this.analyzeVideoColor();
    }, 1000); // Check every second
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

  // Function to analyze video and determine text color
  analyzeVideoColor(): void {
    if (!this.videoElement) return;
    
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Check if context is null before using it
    if (!context) return;
    
    // Set canvas size to a small sample (for performance)
    canvas.width = 50;
    canvas.height = 50;
    
    // Draw the current video frame to the canvas
    try {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data from the center of the video
      const centerX = Math.floor(canvas.width / 2);
      const centerY = Math.floor(canvas.height / 2);
      const pixelData = context.getImageData(centerX, centerY, 1, 1).data;
      
      // Calculate brightness (simple average)
      const brightness = (pixelData[0] + pixelData[1] + pixelData[2]) / 3;
      
      // Get hero content element
      const heroContent = document.querySelector('.hero-content');
      
      // Safely check and cast heroContent before using style property
      if (heroContent) {
        const htmlElement = heroContent as HTMLElement;
        
        // Change text color based on brightness
        if (brightness < 128) {
          // Dark background, use light text
          htmlElement.style.color = '#ffffff';
        } else {
          // Light background, use dark text
          htmlElement.style.color = '#021a02';
        }
      }
    } catch (error) {
      // Handle potential errors when video isn't ready
      console.log('Video not ready for analysis yet:', error);
    }
  }
}