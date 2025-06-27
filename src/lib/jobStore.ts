import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Job {
  id: string;
  title: string;
  description: string;
  salary: string;
  location: string;
  type: string;
  postedAt: string;
}

export interface JobApplication {
  jobId: string;
  userId: string;
  name: string;
  resume: string;
  aboutYou: string;
  experience: string;
  worksDone: string;
  appliedAt: string;
}

interface JobState {
  jobs: Job[];
  bookmarks: { [userId: string]: string[] }; // userId -> jobIds
  applications: JobApplication[];
  addJob: (job: Omit<Job, 'id' | 'postedAt'>) => string;
  deleteJob: (id: string) => void;
  getJobs: () => Job[];
  toggleBookmark: (jobId: string, userId: string) => void;
  isBookmarked: (jobId: string, userId: string) => boolean;
  getBookmarkedJobs: (userId: string) => Job[];
  applyForJob: (application: Omit<JobApplication, 'appliedAt'>) => void;
  getAppliedJobs: (userId: string) => { job: Job; application: JobApplication }[];
  hasApplied: (jobId: string, userId: string) => boolean;
}

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      jobs: [],
      bookmarks: {},
      applications: [],
      addJob: (job) => {
        const newJob: Job = {
          id: Date.now().toString(),
          ...job,
          postedAt: new Date().toISOString(),
        };
        set((state) => ({ jobs: [newJob, ...state.jobs] }));
        return newJob.id;
      },
      deleteJob: (id) => {
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== id),
          bookmarks: Object.fromEntries(
            Object.entries(state.bookmarks).map(([userId, bookmarks]) => [
              userId,
              bookmarks.filter((bookmarkId) => bookmarkId !== id),
            ])
          ),
        }));
      },
      getJobs: () => get().jobs,
      toggleBookmark: (jobId, userId) => {
        set((state) => {
          const userBookmarks = state.bookmarks[userId] || [];
          const isBookmarked = userBookmarks.includes(jobId);
          
          return {
            bookmarks: {
              ...state.bookmarks,
              [userId]: isBookmarked
                ? userBookmarks.filter((id) => id !== jobId)
                : [...userBookmarks, jobId],
            },
          };
        });
      },
      isBookmarked: (jobId, userId) => {
        const state = get();
        return (state.bookmarks[userId] || []).includes(jobId);
      },
      getBookmarkedJobs: (userId) => {
        const state = get();
        const bookmarkedIds = state.bookmarks[userId] || [];
        return state.jobs.filter((job) => bookmarkedIds.includes(job.id));
      },
      applyForJob: (application) => {
        const newApplication: JobApplication = {
          ...application,
          appliedAt: new Date().toISOString(),
        };
        set((state) => ({
          applications: [...state.applications, newApplication],
        }));
      },
      getAppliedJobs: (userId) => {
        const state = get();
        return state.applications
          .filter((app) => app.userId === userId)
          .map((app) => ({
            job: state.jobs.find((job) => job.id === app.jobId)!,
            application: app,
          }))
          .sort((a, b) => 
            new Date(b.application.appliedAt).getTime() - 
            new Date(a.application.appliedAt).getTime()
          );
      },
      hasApplied: (jobId, userId) => {
        const state = get();
        return state.applications.some(
          (app) => app.jobId === jobId && app.userId === userId
        );
      },
    }),
    {
      name: 'job-storage',
    }
  )
);