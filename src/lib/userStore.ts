import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
  emailNotifications: boolean;
  appNotifications: boolean;
}

interface UserState {
  user: UserProfile | null;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setProfileImage: (imageUrl: string) => void;
  toggleEmailNotifications: () => void;
  toggleAppNotifications: () => void;
  deactivateAccount: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        id: '1',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1 234-567-8900',
        emailNotifications: true,
        appNotifications: true,
      },
      updateProfile: (profile) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : null,
        }));
      },
      setProfileImage: (imageUrl) => {
        set((state) => ({
          user: state.user ? { ...state.user, profileImage: imageUrl } : null,
        }));
      },
      toggleEmailNotifications: () => {
        set((state) => ({
          user: state.user
            ? { ...state.user, emailNotifications: !state.user.emailNotifications }
            : null,
        }));
      },
      toggleAppNotifications: () => {
        set((state) => ({
          user: state.user
            ? { ...state.user, appNotifications: !state.user.appNotifications }
            : null,
        }));
      },
      deactivateAccount: () => {
        set({ user: null });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);