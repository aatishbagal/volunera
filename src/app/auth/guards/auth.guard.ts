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
    const user = await this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/auth/volunteer/login']);
      return false;
    }
    
    const requiredUserType = route.data['userType'];
    if (requiredUserType && user.userType !== requiredUserType) {
      // Redirect to appropriate dashboard based on user type
      if (user.userType === 'volunteer') {
        this.router.navigate(['/volunteer/dashboard']);
      } else {
        this.router.navigate(['/ngo/dashboard']);
      }
      return false;
    }
    
    const requiresOnboarding = route.data['requiresOnboarding'];
    if (requiresOnboarding !== undefined) {
      const isOnboarded = user.isOnboarded || false;
      
      if (requiresOnboarding && !isOnboarded) {
        // User needs to complete onboarding
        if (user.userType === 'volunteer') {
          this.router.navigate(['/auth/volunteer/onboarding']);
        } else {
          this.router.navigate(['/auth/ngo/onboarding']);
        }
        return false;
      }
      
      if (!requiresOnboarding && isOnboarded) {
        // User is already onboarded, redirect to dashboard
        if (user.userType === 'volunteer') {
          this.router.navigate(['/volunteer/dashboard']);
        } else {
          this.router.navigate(['/ngo/dashboard']);
        }
        return false;
      }
    }
    
    // Check for verification status for NGOs if route requires it
    const requiresVerification = route.data['requiresVerification'];
    if (requiresVerification && user.userType === 'ngo') {
      const isVerified = user.isVerified || false;
      
      if (requiresVerification && !isVerified) {
        // NGO is not verified yet
        this.router.navigate(['/ngo/verification-pending']);
        return false;
      }
    }
    
    return true;
  }
}