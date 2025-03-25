import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-ngo',
  templateUrl: './login-ngo.component.html',
  styleUrls: ['./login-ngo.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
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
export class LoginNgoComponent implements OnInit {
  authForm: FormGroup;
  authMode: 'login' | 'signup' = 'login';
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.createLoginForm();
  }

  ngOnInit(): void {
  }

  get email() { return this.authForm.get('email'); }
  get password() { return this.authForm.get('password'); }
  get confirmPassword() { return this.authForm.get('confirmPassword'); }

  setAuthMode(mode: 'login' | 'signup'): void {
    this.authMode = mode;
    this.authForm = mode === 'login' ? this.createLoginForm() : this.createSignupForm();
  }

  createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  createSignupForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      g.get('confirmPassword')?.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    const { email, password } = this.authForm.value;
    
    if (this.authMode === 'login') {
      this.authService.loginWithEmail(email, password, 'ngo')
        .then(() => {
          this.router.navigate(['/ngo/dashboard']);
        })
        .catch(error => {
          this.handleAuthError(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.authService.signupWithEmail(email, password, 'ngo')
        .then(() => {
          this.router.navigate(['/ngo/onboarding']);
        })
        .catch(error => {
          this.handleAuthError(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  signInWithGoogle(): void {
    this.isLoading = true;
    this.authService.signInWithGoogle('ngo')
      .then(() => {
        this.router.navigate(['/ngo/dashboard']);
      })
      .catch(error => {
        this.handleAuthError(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  forgotPassword(): void {
    if (!this.email?.value) {
      this.errorMessage = 'Please enter your email address';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }
    
    this.isLoading = true;
    this.authService.resetPassword(this.email.value)
      .then(() => {
        alert('Password reset email sent. Please check your inbox.');
      })
      .catch(error => {
        this.handleAuthError(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  private handleAuthError(error: any): void {
    console.error('Authentication error:', error);
    
    // Map Firebase errors to user-friendly messages
    switch(error.code) {
      case 'auth/user-not-found':
        this.errorMessage = 'No account found with this email address';
        break;
      case 'auth/wrong-password':
        this.errorMessage = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        this.errorMessage = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        this.errorMessage = 'Invalid email address';
        break;
      case 'auth/weak-password':
        this.errorMessage = 'Password is too weak';
        break;
      case 'auth/network-request-failed':
        this.errorMessage = 'Network error. Please check your internet connection';
        break;
      default:
        this.errorMessage = error.message || 'Authentication failed. Please try again';
    }
    
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}