import { Injectable } from '@angular/core';
import { 
  Firestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  collection
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService, UserProfile } from './auth.service';

export interface NgoProfile {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  foundedYear?: number;
  profileCompletion?: number;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  categories?: string[];
  createdAt?: any;
  updatedAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NgoService {
  private currentNgoSubject = new BehaviorSubject<NgoProfile | null>(null);
  currentNgo$: Observable<NgoProfile | null> = this.currentNgoSubject.asObservable();
  
  // Default avatar image path
  private defaultAvatar = '/assets/images/orgs/default-ngo.png';
  
  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    // Subscribe to auth changes to load NGO profile
    this.authService.currentUser$.subscribe(async (user) => {
      if (user && user.userType === 'ngo') {
        await this.loadNgoProfile(user.uid);
      } else {
        this.currentNgoSubject.next(null);
      }
    });
  }

  // Get current NGO profile or null
  get currentNgo(): NgoProfile | null {
    return this.currentNgoSubject.value;
  }

  // Load NGO profile from Firestore
  async loadNgoProfile(uid: string): Promise<NgoProfile | null> {
    try {
      const ngoDoc = doc(this.firestore, 'ngos', uid);
      const ngoSnapshot = await getDoc(ngoDoc);
      
      if (ngoSnapshot.exists()) {
        // NGO profile exists
        const ngoData = ngoSnapshot.data() as NgoProfile;
        this.currentNgoSubject.next(ngoData);
        return ngoData;
      } else {
        // No NGO profile yet - create one from user data
        const userProfile = await this.authService.getCurrentUser();
        if (userProfile) {
          const newNgoProfile: NgoProfile = {
            uid: userProfile.uid,
            name: userProfile.displayName || 'New Organization',
            email: userProfile.email,
            avatar: userProfile.photoURL || this.defaultAvatar,
            profileCompletion: 30, // Basic profile is 30% complete
            description: 'Organization description not added yet.',
            categories: ['General'],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };
          
          // Save new NGO profile to Firestore
          await setDoc(ngoDoc, newNgoProfile);
          this.currentNgoSubject.next(newNgoProfile);
          return newNgoProfile;
        }
        return null;
      }
    } catch (error) {
      console.error('Error loading NGO profile:', error);
      return null;
    }
  }

  // Update NGO profile
  async updateNgoProfile(ngoData: Partial<NgoProfile>): Promise<boolean> {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      const ngoDoc = doc(this.firestore, 'ngos', currentUser.uid);
      await updateDoc(ngoDoc, {
        ...ngoData,
        updatedAt: serverTimestamp(),
        // Calculate profile completion
        profileCompletion: this.calculateProfileCompletion({
          ...this.currentNgo,
          ...ngoData
        })
      });
      
      // Update the current NGO subject
      const currentNgo = this.currentNgoSubject.value;
      if (currentNgo) {
        this.currentNgoSubject.next({
          ...currentNgo,
          ...ngoData,
          profileCompletion: this.calculateProfileCompletion({
            ...currentNgo,
            ...ngoData
          })
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error updating NGO profile:', error);
      return false;
    }
  }

  // Calculate profile completion percentage
  private calculateProfileCompletion(profile: Partial<NgoProfile>): number {
    const fields = [
      'name', 'email', 'description', 'website', 
      'phone', 'address', 'foundedYear', 'categories'
    ];
    
    const socialFields = profile.socialMedia ? 
      Object.values(profile.socialMedia).filter(Boolean).length : 0;
    
    const completedFields = fields.filter(field => 
      profile[field as keyof NgoProfile] !== undefined && 
      profile[field as keyof NgoProfile] !== ''
    ).length;
    
    // Calculate percentage (basic fields + social media)
    return Math.round(((completedFields / fields.length) * 80) + 
      ((socialFields / 3) * 20));
  }
}