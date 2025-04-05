import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrganizationStatsComponent } from '../../components/organization-stats/organization-stats.component';
import { EventManagementComponent } from '../../components/event-management/event-management.component';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';
import { PostService } from '../../../../shared/global-services/post.service';
import { ToastService } from '../../../../shared/global-services/toast.service';
import { Subscription } from 'rxjs';
import { Post as FirestorePost } from '../../../../shared/models/post.model';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../../../../shared/environments/environment';

// Interface definitions
interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  registeredVolunteers: number;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface Donation {
  id: number;
  type: 'financial' | 'items';
  donor: string;
  date: Date;
  amount?: number;
  items?: string;
  status: 'received' | 'pending';
}

interface Post {
  id: number;
  orgName: string;
  orgAvatar: string;
  content: string;
  date: Date;
  image?: string;
  likes: number;
  comments: number;
  reach: number;
  isOwnOrg: boolean;
}

export interface Comment {
  id?: string;
  postId: string; 
  userId: string; 
  userName: string;
  userAvatar?: string;
  content: string;
  date: Date | any;
  userType: 'ngo' | 'volunteer';
}

@Component({
  selector: 'app-ngo-dashboard',
  templateUrl: './ngo-dashboard.component.html',
  styleUrls: ['./ngo-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    OrganizationStatsComponent,
    EventManagementComponent,
    SafePipe
  ]
})
export class NgoDashboardComponent implements OnInit, OnDestroy {
  // Upcoming events and donations arrays remain the same
  
  // Mock posts for fallback
  allNgoPosts: Post[] = [
    {
      id: 1,
      orgName: 'GreenEarth Foundation',
      orgAvatar: '/assets/images/orgs/greenearth.png',
      content: 'Join us for our upcoming tree planting event this weekend! We\'ll be planting 100 native trees in Central Park to combat urban heat and improve air quality.',
      date: new Date(2025, 2, 28),
      image: '/assets/images/posts/tree-planting.jpg',
      likes: 42,
      comments: 7,
      reach: 523,
      isOwnOrg: true
    },
    // Other mock posts remain the same
  ];

  firestorePosts: FirestorePost[] = [];
  showPostForm = false;
  postForm: FormGroup;
  isSubmitting = false;
  private postsSubscription: Subscription | null = null;
  isLoadingPosts = false; 

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private toastService: ToastService
  ) {
    // Initialize the form
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    console.log('NgoDashboard: Component initialized');
    // Initialize the dashboard and load posts
    this.loadPosts();
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  

  loadPosts(): void {
    console.log('NgoDashboard: Loading posts from Firestore');
    this.isLoadingPosts = true;
    
    // Clear old subscription if it exists
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    
    this.postsSubscription = this.postService.getAllPosts().subscribe({
      next: (posts) => {
        console.log('NgoDashboard: Received posts from Firestore:', posts);
        this.firestorePosts = posts;
        this.isLoadingPosts = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.toastService.show('Failed to load posts', 'error');
        this.firestorePosts = [];
        this.isLoadingPosts = false;
      }
    });
  }

  // Method to create a new event
  createEvent(): void {
    console.log('Create new event');
    // This would navigate to event creation page
  }

  // Method to post an update
  createPost(): void {
    this.showPostForm = true;
  }

  closePostForm(): void {
    this.showPostForm = false;
    this.postForm.reset();
  }

  async submitPost(): Promise<void> {
    if (this.postForm.invalid || this.isSubmitting) return;
    
    this.isSubmitting = true;
    console.log('NgoDashboard: Submitting post with content:', this.postForm.value.content);
    
    try {
      const { content } = this.postForm.value;
      await this.postService.createPost(content);
      
      this.toastService.show('Post created successfully', 'success');
      this.postForm.reset();
      this.closePostForm();
      
      // Add a small delay before reloading posts to ensure Firebase has time to update
      setTimeout(() => {
        this.loadPosts();
      }, 1000);
    } catch (error) {
      console.error('Error creating post:', error);
      this.toastService.show('Failed to create post. Please try again.', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  // Method to view all events
  viewAllEvents(): void {
    console.log('View all events');
    // This would navigate to events management page
  }

  // Method to view all donations
  viewAllDonations(): void {
    console.log('View all donations');
    // This would navigate to donations management page
  }

  // Method to view post insights
  viewPostInsights(post: Post | FirestorePost): void {
    console.log('View insights for post:', post);
  }
}