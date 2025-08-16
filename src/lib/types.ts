export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  bio?: string;
  isPublic?: boolean;
}

export interface Comment {
  text: string;
  authorId: string;
  authorName: string;
  createdAt: number;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  createdAt: number;
  likes: {
    [userId: string]: boolean;
  };
  comments: {
    [commentId: string]: Comment;
  };
}
