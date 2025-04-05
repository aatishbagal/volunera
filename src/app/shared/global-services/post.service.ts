import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  doc,
  serverTimestamp,
  increment,
  collectionData,
  docData
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Post, Comment } from '../models/post.model';
import { NgoService } from '../../auth/services/ngo.service';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  
  constructor(
    private firestore: Firestore,
    private ngoService: NgoService,
    private authService: AuthService
  ) {}

  getAllPosts(): Observable<Post[]> {
    console.log('PostService: Getting all posts from Firestore');
    
    const postsRef = collection(this.firestore, 'posts');
    const postsQuery = query(postsRef, orderBy('date', 'desc'));
    
    return collectionData(postsQuery, { idField: 'id' }).pipe(
      map(posts => {
        // Process posts to add isOwnOrg property and convert dates
        return posts.map(post => ({
          ...post,
          isOwnOrg: false, // We'll set this correctly below
          date: this.convertTimestampToDate(post['date'])
        })) as Post[];
      })
    );
  }

  // Get posts from the current organization only (for NGOs)
  getOrganizationPosts(): Observable<Post[]> {
    return this.ngoService.currentNgo$.pipe(
      switchMap(currentNgo => {
        if (!currentNgo) return of([]);
        
        const postsRef = collection(this.firestore, 'posts');
        const postsQuery = query(
          postsRef, 
          where('orgId', '==', currentNgo.uid),
          orderBy('date', 'desc')
        );
        
        return collectionData(postsQuery, { idField: 'id' }).pipe(
          map(posts => posts.map(post => ({
            ...post, 
            isOwnOrg: true,
            date: this.convertTimestampToDate(post['date'])
          })) as Post[])
        );
      })
    );
  }

  // Create a new post (text only) - NGO only
  async createPost(content: string): Promise<void> {
    try {
      const currentNgo = this.ngoService.currentNgo;
      
      if (!currentNgo) {
        throw new Error('No organization found');
      }
      
      const newPost: Omit<Post, 'id'> = {
        orgId: currentNgo.uid || '',
        orgName: currentNgo.name || '',
        orgAvatar: currentNgo.avatar || 'assets/images/orgs/default-ngo.png',
        content: content,
        date: serverTimestamp(),
        likes: 0,
        comments: 0,
        reach: 0
      };
      
      const postsRef = collection(this.firestore, 'posts');
      await addDoc(postsRef, newPost);
      
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Get comments for a specific post
  getPostComments(postId: string): Observable<Comment[]> {
    const commentsRef = collection(this.firestore, 'comments');
    const commentsQuery = query(
      commentsRef,
      where('postId', '==', postId),
      orderBy('date', 'desc')
    );
    
    return collectionData(commentsQuery, { idField: 'id' }).pipe(
      map(comments => comments.map(comment => ({
        ...comment,
        date: this.convertTimestampToDate(comment['date'])
      })) as Comment[])
    );
  }

  // Add a comment to a post (works for both NGOs and volunteers)
  async addComment(postId: string, content: string): Promise<void> {
    try {
      // Check if user is NGO first
      const currentNgo = this.ngoService.currentNgo;
      
      let userId = '';
      let userName = '';
      let userAvatar = '';
      let userType: 'ngo' | 'volunteer'; 
      
      if (currentNgo) {
        // User is an NGO
        userId = currentNgo.uid || '';
        userName = currentNgo.name || '';
        userAvatar = currentNgo.avatar || 'assets/images/orgs/default-ngo.png';
        userType = 'ngo';
      } else {
        // User is a volunteer
        const user = await this.authService.getCurrentUser();
        if (!user) {
          throw new Error('No user found');
        }
        
        userId = user.uid;
        userName = user.displayName || 'Volunteer';
        userAvatar = user.photoURL || 'assets/images/avatars/default-user.png';
        userType = 'volunteer';
      }
      
      // Create the comment
      const newComment: Omit<Comment, 'id'> = {
        postId: postId,
        userId: userId,
        userName: userName,
        userAvatar: userAvatar,
        content: content,
        date: serverTimestamp(),
        userType: userType
      };
      
      // Add comment to Firestore
      const commentsRef = collection(this.firestore, 'comments');
      await addDoc(commentsRef, newComment);
      
      // Update post comment count
      const postRef = doc(this.firestore, 'posts', postId);
      await updateDoc(postRef, {
        comments: increment(1)
      });
      
      return;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
  
  // Delete a comment
  async deleteComment(postId: string, commentId: string): Promise<void> {
    try {
      // Delete the comment
      const commentRef = doc(this.firestore, 'comments', commentId);
      await deleteDoc(commentRef);
      
      // Update post comment count
      const postRef = doc(this.firestore, 'posts', postId);
      await updateDoc(postRef, {
        comments: increment(-1)
      });
      
      return;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Delete post - NGO only
  async deletePost(postId: string): Promise<void> {
    try {
      const currentNgo = this.ngoService.currentNgo;
      
      if (!currentNgo) {
        throw new Error('Unauthorized: Only NGOs can delete posts');
      }
      
      // Get the post to check ownership
      const postRef = doc(this.firestore, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        throw new Error('Post not found');
      }
      
      const post = postSnap.data() as Post;
      
      if (post.orgId !== currentNgo.uid) {
        throw new Error('Unauthorized: You can only delete your own posts');
      }
      
      // Delete the post
      await deleteDoc(postRef);
      
      // Delete all comments for this post
      const commentsRef = collection(this.firestore, 'comments');
      const commentsQuery = query(commentsRef, where('postId', '==', postId));
      const commentsSnap = await getDocs(commentsQuery);
      
      // Delete each comment
      const deletePromises: Promise<void>[] = [];
      commentsSnap.forEach((docSnap) => {
        deletePromises.push(deleteDoc(doc(this.firestore, 'comments', docSnap.id)));
      });
      
      // Wait for all comment deletions to complete
      await Promise.all(deletePromises);
      
      return;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Check if current user can delete a comment
  async canDeleteComment(comment: Comment): Promise<boolean> {
    try {
      // Check if user is an NGO
      const currentNgo = this.ngoService.currentNgo;
      
      if (currentNgo) {
        // NGO can delete its own comments
        if (comment.userId === currentNgo.uid) {
          return true;
        }
        
        // NGO can also delete comments on its own posts
        const postRef = doc(this.firestore, 'posts', comment.postId);
        const postSnap = await getDoc(postRef);
        
        if (postSnap.exists()) {
          const post = postSnap.data() as Post;
          if (post.orgId === currentNgo.uid) {
            return true;
          }
        }
      } else {
        // Get volunteer user profile
        const userProfile = await this.authService.getCurrentUser();
        
        // Volunteers can only delete their own comments
        if (userProfile && userProfile.uid === comment.userId) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking comment delete authorization:', error);
      return false;
    }
  }

  // Update post (for editing content) - NGO only
  async updatePost(postId: string, newContent: string): Promise<void> {
    try {
      // Check if user is authorized to update this post
      const currentNgo = this.ngoService.currentNgo;
      if (!currentNgo) {
        throw new Error('Unauthorized: Only NGOs can update posts');
      }
      
      // Get the post to check ownership
      const postRef = doc(this.firestore, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        throw new Error('Post not found');
      }
      
      const post = postSnap.data() as Post;
      
      if (post.orgId !== currentNgo.uid) {
        throw new Error('Unauthorized: You can only update your own posts');
      }
      
      await updateDoc(postRef, { content: newContent });
      return;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }
  
  // Helper to check if user is an NGO (useful for UI permissions)
  async isNgo(): Promise<boolean> {
    const userProfile = await this.authService.getCurrentUser();
    return userProfile?.userType === 'ngo';
  }
  
  // Helper to check if user is a volunteer
  async isVolunteer(): Promise<boolean> {
    const userProfile = await this.authService.getCurrentUser();
    return userProfile?.userType === 'volunteer';
  }
  
  // Helper to convert Firestore timestamp to Date
  private convertTimestampToDate(timestamp: any): Date {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    return timestamp;
  }
}