import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../../../app/shared/global-services/post.service';
import { Post, Comment } from '../../../../../app/shared/models/post.model';
import { Subscription } from 'rxjs';
import { ToastService } from '../../../../shared/global-services/toast.service';
import { PostCreateComponent } from '../post-create/post-create.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PostCreateComponent]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  showPostForm = false;
  expandedPostId: string | null = null;
  newComment: string = '';
  loadingComments = false;
  postComments: { [postId: string]: Comment[] } = {};
  private postsSubscription: Subscription | null = null;
  private commentSubscriptions: { [postId: string]: Subscription } = {};
  isLoadingPosts = false;
  firestorePosts: Post[] = [];
  allNgoPosts: Post[] = [];
  
  constructor(
    private postService: PostService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Add loading indicator while posts are being fetched
    this.loadPosts();
  }
  
  loadPosts(): void {
    console.log('Loading posts from Firestore...');
    this.isLoadingPosts = true;
    
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    
    this.postsSubscription = this.postService.getAllPosts().subscribe({
      next: posts => {
        console.log('Received posts:', posts);
        this.firestorePosts = posts;
        this.isLoadingPosts = false;
      },
      error: error => {
        console.error('Error fetching posts:', error);
        this.toastService.show('Failed to load posts', 'error');
        this.isLoadingPosts = false;
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    
    // Clean up any comment subscriptions
    Object.values(this.commentSubscriptions).forEach(subscription => {
      subscription.unsubscribe();
    });
  }
  
  openPostForm(): void {
    this.showPostForm = true;
  }
  
  closePostForm(): void {
    this.showPostForm = false;
    // Reload posts after closing form to fetch any new posts
    this.loadPosts();
  }
  
  toggleComments(postId: string | undefined): void {
    if (!postId) return;
    
    if (this.expandedPostId === postId) {
      this.expandedPostId = null;
    } else {
      this.expandedPostId = postId;
      this.loadComments(postId);
    }
  }
  
  loadComments(postId: string): void {
    if (!postId) return;
    
    // Clear any existing subscription
    if (this.commentSubscriptions[postId]) {
      this.commentSubscriptions[postId].unsubscribe();
      delete this.commentSubscriptions[postId];
    }
    
    this.loadingComments = true;
    
    this.commentSubscriptions[postId] = this.postService.getPostComments(postId).subscribe({
      next: comments => {
        this.postComments[postId] = comments;
        this.loadingComments = false;
      },
      error: error => {
        console.error('Error loading comments:', error);
        this.toastService.show('Failed to load comments', 'error');
        this.loadingComments = false;
        this.postComments[postId] = [];
      }
    });
  }
  
  async submitComment(postId: string): Promise<void> {
    if (!postId || !this.newComment.trim()) return;
    
    try {
      await this.postService.addComment(postId, this.newComment);
      this.newComment = '';
      
      // Refresh comments
      this.loadComments(postId);
    } catch (error) {
      console.error('Error adding comment:', error);
      this.toastService.show('Failed to add comment', 'error');
    }
  }
  
  async deletePost(postId: string): Promise<void> {
    if (!postId) return;
    
    const confirmed = confirm('Are you sure you want to delete this post?');
    
    if (confirmed) {
      try {
        await this.postService.deletePost(postId);
        this.toastService.show('Post deleted successfully', 'success');
        // Reload posts after deletion
        this.loadPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        this.toastService.show('Failed to delete post', 'error');
      }
    }
  }
  
  async deleteComment(postId: string, commentId: string): Promise<void> {
    if (!postId || !commentId) return;
    
    const confirmed = confirm('Are you sure you want to delete this comment?');
    
    if (confirmed) {
      try {
        await this.postService.deleteComment(postId, commentId);
        
        // Remove from local array
        if (this.postComments[postId]) {
          this.postComments[postId] = this.postComments[postId].filter(
            comment => comment.id !== commentId
          );
        }
        
        this.toastService.show('Comment deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting comment:', error);
        this.toastService.show('Failed to delete comment', 'error');
      }
    }
  }
  
  // Add this method if referenced in your HTML
  viewPostInsights(post: Post): void {
    console.log('View insights for post:', post);
    // Implementation would go here
  }
}