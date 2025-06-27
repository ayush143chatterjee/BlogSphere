import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { UserRole } from './types';

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  userRole: UserRole;
}

// Default admin credentials
const ADMIN_EMAIL = 'ayush145@gmail.com';
const ADMIN_PASSWORD = 'ilovebooks';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      userRole: 'reader',
      signUp: async (email: string, password: string, displayName: string) => {
        try {
          set({ loading: true, error: null });
          const { user } = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(user, { 
            displayName: email === ADMIN_EMAIL ? 'Admin' : displayName 
          });
          set({ user, userRole: 'reader' });
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          const { user } = await signInWithEmailAndPassword(auth, email, password);
          
          // Set admin name and role if matching default admin credentials
          if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            await updateProfile(user, { displayName: 'Admin' });
            set({ user, userRole: 'admin' });
          } else {
            set({ user, userRole: 'reader' });
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        try {
          set({ loading: true, error: null });
          await signOut(auth);
          set({ user: null, userRole: 'reader' });
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
      updateUserProfile: async (displayName: string, photoURL?: string) => {
        try {
          set({ loading: true, error: null });
          if (auth.currentUser) {
            // Prevent changing admin name
            if (auth.currentUser.email === ADMIN_EMAIL) {
              displayName = 'Admin';
            }
            await updateProfile(auth.currentUser, { displayName, photoURL });
            set({ user: auth.currentUser });
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ error: errorMessage });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, userRole: state.userRole })
    }
  )
);

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
  const currentState = useAuthStore.getState();
  // Preserve admin role and name if user is admin
  if (user?.email === ADMIN_EMAIL) {
    updateProfile(user, { displayName: 'Admin' });
    useAuthStore.setState({ user, userRole: 'admin' });
  } else {
    useAuthStore.setState({ user, userRole: user ? 'reader' : 'reader' });
  }
});