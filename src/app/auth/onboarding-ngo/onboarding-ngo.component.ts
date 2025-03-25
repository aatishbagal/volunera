import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { 
  Storage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from '@angular/fire/storage';

@Component({
  selector: 'app-onboarding-ngo',
  templateUrl: './onboarding-ngo.component.html',
  styleUrls: ['./onboarding-ngo.component.scss'],
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
export class OnboardingNgoComponent implements OnInit {
  // Steps configuration
  steps = [
    { title: 'Organization Information', description: 'Tell us about your organization' },
    { title: 'Location & Mission', description: 'Where you work and what you aim to achieve' },
    { title: 'Social Media & Verification', description: 'Help us verify your organization' }
  ];
  
  currentStep = 0;
  
  // Forms for each step
  orgInfoForm: FormGroup;
  missionForm: FormGroup;
  verificationForm: FormGroup;
  
  // UI state
  isLoading = false;
  loadingMessage = 'Processing...';
  errorMessage = '';
  logoPreview: string | null = null;
  selectedLogoFile: File | null = null;
  registrationDoc: File | null = null;
  taxDoc: File | null = null;
  letterDoc: File | null = null;
  verificationAttempted = false;
  
  // Data for form options
  causes = [
    { name: 'Education', value: 'education', icon: 'fa-book', description: 'Educational programs and literacy' },
    { name: 'Environment', value: 'environment', icon: 'fa-leaf', description: 'Environmental conservation and sustainability' },
    { name: 'Healthcare', value: 'healthcare', icon: 'fa-heartbeat', description: 'Health services and medical support' },
    { name: 'Animal Welfare', value: 'animals', icon: 'fa-paw', description: 'Animal protection and welfare' },
    { name: 'Community Development', value: 'community', icon: 'fa-users', description: 'Community empowerment and support services' },
    { name: 'Disaster Relief', value: 'disaster', icon: 'fa-house-damage', description: 'Emergency response and disaster recovery' },
    { name: 'Poverty Alleviation', value: 'poverty', icon: 'fa-hands-helping', description: 'Programs to reduce poverty and inequality' },
    { name: 'Arts & Culture', value: 'arts', icon: 'fa-palette', description: 'Promotion of arts, culture and heritage' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storage: Storage
  ) {
    this.orgInfoForm = this.createOrgInfoForm();
    this.missionForm = this.createMissionForm();
    this.verificationForm = this.createVerificationForm();
  }
  
  ngOnInit(): void {
    // Check if user is authenticated
    this.authService.getCurrentUser()
      .then(user => {
        if (!user) {
          this.router.navigate(['/auth/ngo/login']);
        } else if (user.isOnboarded) {
          this.router.navigate(['/ngo/dashboard']);
        }
      });
  }
  
  // Form creation methods
  createOrgInfoForm(): FormGroup {
    const currentYear = new Date().getFullYear();
    
    return this.fb.group({
      orgName: ['', Validators.required],
      displayName: ['', Validators.required],
      website: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')],
      phone: ['', Validators.pattern('^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$')],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      establishedYear: ['', [
        Validators.min(1800),
        Validators.max(currentYear)
      ]],
      logo: ['']
    });
  }
  
  createMissionForm(): FormGroup {
    return this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
      country: [''],
      mission: ['', Validators.required],
      causes: [[], [Validators.required, Validators.minLength(1)]],
      needsRegular: [false],
      needsOneTime: [false],
      needsRemote: [false]
    });
  }
  
  createVerificationForm(): FormGroup {
    return this.fb.group({
      facebook: [''],
      twitter: [''],
      instagram: [''],
      linkedin: [''],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }
  
  // Computed properties
  get descriptionLength(): number {
    return this.orgInfoForm.get('description')?.value?.length || 0;
  }
  
  // Step navigation
  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
      }
    } else {
      this.submitOnboarding();
    }
  }
  
  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  
  isNextDisabled(): boolean {
    if (this.currentStep === 2) {
      return this.verificationForm.invalid || (!this.isAnyDocumentUploaded() && !this.verificationAttempted);
    }
    
    switch(this.currentStep) {
      case 0:
        return this.orgInfoForm.invalid;
      case 1:
        return this.missionForm.invalid;
      default:
        return false;
    }
  }
  
  validateCurrentStep(): boolean {
    switch(this.currentStep) {
      case 0:
        return this.orgInfoForm.valid;
      case 1:
        return this.missionForm.valid;
      case 2:
        this.verificationAttempted = true;
        return this.verificationForm.valid && this.isAnyDocumentUploaded();
      default:
        return true;
    }
  }
  
  // Cause selection methods
  toggleCause(cause: string): void {
    const causesControl = this.missionForm.get('causes');
    const currentCauses = causesControl?.value || [];
    
    if (currentCauses.includes(cause)) {
      causesControl?.setValue(currentCauses.filter((c: string) => c !== cause));
    } else {
      causesControl?.setValue([...currentCauses, cause]);
    }
  }
  
  isCauseSelected(cause: string): boolean {
    return (this.missionForm.get('causes')?.value || []).includes(cause);
  }
  
  // File handling methods
  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedLogoFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  removeLogo(): void {
    this.logoPreview = null;
    this.selectedLogoFile = null;
  }
  
  onRegistrationDocSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.registrationDoc = file;
    }
  }
  
  onTaxDocSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.taxDoc = file;
    }
  }
  
  onLetterDocSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.letterDoc = file;
    }
  }
  
  isAnyDocumentUploaded(): boolean {
    return this.registrationDoc !== null || this.taxDoc !== null || this.letterDoc !== null;
  }
  
  // Final submission
  async submitOnboarding(): Promise<void> {
    if (this.orgInfoForm.invalid || this.missionForm.invalid || this.verificationForm.invalid || !this.isAnyDocumentUploaded()) {
      this.verificationAttempted = true;
      this.errorMessage = 'Please complete all required fields and upload at least one verification document';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }
    
    this.isLoading = true;
    this.loadingMessage = 'Creating your organization profile...';
    
    try {
      // 1. Upload logo if selected
      let logoUrl = '';
      if (this.selectedLogoFile) {
        this.loadingMessage = 'Uploading logo...';
        logoUrl = await this.uploadFile(this.selectedLogoFile, 'logos');
      }
      
      // 2. Upload verification documents
      this.loadingMessage = 'Uploading verification documents...';
      const verificationDocs: { type: string; url: string }[] = [];
      
      if (this.registrationDoc) {
        const url = await this.uploadFile(this.registrationDoc, 'verification-docs');
        verificationDocs.push({ type: 'registration', url });
      }
      
      if (this.taxDoc) {
        const url = await this.uploadFile(this.taxDoc, 'verification-docs');
        verificationDocs.push({ type: 'tax', url });
      }
      
      if (this.letterDoc) {
        const url = await this.uploadFile(this.letterDoc, 'verification-docs');
        verificationDocs.push({ type: 'letter', url });
      }
      
      // 3. Get user ID
      const user = await this.authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // 4. Prepare NGO profile data
      const ngoProfile = {
        orgName: this.orgInfoForm.get('orgName')?.value,
        displayName: this.orgInfoForm.get('displayName')?.value,
        email: user.email,
        website: this.orgInfoForm.get('website')?.value,
        phone: this.orgInfoForm.get('phone')?.value,
        description: this.orgInfoForm.get('description')?.value,
        establishedYear: this.orgInfoForm.get('establishedYear')?.value,
        logo: logoUrl,
        address: {
          street: this.missionForm.get('street')?.value,
          city: this.missionForm.get('city')?.value,
          state: this.missionForm.get('state')?.value,
          zip: this.missionForm.get('zip')?.value,
          country: this.missionForm.get('country')?.value
        },
        mission: this.missionForm.get('mission')?.value,
        causes: this.missionForm.get('causes')?.value,
        volunteerNeeds: {
          regular: this.missionForm.get('needsRegular')?.value,
          oneTime: this.missionForm.get('needsOneTime')?.value,
          remote: this.missionForm.get('needsRemote')?.value
        },
        socialMedia: {
          facebook: this.verificationForm.get('facebook')?.value,
          twitter: this.verificationForm.get('twitter')?.value,
          instagram: this.verificationForm.get('instagram')?.value,
          linkedin: this.verificationForm.get('linkedin')?.value
        },
        verificationDocs: verificationDocs,
        isVerified: false, // Will be set to true after admin review
        isOnboarded: true,
        verificationStatus: 'pending',
        verificationSubmittedAt: new Date().toISOString()
      };
      
      // 5. Update user profile in Firestore
      this.loadingMessage = 'Saving your profile...';
      await this.authService.updateUserProfile(user.uid, ngoProfile);
      
      // 6. Navigate to verification pending page
      this.router.navigate(['/ngo/verification-pending']);
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
  
  // Upload file to Firebase Storage
  private async uploadFile(file: File, folder: string): Promise<string> {
    try {
      const userId = (await this.authService.getCurrentUser())?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const filePath = `${folder}/${userId}/${new Date().getTime()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Wait for upload to complete
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Get upload progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.loadingMessage = `Uploading ${file.name}: ${Math.round(progress)}%`;
          },
          (error) => {
            reject(error);
          },
          () => {
            resolve();
          }
        );
      });
      
      // Get download URL
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }
}