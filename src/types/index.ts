export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  role: 'user' | 'admin';
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  image_url?: string;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  salary_range: string;
  posted_at: string;
}