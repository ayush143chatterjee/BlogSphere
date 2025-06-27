import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
  Heading1, Heading2, Quote, Trash2, PaintBucket, Image as ImageIcon, Check, Lock
} from 'lucide-react';
import { useBlogStore } from '../lib/blogStore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

export function WritingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addBlog, publishBlog } = useBlogStore();

  // If user is not a writer, show restricted access message
  if (!user || user.role !== 'writer') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Lock className="h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Writer Access Only
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          This area is restricted to writers. To become a writer, please update your role in your profile settings.
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go to Profile Settings
        </button>
      </div>
    );
  }

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize editor content when component mounts
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const formatText = (command: string, value: string | null = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      setActiveTool(activeTool === command + value ? null : command + value);
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
    }
  };

  const toolbarItems = [
    { id: 'bold', command: 'bold', Icon: Bold }, 
    { id: 'italic', command: 'italic', Icon: Italic }, 
    { id: 'underline', command: 'underline', Icon: Underline }, 
    { id: 'list', command: 'insertUnorderedList', Icon: List }, 
    { id: 'h1', command: 'formatBlock', value: 'h1', Icon: Heading1 }, 
    { id: 'h2', command: 'formatBlock', value: 'h2', Icon: Heading2 }, 
    { id: 'quote', command: 'formatBlock', value: 'blockquote', Icon: Quote }, 
    { id: 'left', command: 'justifyLeft', Icon: AlignLeft }, 
    { id: 'center', command: 'justifyCenter', Icon: AlignCenter }, 
    { id: 'right', command: 'justifyRight', Icon: AlignRight }, 
    { id: 'color', command: 'foreColor', Icon: PaintBucket }
  ];

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please add a title and content to your blog post');
      return;
    }

    if (!user) {
      alert('You must be logged in to publish a blog post');
      return;
    }

    setIsPublishing(true);

    try {
      const blogId = addBlog({
        title,
        content,
        excerpt: content.replace(/<[^>]*>/g, '').substring(0, 120) + '...',
        image: image || undefined,
        author: user.displayName,
        authorId: user.uid
      });
      
      await publishBlog(blogId);
      setIsPublishing(false);
      setPublishSuccess(true);

      // Clear the form
      setTitle('');
      setContent('');
      setImage(null);
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error publishing blog:', error);
      setIsPublishing(false);
      alert('Failed to publish blog. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title Input */}
      <input
        type="text"
        placeholder="Enter your title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-4xl font-bold mb-4 p-2 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:border-primary-500 dark:text-white"
      />
      
      {/* Image Upload Section */}
      <div className="mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center relative">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden" 
          id="image-upload" 
        />
        <label 
          htmlFor="image-upload" 
          className="cursor-pointer flex flex-col items-center justify-center py-6"
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Click to upload a cover image
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Recommended: 1600x900px
          </span>
        </label>
        {image && (
          <div className="mt-4 relative">
            <img 
              src={image} 
              alt="Cover preview" 
              className="max-h-[400px] w-full object-cover rounded-lg"
            />
            <button 
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-2 overflow-x-auto sticky top-0 z-10 mb-4">
        {toolbarItems.map(({ id, command, value, Icon }) => (
          <button 
            key={id}
            onClick={() => formatText(command, value || null)} 
            title={command}
            type="button"
            className={`p-2 rounded ${
              activeTool === command + value 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
        <button 
          onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) formatText('createLink', url);
          }} 
          title="Insert Link"
          type="button"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <LinkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleEditorChange}
        className="min-h-[500px] p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100"
        placeholder="Start writing your story..."
        suppressContentEditableWarning={true}
      />

      {/* Success Message */}
      {publishSuccess && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <Check className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Blog Published Successfully!
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Redirecting to your dashboard...
          </p>
        </div>
      )}

      {/* Publish Button */}
      {!publishSuccess && (
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            type="button"
            className={`px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 ${
              isPublishing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isPublishing ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish'
            )}
          </button>
        </div>
      )}
    </div>
  );
}