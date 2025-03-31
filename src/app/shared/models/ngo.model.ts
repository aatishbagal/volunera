export interface NGO {
    uid: string;
    orgName: string;
    displayName: string;
    email: string;
    description?: string;
    logo?: string;
    website?: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    mission?: string;
    causes: string[];
    establishedYear?: number;
    volunteerNeeds?: {
      regular: boolean;
      oneTime: boolean;
      remote: boolean;
    };
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    verificationDocs?: Array<{
      type: string;
      url: string;
    }>;
    isVerified: boolean;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    verificationSubmittedAt?: string;
    verificationCompletedAt?: string;
    isOnboarded: boolean;
    createdAt: any;
    updatedAt: any;
    userType: 'ngo';
}