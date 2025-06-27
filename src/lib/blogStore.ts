import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  author: string;
  authorId: string;
  date: string;
  views: number;
  published: boolean;
  likes: number;
  comments: Comment[];
  bookmarked: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  date: string;
}

interface BlogState {
  blogs: Blog[];
  bookmarks: string[];
  addBlog: (blog: Omit<Blog, 'id' | 'date' | 'views' | 'published' | 'likes' | 'comments' | 'bookmarked'>) => string;
  publishBlog: (id: string) => void;
  getBlog: (id: string) => Blog | undefined;
  getUserBlogs: (userId: string) => Blog[];
  getPublishedBlogs: () => Blog[];
  likeBlog: (id: string) => void;
  addComment: (id: string, comment: Omit<Comment, 'id' | 'date' | 'authorId'>) => void;
  toggleBookmark: (blogId: string, userId: string) => void;
  getBookmarkedBlogs: (userId: string) => Blog[];
  deleteBlog: (id: string) => void;
  updateBlog: (id: string, updates: Partial<Blog>) => void;
  isBookmarked: (blogId: string, userId: string) => boolean;
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set, get) => ({
      blogs: [],
      bookmarks: [],
      addBlog: (blog) => {
        const newBlog: Blog = {
          id: Date.now().toString(),
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          image: blog.image,
          author: blog.author,
          authorId: blog.authorId,
          date: new Date().toISOString(),
          views: 0,
          published: false,
          likes: 0,
          comments: [],
          bookmarked: false,
        };
        set((state) => ({ blogs: [...state.blogs, newBlog] }));
        return newBlog.id;
      },
      publishBlog: (id) => {
        set((state) => ({
          blogs: state.blogs.map((blog) =>
            blog.id === id ? { ...blog, published: true } : blog
          ),
        }));
      },
      getBlog: (id) => {
        return get().blogs.find((blog) => blog.id === id);
      },
      getUserBlogs: (userId) => {
        return get().blogs.filter((blog) => blog.authorId === userId);
      },
      getPublishedBlogs: () => {
        return get().blogs.filter((blog) => blog.published);
      },
      likeBlog: (id) => {
        set((state) => ({
          blogs: state.blogs.map((blog) =>
            blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
          ),
        }));
      },
      addComment: (id, comment) => {
        const newComment: Comment = {
          id: Date.now().toString(),
          content: comment.content,
          author: comment.author,
          authorId: get().blogs.length.toString(),
          date: new Date().toISOString(),
        };
        
        set((state) => ({
          blogs: state.blogs.map((blog) =>
            blog.id === id 
              ? { ...blog, comments: [...blog.comments, newComment] } 
              : blog
          ),
        }));
      },
      toggleBookmark: (blogId, userId) => {
        set((state) => {
          const bookmarkKey = `${userId}-${blogId}`;
          const isCurrentlyBookmarked = state.bookmarks.includes(bookmarkKey);
          
          return {
            bookmarks: isCurrentlyBookmarked
              ? state.bookmarks.filter(b => b !== bookmarkKey)
              : [...state.bookmarks, bookmarkKey]
          };
        });
      },
      getBookmarkedBlogs: (userId) => {
        const bookmarks = get().bookmarks;
        return get().blogs.filter((blog) => 
          bookmarks.includes(`${userId}-${blog.id}`)
        );
      },
      deleteBlog: (id) => {
        set((state) => ({
          blogs: state.blogs.filter((blog) => blog.id !== id),
          bookmarks: state.bookmarks.filter(b => !b.endsWith(`-${id}`))
        }));
      },
      updateBlog: (id, updates) => {
        set((state) => ({
          blogs: state.blogs.map((blog) =>
            blog.id === id ? { ...blog, ...updates } : blog
          ),
        }));
      },
      isBookmarked: (blogId, userId) => {
        return get().bookmarks.includes(`${userId}-${blogId}`);
      },
    }),
    {
      name: 'blog-storage',
    }
  )
);