export interface Post {
    id?: string;
    orgId: string; 
    orgName: string;
    orgAvatar: string;  
    content: string;
    date: Date | any;
    likes: number;
    comments: number;
    reach: number;
    isOwnOrg?: boolean;
  }
  
  export interface Comment {
    id?: string;
    postId: string; 
    userId: string; 
    userName: string;
    userAvatar?: string;
    content: string;
    date: Date | any;
    userType: 'ngo' | 'volunteer';
}