import React, { useState } from 'react';
import { 
  RefreshCcw, Plus, Search, Filter, X, DollarSign, MapPin, Briefcase, 
  Trash2, ExternalLink, Upload, AlertCircle, Bookmark, BookmarkCheck,
  Clock
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { useJobStore, Job } from '../lib/jobStore';
import { format } from 'date-fns';

interface JobCategory {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

interface JobApplication {
  name: string;
  resume: File | null;
  aboutYou: string;
  experience: string;
  worksDone: string;
}

const experienceOptions = [
  'Fresher',
  '1 year',
  '2 years',
  '3 years',
  '4 years',
  '5 years',
  '6 years',
  'More than 6 years'
];

const initialCategories: JobCategory[] = [
  {
    id: 'technical',
    name: 'Technical Writer',
    description: 'Create documentation, user guides, and technical specifications',
    selected: false
  },
  {
    id: 'script',
    name: 'Script Writer',
    description: 'Write scripts for films, TV shows, and video content',
    selected: false
  },
  {
    id: 'blog',
    name: 'Blog Writer',
    description: 'Create engaging blog content across various topics',
    selected: false
  },
  {
    id: 'story',
    name: 'Story Writer',
    description: 'Write creative stories, novels, and narrative content',
    selected: false
  },
  {
    id: 'song',
    name: 'Song Writer',
    description: 'Compose lyrics and songs for various genres',
    selected: false
  },
  {
    id: 'content',
    name: 'Content Writer',
    description: 'Create various types of digital and marketing content',
    selected: false
  },
  {
    id: 'copywriter',
    name: 'Copywriter',
    description: 'Write compelling copy for advertising and marketing',
    selected: false
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Edit and refine written content across all categories',
    selected: false
  }
];

export function JobsPage() {
  const { user } = useAuth();
  const { addJob, deleteJob, getJobs, toggleBookmark, isBookmarked, applyForJob, hasApplied } = useJobStore();
  const [categories, setCategories] = useState<JobCategory[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState<JobApplication>({
    name: '',
    resume: null,
    aboutYou: '',
    experience: '',
    worksDone: ''
  });
  const [applicationError, setApplicationError] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    description: '',
    salary: '',
    location: '',
    type: ''
  });

  const handleCategoryToggle = (categoryId: string) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === categoryId
          ? { ...category, selected: !category.selected }
          : category
      )
    );
  };

  const handleRefresh = () => {
    setCategories(initialCategories);
    setSelectedCategory('');
    setSearchTerm('');
    setNewJob({
      title: '',
      description: '',
      salary: '',
      location: '',
      type: ''
    });
  };

  const handleSubmit = () => {
    const selectedCategories = categories.filter(cat => cat.selected);
    console.log('Selected categories:', selectedCategories);
  };

  const handlePostJob = () => {
    if (!newJob.title || !newJob.description || !newJob.salary || !newJob.location || !newJob.type) {
      alert('Please fill in all fields');
      return;
    }

    const job: Job = {
      id: Date.now().toString(),
      title: newJob.title,
      description: newJob.description,
      salary: newJob.salary,
      location: newJob.location,
      type: newJob.type,
      postedAt: new Date().toISOString()
    };

    setJobs(prevJobs => [job, ...prevJobs]);
    setIsPostingJob(false);
    setNewJob({
      title: '',
      description: '',
      salary: '',
      location: '',
      type: ''
    });
  };

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(null);
      }
    }
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationError('');
    setApplicationSuccess(false);

    if (!applicationData.name || !applicationData.resume || !applicationData.aboutYou || !applicationData.experience) {
      setApplicationError('Please fill in all required fields');
      return;
    }

    if (!selectedJob || !user) {
      setApplicationError('Something went wrong. Please try again.');
      return;
    }

    try {
      // Convert File to base64 string for storage
      const reader = new FileReader();
      reader.readAsDataURL(applicationData.resume);
      
      reader.onload = () => {
        const resumeBase64 = reader.result as string;
        
        // Submit application
        applyForJob({
          jobId: selectedJob.id,
          userId: user.uid,
          name: applicationData.name,
          resume: resumeBase64,
          aboutYou: applicationData.aboutYou,
          experience: applicationData.experience,
          worksDone: applicationData.worksDone
        });

        // Show success message
        setApplicationSuccess(true);

        // Reset form after a delay
        setTimeout(() => {
          setApplicationData({
            name: '',
            resume: null,
            aboutYou: '',
            experience: '',
            worksDone: ''
          });
          setShowApplicationForm(false);
          setApplicationSuccess(false);
        }, 2000);
      };
    } catch (error) {
      console.error('Error submitting application:', error);
      setApplicationError('Failed to submit application. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setApplicationError('File size should not exceed 5MB');
        return;
      }
      setApplicationData(prev => ({ ...prev, resume: file }));
      setApplicationError('');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBookmarkToggle = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (user) {
      toggleBookmark(jobId, user.uid);
    } else {
      alert('Please sign in to bookmark jobs');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Writing Jobs</h1>
        <div className="flex gap-4">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <RefreshCcw className="h-5 w-5" />
            Refresh
          </button>
          <button
            onClick={() => setIsPostingJob(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Post Job
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="relative min-w-[200px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        </div>
      </div>

      {/* Posted Jobs Section */}
      {jobs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Posted Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => (
              <div 
                key={job.id} 
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg relative group cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleJobClick(job)}
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => handleBookmarkToggle(e, job.id)}
                    className={`p-2 rounded-full transition-colors ${
                      user && isBookmarked(job.id, user.uid)
                        ? 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'
                        : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                    }`}
                    title={user && isBookmarked(job.id, user.uid) ? 'Remove bookmark' : 'Bookmark job'}
                  >
                    {user && isBookmarked(job.id, user.uid) ? (
                      <BookmarkCheck className="h-5 w-5" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job.id);
                      }}
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete job"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                    {job.type}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{job.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <DollarSign className="h-5 w-5 mr-2" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <MapPin className="h-5 w-5 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          Apply Filters
        </button>
      </div>

      {/* Job Posting Modal */}
      {isPostingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post a New Job</h2>
              <button
                onClick={() => setIsPostingJob(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter job title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Type
                </label>
                <select
                  value={newJob.type}
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select job type</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter job description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary
                </label>
                <input
                  type="text"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter salary range"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter job location"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsPostingJob(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostJob}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Post Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedJob.title}</h2>
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                    {selectedJob.type}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Posted on {formatDate(selectedJob.postedAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                  <DollarSign className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                  <span className="font-medium">Salary</span>
                </div>
                <p className="text-gray-900 dark:text-white">{selectedJob.salary}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                  <MapPin className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="text-gray-900 dark:text-white">{selectedJob.location}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
                  <Briefcase className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                  <span className="font-medium">Job Type</span>
                </div>
                <p className="text-gray-900 dark:text-white">{selectedJob.type}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Job Description</h3>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Requirements</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Bachelor's degree in English, Journalism, Communications, or related field</li>
                <li>Minimum 2 years of experience in content writing or related role</li>
                <li>Excellent writing and editing skills</li>
                <li>Strong understanding of SEO principles</li>
                <li>Ability to work independently and meet deadlines</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Benefits</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Competitive salary and benefits package</li>
                <li>Flexible working hours</li>
                <li>Remote work options</li>
                <li>Professional development opportunities</li>
                <li>Collaborative and supportive team environment</li>
              </ul>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              {user && hasApplied(selectedJob.id, user.uid) ? (
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                  <Check className="h-5 w-5" />
                  Already Applied
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowApplicationForm(true);
                    setSelectedJob(null);
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Application</h2>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {applicationError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {applicationError}
              </div>
            )}

            {applicationSuccess && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center gap-2">
                <Check className="h-5 w-5" />
                Application submitted successfully! Redirecting...
              </div>
            )}

            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={applicationData.name}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resume/CV *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="resume-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="resume-upload"
                          name="resume-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOC up to 5MB
                    </p>
                    {applicationData.resume && (
                      <p className="text-sm text-primary-600 dark:text-primary-400">
                        Selected: {applicationData.resume.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* About You */}
               ```tsx
              {/* About You */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  About You *
                </label>
                <textarea
                  value={applicationData.aboutYou}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, aboutYou: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell us about yourself and why you're interested in this position"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience Level *
                </label>
                <select
                  value={applicationData.experience}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select experience level</option>
                  {experienceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Works Done */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Previous Work Examples
                </label>
                <textarea
                  value={applicationData.worksDone}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, worksDone: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Share links or descriptions of your previous work (optional)"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}