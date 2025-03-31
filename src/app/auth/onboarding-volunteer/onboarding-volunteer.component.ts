import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService, UserProfile } from '../services/auth.service';
import { Firestore, doc, setDoc, updateDoc, serverTimestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-onboarding-volunteer',
  templateUrl: './onboarding-volunteer.component.html',
  styleUrls: ['./onboarding-volunteer.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class OnboardingVolunteerComponent implements OnInit {
  // Steps configuration
  steps = [
    { title: 'Basic Information', description: 'Tell us about yourself' },
    { title: 'Skills & Interests', description: 'What are you good at and passionate about?' },
    { title: 'Availability & Preferences', description: 'When and how would you like to volunteer?' }
  ];
  
  currentStep = 0;
  
  // Forms for each step
  basicInfoForm: FormGroup;
  skillsForm: FormGroup;
  preferencesForm: FormGroup;
  
  // UI state
  isLoading = false;
  loadingMessage = 'Processing...';
  errorMessage = '';
  imagePreview: string | null = null;
  imageDataUrl: string | null = null;
  
  // Data for form options
  interests = [
    { name: 'Education', value: 'education', icon: 'fa-book', description: 'Teaching, tutoring, and educational programs' },
    { name: 'Environment', value: 'environment', icon: 'fa-leaf', description: 'Conservation, sustainability, and clean-up events' },
    { name: 'Healthcare', value: 'healthcare', icon: 'fa-heartbeat', description: 'Medical assistance, mental health, and wellness' },
    { name: 'Animal Welfare', value: 'animals', icon: 'fa-paw', description: 'Animal shelter support and rescue efforts' },
    { name: 'Community Service', value: 'community', icon: 'fa-users', description: 'Local community development and support' },
    { name: 'Disaster Relief', value: 'disaster', icon: 'fa-house-damage', description: 'Emergency response and recovery assistance' }
  ];
  
  availabilityOptions = [
    { title: 'Regular', value: 'regular', icon: 'fa-calendar-check', description: 'Set weekly or monthly volunteer hours' },
    { title: 'One-time', value: 'onetime', icon: 'fa-calendar-day', description: 'Participate in specific events' },
    { title: 'Flexible', value: 'flexible', icon: 'fa-clock', description: 'Volunteer when you\'re available' }
  ];
  
  selectedSkills: string[] = [];
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore
  ) {
    this.basicInfoForm = this.createBasicInfoForm();
    this.skillsForm = this.createSkillsForm();
    this.preferencesForm = this.createPreferencesForm();
  }
  
  ngOnInit(): void {
    // Check if user is authenticated
    this.authService.getCurrentUser()
      .then(user => {
        if (!user) {
          this.router.navigate(['/auth/volunteer/login']);
        } else if (user.isOnboarded) {
          this.router.navigate(['/volunteer/dashboard']);
        }
      });
  }
  
  // Form creation methods
  createBasicInfoForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      displayName: ['', Validators.required],
      bio: ['', [Validators.maxLength(500)]],
      profileImage: ['']
    });
  }
  
  createSkillsForm(): FormGroup {
    return this.fb.group({
      skillInput: [''],
      skills: [this.selectedSkills, Validators.required],
      interests: [[], [Validators.required, Validators.minLength(1)]]
    });
  }
  
  createPreferencesForm(): FormGroup {
    return this.fb.group({
      availability: ['flexible'],
      locationType: ['both'],
      city: [''],
      radius: [25],
      emailNotifications: [true],
      smsNotifications: [false]
    });
  }
  
  // Computed properties
  get bioLength(): number {
    return this.basicInfoForm.get('bio')?.value?.length || 0;
  }
  
  get showLocationFields(): boolean {
    const locationType = this.preferencesForm.get('locationType')?.value;
    return locationType === 'local' || locationType === 'both';
  }
  
  // Step navigation
  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
        this.updateLocationValidators();
      }
    } else {
      this.submitOnboarding();
    }
  }
  
  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateLocationValidators();
    }
  }
  
  isNextDisabled(): boolean {
    switch(this.currentStep) {
      case 0:
        return this.basicInfoForm.invalid;
      case 1:
        return this.skillsForm.invalid;
      case 2:
        return this.preferencesForm.invalid;
      default:
        return false;
    }
  }
  
  validateCurrentStep(): boolean {
    switch(this.currentStep) {
      case 0:
        return this.basicInfoForm.valid;
      case 1:
        return this.skillsForm.valid;
      case 2:
        return this.preferencesForm.valid;
      default:
        return true;
    }
  }
  
  // Skills handling
  addSkill(event?: any): void {
    if (event) {
      event.preventDefault();
    }
    
    const skillInput = this.skillsForm.get('skillInput');
    const skill = skillInput?.value?.trim();
    
    if (skill && !this.selectedSkills.includes(skill)) {
      this.selectedSkills.push(skill);
      this.skillsForm.get('skills')?.setValue(this.selectedSkills);
      skillInput?.setValue('');
    }
  }
  
  removeSkill(skill: string): void {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
    this.skillsForm.get('skills')?.setValue(this.selectedSkills);
  }
  
  // Interests handling
  toggleInterest(interest: string): void {
    const interestsControl = this.skillsForm.get('interests');
    const currentInterests = interestsControl?.value || [];
    
    if (currentInterests.includes(interest)) {
      interestsControl?.setValue(currentInterests.filter((i: string) => i !== interest));
    } else {
      interestsControl?.setValue([...currentInterests, interest]);
    }
  }
  
  isInterestSelected(interest: string): boolean {
    return (this.skillsForm.get('interests')?.value || []).includes(interest);
  }
  
  // Location validators
  updateLocationValidators(): void {
    const cityControl = this.preferencesForm.get('city');
    const locationType = this.preferencesForm.get('locationType')?.value;
    
    if (locationType === 'local' || locationType === 'both') {
      cityControl?.setValidators([Validators.required]);
    } else {
      cityControl?.clearValidators();
    }
    
    cityControl?.updateValueAndValidity();
  }
  
  // Image handling
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Create a data URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.imageDataUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  removeImage(): void {
    this.imagePreview = null;
    this.imageDataUrl = null;
  }
  
  // Final submission
  async submitOnboarding(): Promise<void> {
    if (this.basicInfoForm.invalid || this.skillsForm.invalid || this.preferencesForm.invalid) {
      this.errorMessage = 'Please complete all required fields';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }
    
    this.isLoading = true;
    this.loadingMessage = 'Creating your profile...';
    
    try {
      // 1. Get user ID
      const user = await this.authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // 2. Prepare volunteer profile data for user update
      const userProfileUpdate: Partial<UserProfile> = {
        displayName: this.basicInfoForm.get('displayName')?.value,
        photoURL: this.imageDataUrl || user.photoURL,
        isOnboarded: true
      };
      
      // 3. Prepare volunteer-specific data for separate collection
      const volunteerProfile = {
        firstName: this.basicInfoForm.get('firstName')?.value,
        lastName: this.basicInfoForm.get('lastName')?.value,
        displayName: this.basicInfoForm.get('displayName')?.value,
        bio: this.basicInfoForm.get('bio')?.value,
        skills: this.selectedSkills,
        interests: this.skillsForm.get('interests')?.value || [],
        availability: this.preferencesForm.get('availability')?.value,
        locationType: this.preferencesForm.get('locationType')?.value,
        city: this.preferencesForm.get('city')?.value,
        radius: this.preferencesForm.get('radius')?.value,
        emailNotifications: this.preferencesForm.get('emailNotifications')?.value,
        smsNotifications: this.preferencesForm.get('smsNotifications')?.value,
        profileImage: this.imageDataUrl, // Store image directly as a data URL
        userId: user.uid,
        email: user.email
      };
      
      // 4. Update user profile in Firestore
      this.loadingMessage = 'Saving your profile...';
      
      // Update the user profile via auth service
      await this.authService.updateUserProfile(user.uid, userProfileUpdate);
      
      // Create a volunteer document in a separate collection
      const volunteerDocRef = doc(this.firestore, 'volunteers', user.uid);
      await setDoc(volunteerDocRef, {
        ...volunteerProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // 5. Navigate to dashboard
      this.router.navigate(['/volunteer/dashboard']);
    } catch (error) {
      console.error('Onboarding error:', error);
      this.errorMessage = 'Failed to complete onboarding. Please try again.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    } finally {
      this.isLoading = false;
    }
  }
}