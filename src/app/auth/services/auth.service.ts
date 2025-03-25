import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  uid: string;
  email: string;
  userType: 'volunteer' | 'ngo';
  displayName?: string;
  photoURL?: string;
  isOnboarded?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  currentUser$: Observable<UserProfile | null> = this.currentUserSubject.asObservable();
  
  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    // Listen for auth state changes
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const userProfile = await this.getUserProfile(user.uid);
        this.currentUserSubject.next(userProfile);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  // Get current user as a Promise (for guards/resolvers)
  getCurrentUser(): Promise<UserProfile | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, async (user) => {
        unsubscribe();
        if (user) {
          const userProfile = await this.getUserProfile(user.uid);
          resolve(userProfile);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Email/Password Login
  async loginWithEmail(email: string, password: string, userType: 'volunteer' | 'ngo'): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const userProfile = await this.getUserProfile(userCredential.user.uid);
      
      // Verify user type matches
      if (userProfile.userType !== userType) {
        await this.logout();
        throw new Error(`This account is registered as a ${userProfile.userType}, not as a ${userType}`);
      }
      
      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  // Email/Password Signup
  async signupWithEmail(email: string, password: string, userType: 'volunteer' | 'ngo'): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        userType: userType,
        isOnboarded: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(this.firestore, 'users', user.uid), userProfile);
      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  // Google Sign In
  async signInWithGoogle(userType: 'volunteer' | 'ngo'): Promise<UserProfile> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = userCredential.user;
      
      // Check if user exists in Firestore
      const userDoc = doc(this.firestore, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        // Existing user - verify user type
        const userData = userSnapshot.data() as UserProfile;
        
        if (userData.userType !== userType) {
          await this.logout();
          throw new Error(`This account is registered as a ${userData.userType}, not as a ${userType}`);
        }
        
        // Update last login
        await updateDoc(userDoc, {
          updatedAt: serverTimestamp()
        });
        
        return userData;
      } else {
        // New user - create profile
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          userType: userType,
          isOnboarded: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(userDoc, userProfile);
        return userProfile;
      }
    } catch (error) {
      throw error;
    }
  }

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
    } catch (error) {
      throw error;
    }
  }

  // Update user profile after onboarding
  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const userDoc = doc(this.firestore, 'users', uid);
      await updateDoc(userDoc, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      // Update current user in memory
      const currentUser = this.currentUserSubject.value;
      if (currentUser && currentUser.uid === uid) {
        this.currentUserSubject.next({
          ...currentUser,
          ...data
        });
      }
    } catch (error) {
      throw error;
    }
  }

  // Get user profile from Firestore
  private async getUserProfile(uid: string): Promise<UserProfile> {
    try {
      const userDoc = doc(this.firestore, 'users', uid);
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        return userSnapshot.data() as UserProfile;
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      throw error;
    }
  }
}