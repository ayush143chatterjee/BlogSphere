import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { useBlogStore } from '../lib/blogStore';
import { useJobStore } from '../lib/jobStore';
import { 
  PenSquare, BookOpen, Bookmark, Trash2, Edit, Eye, 
  Calendar, ThumbsUp, MessageSquare, Share2, User,
  Mail, MapPin, Link as LinkIcon, Settings, Home,
  Briefcase, DollarSign, FileText, Clock
} from 'lucide-react';
import { format } from 'date-fns';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserBlogs, getBookmarkedBlogs, deleteBlog, toggleBookmark: toggleBlogBookmark, isBookmarked: isBlogBookmarked } = useBlogStore();
  const { getBookmarkedJobs, toggleBookmark: toggleJobBookmark, getAppliedJobs } = useJobStore();
  const [activeTab, setActiveTab] = useState('blogs');

  if (!user) {
    return null;
  }

  const userBlogs = getUserBlogs(user.uid);
  const bookmarkedBlogs = getBookmarkedBlogs(user.uid);
  const bookmarkedJobs = getBookmarkedJobs(user.uid);
  const appliedJobs = getAppliedJobs(user.uid);

  const handleDelete = (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(blogId);
    }
  };

  const handleBlogBookmark = (blogId: string) => {
    toggleBlogBookmark(blogId, user.uid);
  };

  const handleJobBookmark = (jobId: string) => {
    toggleJobBookmark(jobId, user.uid);
  };

  const tabs = [
    { id: 'blogs', label: 'My Blogs', icon: PenSquare },
    { id: 'bookmarks', label: 'Bookmarked Blogs', icon: Bookmark },
    { id: 'jobs', label: 'Bookmarked Jobs', icon: Briefcase },
    { id: 'applications', label: 'Job Applications', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your blog posts and bookmarks
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Sidebar - Now positioned first on mobile */}
          <div className="lg:w-80 order-1 lg:order-2">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                {/* Cover Image */}
                <div className="h-24 bg-gradient-to-r from-primary-600 to-primary-400"></div>
                
                {/* Profile Info */}
                <div className="px-6 pb-6">
                  {/* Avatar - Positioned to overlap the cover image */}
                  <div className="relative -mt-12 mb-4 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1 ring-4 ring-white dark:ring-gray-800">
                      <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {user.displayName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 dark:border-gray-700 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {userBlogs.length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {bookmarkedBlogs.length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {userBlogs.reduce((sum, blog) => sum + blog.views, 0)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phoneNumber && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{user.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <LinkIcon className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="truncate">{window.location.origin}/profile/{user.uid}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => navigate('/write')}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <PenSquare className="h-4 w-4 mr-2" />
                      Write New Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`
                      flex items-center py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="space-y-6">
              {activeTab === 'blogs' && (
                <div className="grid gap-6">
                  {userBlogs.length > 0 ? (
                    userBlogs.map(blog => (
                      <article
                        key={blog.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {blog.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                              {blog.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {format(new Date(blog.date), 'MMM d, yyyy')}
                              </span>
                              <span className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {blog.views} views
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {blog.likes} likes
                              </span>
                              <span className="flex items-center">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {blog.comments.length} comments
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBlogBookmark(blog.id)}
                              className={`p-2 ${
                                isBlogBookmarked(blog.id, user.uid)
                                  ? 'text-primary-600 dark:text-primary-400'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                              }`}
                              title={isBlogBookmarked(blog.id, user.uid) ? 'Remove bookmark' : 'Bookmark'}
                            >
                              <Bookmark className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => navigate(`/edit/${blog.id}`)}
                              className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.origin + '/blog/' + blog.id);
                                alert('Link copied to clipboard!');
                              }}
                              className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                              title="Share"
                            >
                              <Share2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No blogs yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Start writing your first blog post today!
                      </p>
                      <button
                        onClick={() => navigate('/write')}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <PenSquare className="h-5 w-5 mr-2" />
                        Write New Blog
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookmarks' && (
                <div className="grid gap-6">
                  {bookmarkedBlogs.length > 0 ? (
                    bookmarkedBlogs.map(blog => (
                      <article
                        key={blog.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {blog.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                              {blog.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {format(new Date(blog.date), 'MMM d, yyyy')}
                              </span>
                              <span>{blog.author}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBlogBookmark(blog.id)}
                              className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500"
                              title="Remove bookmark"
                            >
                              <Bookmark className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => navigate(`/blog/${blog.id}`)}
                              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 px-4 py-2"
                            >
                              Read more
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No bookmarks yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Browse articles and bookmark the ones you like!
                      </p>
                      <button
                        onClick={() => navigate('/articles')}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <BookOpen className="h-5 w-5 mr-2" />
                        Browse Articles
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="grid gap-6">
                  {bookmarkedJobs.length > 0 ? (
                    bookmarkedJobs.map(job => (
                      <article
                        key={job.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {job.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                              {job.description}
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {job.salary}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {job.location}
                              </span>
                              <span className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1" />
                                {job.type}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {format(new Date(job.postedAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleJobBookmark(job.id)}
                              className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500"
                              title="Remove bookmark"
                            >
                              <Bookmark className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No bookmarked jobs
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Browse jobs and bookmark the ones you're interested in!
                      </p>
                      <button
                        onClick={() => navigate('/jobs')}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Briefcase className="h-5 w-5 mr-2" />
                        Browse Jobs
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'applications' && (
                <div className="grid gap-6">
                  {appliedJobs.length > 0 ? (
                    appliedJobs.map(({ job, application }) => (
                      <article
                        key={application.jobId}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {job.title}
                              </h2>
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Applied on {format(new Date(application.appliedAt), 'MMM d, yyyy')}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {job.location}
                                </span>
                                <span className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  {job.salary}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                              Application Details
                            </h3>
                            <div className="grid gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Experience
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                  {application.experience}
                                </p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                  About You
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                  {application.aboutYou}
                                </p>
                              </div>
                              {application.worksDone && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Previous Work
                                  </label>
                                  <p className="text-gray-900 dark:text-white">
                                    {application.worksDone}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No job applications yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Start applying for jobs to see your applications here!
                      </p>
                      <button
                        onClick={() => navigate('/jobs')}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Briefcase className="h-5 w-5 mr-2" />
                        Browse Jobs
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}