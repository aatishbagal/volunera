export interface Volunteer {
    uid: string;
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    bio?: string;
    profileImage?: string;
    skills: string[];
    interests: string[];
    availability: 'regular' | 'onetime' | 'flexible';
    locationType: 'remote' | 'local' | 'both';
    city?: string;
    radius?: number;
    emailNotifications: boolean;
    smsNotifications: boolean;
    points?: number;
    eventsAttended?: number;
    badges?: string[];
    isOnboarded: boolean;
    createdAt: any;
    updatedAt: any;
    userType: 'volunteer';
  }