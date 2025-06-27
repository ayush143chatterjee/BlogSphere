import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, TrendingUp, Clock, Share2, X, ChevronLeft, ChevronRight,
  PenSquare, Briefcase, BookMarked, Award, Star, Edit, Book, Brain,
  Target, Scissors, FileEdit, Coffee, Lightbulb, Users, MessageSquare, Eye
} from 'lucide-react';
import { format } from 'date-fns';

const CAROUSEL_ITEMS = [
  {
    title: "Start Writing Today",
    description: "Join our community of writers and share your stories with the world",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&auto=format&fit=crop",
    buttonText: "Start Writing",
    link: "/write",
    gradient: "from-blue-600 to-purple-600"
  },
  {
    title: "Find Writing Jobs",
    description: "Discover opportunities for writers across various industries",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&auto=format&fit=crop",
    buttonText: "Browse Jobs",
    link: "/jobs",
    gradient: "from-green-600 to-teal-600"
  },
  {
    title: "Read Latest Articles",
    description: "Explore trending articles from our talented writers",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1600&auto=format&fit=crop",
    buttonText: "Read Articles",
    link: "/articles",
    gradient: "from-orange-600 to-pink-600"
  }
];

const FEATURED_WRITERS = [
  {
    name: "Sarah Johnson",
    role: "Technical Writer",
    articles: 156,
    followers: "12.5K",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop",
    expertise: ["Technology", "Programming", "AI"]
  },
  {
    name: "Michael Chen",
    role: "Creative Writer",
    articles: 89,
    followers: "8.2K",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop",
    expertise: ["Fiction", "Poetry", "Creative Writing"]
  },
  {
    name: "Emily Rodriguez",
    role: "Content Strategist",
    articles: 234,
    followers: "15.7K",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop",
    expertise: ["Marketing", "SEO", "Content Strategy"]
  },
  {
    name: "David Kim",
    role: "Journalist",
    articles: 178,
    followers: "10.3K",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop",
    expertise: ["News", "Politics", "Current Events"]
  }
];

const BLOGGING_TIPS = [
  {
    title: "Hook Your Readers Early",
    description: "Start with a compelling hook—an intriguing question, a bold statement, or a vivid scene—to grab your readers' attention from the first line.",
    icon: Target,
    color: "text-blue-500"
  },
  {
    title: "Show, Don't Tell",
    description: "Instead of stating emotions, describe actions, body language, and sensory details to immerse your readers in the story.",
    icon: Eye,
    color: "text-purple-500"
  },
  {
    title: "Keep Sentences Clear & Concise",
    description: "Avoid unnecessary words and overly complex sentences. A simple, well-structured sentence is more impactful than a long, cluttered one.",
    icon: Edit,
    color: "text-green-500"
  },
  {
    title: "Use Strong Verbs & Active Voice",
    description: "Instead of saying, 'The book was read by her,' write 'She read the book.' This makes your writing more engaging and direct.",
    icon: FileEdit,
    color: "text-yellow-500"
  },
  {
    title: "Edit Ruthlessly",
    description: "Your first draft is just the beginning. Cut out fluff, improve clarity, and refine your ideas with each revision.",
    icon: Scissors,
    color: "text-red-500"
  },
  {
    title: "Read More, Write More",
    description: "Reading improves your vocabulary, style, and creativity, while writing consistently helps you refine your skills.",
    icon: Book,
    color: "text-indigo-500"
  },
  {
    title: "Break Writer's Block",
    description: "If you're stuck, try freewriting or using creative prompts to spark new ideas and get words flowing.",
    icon: Brain,
    color: "text-pink-500"
  },
  {
    title: "Research Before You Write",
    description: "A well-researched piece adds credibility to your work. Whether it's fiction or non-fiction, accuracy enhances storytelling.",
    icon: MessageSquare,
    color: "text-cyan-500"
  },
  {
    title: "Maintain a Writing Routine",
    description: "Set a daily or weekly writing schedule to build consistency and improve productivity over time.",
    icon: Coffee,
    color: "text-amber-500"
  },
  {
    title: "Write for Your Audience",
    description: "Understand your readers' needs and interests to craft content that resonates and keeps them engaged.",
    icon: Users,
    color: "text-teal-500"
  }
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop';

export function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
  };

  const trendingTopics = [
    { name: 'Technology', count: 1234 },
    { name: 'Writing Tips', count: 856 },
    { name: 'Personal Growth', count: 743 },
    { name: 'Career Advice', count: 652 }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Carousel Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {CAROUSEL_ITEMS.map((item, index) => (
            <div key={index} className="relative w-full h-full flex-shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-80`} />
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <div className="max-w-3xl space-y-6">
                  <h1 className="text-5xl md:text-7xl font-bold text-white">
                    {item.title}
                  </h1>
                  <p className="text-xl text-gray-100">
                    {item.description}
                  </p>
                  <button 
                    onClick={() => navigate(item.link)}
                    className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg"
                  >
                    {item.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {CAROUSEL_ITEMS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Writing Tips Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Expert Writing Tips
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master the art of writing with these proven tips and techniques from experienced writers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {BLOGGING_TIPS.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${tip.color} bg-opacity-10`}>
                      <IconComponent className={`h-6 w-6 ${tip.color}`} />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Tip #{index + 1}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {tip.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => navigate('/write')}
                      className="w-full bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <PenSquare className="h-4 w-4" />
                      Try This Tip
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trending Topics */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Trending Topics
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingTopics.map(topic => (
              <div
                key={topic.name}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {topic.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {topic.count} articles
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
