import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    console.log('AuthGuard checking route:', state.url);
    
    // Don't apply guards to login routes
    if (state.url.includes('/auth/volunteer/login') || state.url.includes('/auth/ngo/login')) {
      console.log('Login route detected, allowing access');
      return true;
    }
    
    const userProfile = await this.authService.getCurrentUser();
    console.log('Current user:', userProfile);
    
    if (!userProfile) {
      console.log('No authenticated user, redirecting to login');
      
      // Determine which login page to redirect to based on the attempted route
      if (state.url.includes('/volunteer')) {
        this.router.navigate(['/auth/volunteer/login']);
      } else if (state.url.includes('/ngo')) {
        this.router.navigate(['/auth/ngo/login']);
      } else {
        // Default to volunteer login
        this.router.navigate(['/auth/volunteer/login']);
      }
      return false;
    }
    
    const requiredUserType = route.data['userType'];
    if (requiredUserType && userProfile.userType !== requiredUserType) {
      console.log('User type mismatch:', userProfile.userType, 'vs required', requiredUserType);
      
      // Redirect to appropriate dashboard based on user type
      if (userProfile.userType === 'volunteer') {
        this.router.navigate(['/volunteer/dashboard']);
      } else {
        this.router.navigate(['/ngo/dashboard']);
      }
      return false;
    }
    
    const requiresOnboarding = route.data['requiresOnboarding'];
    if (requiresOnboarding !== undefined) {
      const isOnboarded = userProfile.isOnboarded || false;
      console.log('Onboarding check:', requiresOnboarding, isOnboarded);
      
      if (requiresOnboarding && !isOnboarded) {
        // User needs to complete onboarding
        console.log('User needs to complete onboarding');
        if (userProfile.userType === 'volunteer') {
          this.router.navigate(['/auth/volunteer/onboarding']);
        } else {
          this.router.navigate(['/auth/ngo/onboarding']);
        }
        return false;
      }
      
      if (!requiresOnboarding && isOnboarded) {
        // User is already onboarded, redirect to dashboard
        console.log('User already onboarded, redirecting to dashboard');
        if (userProfile.userType === 'volunteer') {
          this.router.navigate(['/volunteer/dashboard']);
        } else {
          this.router.navigate(['/ngo/dashboard']);
        }
        return false;
      }
    }
    
    // Check for verification status for NGOs if route requires it
    const requiresVerification = route.data['requiresVerification'];
    if (requiresVerification && userProfile.userType === 'ngo') {
      const isVerified = userProfile.isVerified || false;
      console.log('Verification check for NGO:', isVerified);
      
      if (requiresVerification && !isVerified) {
        // NGO is not verified yet
        console.log('NGO not verified, redirecting to verification pending');
        this.router.navigate(['/ngo/verification-pending']);
        return false;
      }
    }
    
    console.log('All auth checks passed, allowing access to:', state.url);
    return true;
  }
}