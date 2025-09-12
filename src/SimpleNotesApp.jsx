import { useState, useRef, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { format, parseISO } from 'date-fns';
import { useAuth } from './AuthContext';
import { useNotes, useLinkPreview } from './hooks';
import SimpleAuthModal from './SimpleAuthModal';
import { 
  Pin, 
  Trash2, 
  Edit3, 
  Share2, 
  Clock, 
  Mic, 
  CheckSquare, 
  Plus,
  Search,
  Filter,
  History,
  X,
  Download,
  Upload,
  Copy,
  Eye,
  EyeOff,
  StopCircle,
  Palette,
  FileText,
  Archive,
  ArchiveRestore,
  Image,
  Link,
  Clipboard,
  MoreVertical,
  Check,
  Tag,
  Brush,
  Heart,
  Activity
} from 'lucide-react';

// Simple Drawing Canvas Component
const DrawingCanvas = ({ onDrawingChange }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      onDrawingChange(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onDrawingChange('');
  };

  return (
    <div className="border rounded-md p-2">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="border border-gray-300 rounded cursor-crosshair w-full max-w-md"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <button
        type="button"
        onClick={clearCanvas}
        className={`mt-2 px-3 py-1 rounded text-sm bg-gray-500 text-white hover:bg-gray-600 transition-all flex items-center gap-1`}
      >
        <X className="w-4 h-4" />
        Clear Canvas
      </button>
    </div>
  );
};

// URL Detection Utility
const extractUrls = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

// Link Preview Component
const LinkPreview = ({ url, getLinkPreview }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    
    const fetchPreview = async () => {
      if (isCancelled) return;
      
      try {
        setLoading(true);
        setError(false);
        
        // Add a small delay to prevent rapid API calls
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (isCancelled) return;
        
        const previewData = await getLinkPreview(url);
        if (isCancelled) return;
        
        if (previewData) {
          setPreview(previewData);
        } else {
          setError(true);
        }
        
      } catch (error) {
        if (!isCancelled) {
          console.error('Link preview error:', error);
          setError(true);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchPreview();
    
    return () => {
      isCancelled = true;
    };
  }, [url]); // Remove getLinkPreview from dependencies

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 animate-pulse w-full max-w-full">
        <div className="flex gap-3">
          <div className="w-16 h-16 bg-gray-300 rounded flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !preview) {
    return (
      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 w-full max-w-full">
        <div className="flex items-start gap-2 text-gray-500">
          <Link className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="text-sm break-all overflow-wrap-anywhere">{url}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow w-full max-w-full">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        {preview.image && (
          <img 
            src={preview.image} 
            alt={preview.title}
            className="w-full h-32 object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
        <div className="p-3">
          <h4 className="font-semibold text-sm text-gray-900 mb-1 break-words">
            {preview.title}
          </h4>
          <p className="text-xs text-gray-600 mb-2 break-words line-clamp-2">
            {preview.description}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Link className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{new URL(url).hostname}</span>
          </div>
        </div>
      </a>
    </div>
  );
};

// AI Mood Detection Function
const detectMoodFromText = (text) => {
  const content = text.toLowerCase();
  
  const moodPatterns = {
    happy: ['happy', 'amazing', 'wonderful', 'great', 'awesome', 'fantastic', 'love', 'thrilled', 'delighted', 'cheerful', '🥳', '✨', '🌈'],
    sad: ['sad', 'depressed', 'crying', 'tears', 'miserable', 'heartbroken', 'devastated', 'gloomy', '💔', '🥀', '😢'],
    angry: ['angry', 'furious', 'mad', 'rage', 'irritated', 'frustrated', 'annoyed', 'pissed', 'hate', '😡', '🤬'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'fear', 'scared', 'overwhelmed', '😰', '😨'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen', 'meditative', 'quiet', 'still', 'chill', '🧘', '🍃'],
    excited: ['excited', 'pumped', 'energetic', 'enthusiastic', 'hyped', 'thrilled', 'eager', 'passionate', '🎉', '⚡', '🔥'],
    grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'gratitude', 'fortunate', 'lucky', '🙏', '💝', '🌻'],
    confused: ['confused', 'lost', 'uncertain', 'unclear', 'puzzled', 'bewildered', 'perplexed', '🤔', '❓', '🤷'],
    tired: ['tired', 'exhausted', 'sleepy', 'weary', 'drained', 'fatigue', 'worn out', '😴', '🥱'],
    hopeful: ['hopeful', 'optimistic', 'confident', 'positive', 'encouraged', 'inspired', 'motivated', '🌅', '🌟', '✨'],
    neutral: ['okay', 'fine', 'normal', 'average', 'regular', 'standard', 'typical', '😐', '😑']
  };

  let bestMatch = { mood: 'neutral', confidence: 0.1 };
  
  for (const [mood, keywords] of Object.entries(moodPatterns)) {
    let matches = 0;
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        matches++;
      }
    }
    
    if (matches > 0) {
      const confidence = Math.min(0.9, (matches / keywords.length) * 2);
      if (confidence > bestMatch.confidence) {
        bestMatch = { mood, confidence };
      }
    }
  }

  return bestMatch;
};

// Helper function to get mood emoji
const getMoodEmoji = (mood) => {
  const emojis = {
    happy: '😊',
    sad: '😢', 
    angry: '😡',
    anxious: '😰',
    calm: '😌',
    excited: '🤩',
    grateful: '🙏',
    confused: '🤔',
    tired: '😴',
    hopeful: '🌟',
    neutral: '😐'
  };
  return emojis[mood] || '😐';
};

function SimpleNotesApp() {
  const { user, logout } = useAuth();
  const { 
    notes, 
    fetchNotes,
    createNote, 
    updateNote, 
    deleteNote: deleteNoteAPI, 
    uploadImage
  } = useNotes();
  const { getLinkPreview } = useLinkPreview();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentTheme, setCurrentTheme] = useState('lavenderDream');
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [labelText, setLabelText] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [editingNote, setEditingNote] = useState(null);
  const [enableMoodDetection, setEnableMoodDetection] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [_imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  
  // New feature states
  const [noteType, setNoteType] = useState('text'); // 'text', 'checklist', 'drawing'
  const [checklistItems, setChecklistItems] = useState([]);
  const [reminder, setReminder] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    mood: '',
    color: '',
    hasReminder: false,
    hasAudio: false,
    hasImage: false
  });
  const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'mood', 'modified'
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedNoteHistory, setSelectedNoteHistory] = useState(null);

  // Theme configurations - Fixed emoji corruptions
  const themes = {
    lavenderDream: {
      name: "Lavender Dream",
      emoji: "💜",
      background: "bg-white/25 backdrop-blur-md",
      border: "border-purple-200/60",
      headerText: "text-purple-900",
      subText: "text-purple-700",
      accentText: "text-purple-600",
      placeholderText: "placeholder-purple-500",
      brainEmoji: "🧠",
      decorative: ["💜", "🌸", "✨"],
      createBg: "bg-purple-50/95",
      createBorder: "border-purple-200/70",
      createText: "text-purple-900",
      createDecor: "💫",
      editBg: "bg-violet-50/95",
      editBorder: "border-violet-200/70",
      editText: "text-violet-900",
      editDecor: "🌺",
      buttonGradient: "from-purple-300 to-violet-400",
      buttonHover: "from-purple-400 to-violet-500",
      buttonText: "text-purple-900",
      buttonBorder: "border-purple-300",
      // Theme selector specific colors
      selectorGradient: "from-purple-400 to-violet-500",
      selectorBorder: "border-purple-400",
      selectorActiveGradient: "from-purple-500 to-violet-600",
      // Background theme - lavender dream colors
      appBackground: "bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100",
      floatingElements: [
        { emoji: "💜", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-70", delay: "" },
        { emoji: "🌸", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-80", delay: "delay-300" },
        { emoji: "✨", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-60", delay: "delay-1000" },
        { emoji: "💫", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-75", delay: "delay-2000" },
        { emoji: "🌺", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-65", delay: "delay-500" },
        { emoji: "🦋", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-70", delay: "delay-1500" },
        { emoji: "🌙", position: "top-1/4 right-1/4", size: "text-4xl", animation: "animate-bounce", opacity: "opacity-60", delay: "delay-800" },
        { emoji: "⭐", position: "bottom-1/3 left-1/3", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-75", delay: "delay-1200" },
        { emoji: "💎", position: "top-3/4 left-10", size: "text-3xl", animation: "animate-bounce", opacity: "opacity-65", delay: "delay-400" },
        { emoji: "🔮", position: "bottom-1/4 right-1/4", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-70", delay: "delay-1800" }
      ],
      overlayGradient: "from-purple-100/25 to-violet-100/30"
    },
    cottagecore: {
      name: "Cottage Core",
      emoji: "🌻",
      background: "bg-white/20 backdrop-blur-sm",
      border: "border-green-200/50",
      headerText: "text-green-900",
      subText: "text-green-700",
      accentText: "text-amber-600",
      placeholderText: "placeholder-green-500",
      brainEmoji: "🧠",
      decorative: ["🌻", "🌸"],
      createBg: "bg-amber-50",
      createBorder: "border-amber-200",
      createText: "text-amber-900",
      createDecor: "🌿",
      editBg: "bg-blue-50",
      editBorder: "border-blue-200",
      editText: "text-blue-800",
      editDecor: "✏️",
      buttonGradient: "from-amber-300 to-yellow-400",
      buttonHover: "from-amber-400 to-yellow-500",
      buttonText: "text-amber-900",
      buttonBorder: "border-amber-200",
      // Theme selector specific colors
      selectorGradient: "from-yellow-400 to-amber-500",
      selectorBorder: "border-amber-400",
      selectorActiveGradient: "from-yellow-500 to-amber-600",
      // Background theme
      appBackground: "bg-gradient-to-br from-amber-50 via-green-50 to-yellow-100",
      floatingElements: [
        { emoji: "🌻", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-40" },
        { emoji: "🌸", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-40" },
        { emoji: "🌿", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-40", delay: "delay-1000" },
        { emoji: "🍄", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-40", delay: "delay-2000" },
        { emoji: "🌾", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-40", delay: "delay-500" },
        { emoji: "🌼", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-40", delay: "delay-1500" }
      ],
      overlayGradient: "from-green-100/20 to-amber-100/20"
    },
    sakuraBlossom: {
      name: "Sakura Blossom",
      emoji: "🌸",
      background: "bg-white/20 backdrop-blur-sm",
      border: "border-pink-200/50",
      headerText: "text-pink-900",
      subText: "text-pink-700",
      accentText: "text-pink-600",
      placeholderText: "placeholder-pink-500",
      brainEmoji: "🦉",
      decorative: ["🌸", "🍃"],
      createBg: "bg-pink-50/90",
      createBorder: "border-pink-200/50",
      createText: "text-pink-800",
      createDecor: "🌺",
      editBg: "bg-purple-50/90",
      editBorder: "border-purple-200/50",
      editText: "text-purple-800",
      editDecor: "🌷",
      buttonGradient: "from-pink-300 to-rose-400",
      buttonHover: "from-pink-400 to-rose-500",
      buttonText: "text-pink-900",
      buttonBorder: "border-pink-200",
      // Theme selector specific colors
      selectorGradient: "from-pink-400 to-rose-500",
      selectorBorder: "border-pink-400",
      selectorActiveGradient: "from-pink-500 to-rose-600",
      // Background theme - soft pink colors
      appBackground: "bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100",
      floatingElements: [
        { emoji: "🌸", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-90" },
        { emoji: "🌺", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-95" },
        { emoji: "🦋", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-85", delay: "delay-1000" },
        { emoji: "🌷", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-90", delay: "delay-2000" },
        { emoji: "🍃", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-80", delay: "delay-500" },
        { emoji: "💐", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-85", delay: "delay-1500" }
      ],
      overlayGradient: "from-pink-100/20 to-rose-100/25"
    },
    oceanBreeze: {
      name: "Ocean Breeze",
      emoji: "🌊",
      background: "bg-white/20 backdrop-blur-sm",
      border: "border-blue-200/50",
      headerText: "text-blue-900",
      subText: "text-blue-700",
      accentText: "text-teal-600",
      placeholderText: "placeholder-blue-500",
      brainEmoji: "🐋",
      decorative: ["🌊", "🐚"],
      createBg: "bg-blue-50/90",
      createBorder: "border-blue-200/50",
      createText: "text-blue-800",
      createDecor: "🏖️",
      editBg: "bg-cyan-50/90",
      editBorder: "border-cyan-200/50",
      editText: "text-cyan-900",
      editDecor: "🌱",
      buttonGradient: "from-blue-300 to-teal-400",
      buttonHover: "from-blue-400 to-teal-500",
      buttonText: "text-blue-900",
      buttonBorder: "border-blue-200",
      // Theme selector specific colors
      selectorGradient: "from-blue-400 to-teal-500",
      selectorBorder: "border-blue-400",
      selectorActiveGradient: "from-blue-500 to-teal-600",
      // Background theme - ocean colors
      appBackground: "bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100",
      floatingElements: [
        { emoji: "🌊", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-90" },
        { emoji: "🐚", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-95" },
        { emoji: "🐋", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-85", delay: "delay-1000" },
        { emoji: "⛵", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-90", delay: "delay-2000" },
        { emoji: "🏖️", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-80", delay: "delay-500" },
        { emoji: "🌅", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-85", delay: "delay-1500" }
      ],
      overlayGradient: "from-blue-100/20 to-teal-100/25"
    },
    sunsetGlow: {
      name: "Sunset Glow",
      emoji: "🌅",
      background: "bg-white/20 backdrop-blur-sm",
      border: "border-orange-200/50",
      headerText: "text-orange-900",
      subText: "text-orange-700",
      accentText: "text-red-600",
      placeholderText: "placeholder-orange-500",
      brainEmoji: "🦅",
      decorative: ["🌅", "🏔️"],
      createBg: "bg-red-50/90",
      createBorder: "border-red-200/50",
      createText: "text-red-900",
      createDecor: "🌄",
      editBg: "bg-yellow-50/90",
      editBorder: "border-yellow-300/50",
      editText: "text-yellow-900",
      editDecor: "🌻",
      buttonGradient: "from-orange-300 to-red-400",
      buttonHover: "from-orange-400 to-red-500",
      buttonText: "text-orange-900",
      buttonBorder: "border-orange-200",
      // Theme selector specific colors
      selectorGradient: "from-orange-400 to-red-500",
      selectorBorder: "border-orange-400",
      selectorActiveGradient: "from-orange-500 to-red-600",
      // Background theme - sunset colors
      appBackground: "bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100",
      floatingElements: [
        { emoji: "🌅", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-90" },
        { emoji: "🏔️", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-95" },
        { emoji: "🦅", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-85", delay: "delay-1000" },
        { emoji: "🌄", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-90", delay: "delay-2000" },
        { emoji: "🌻", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-80", delay: "delay-500" },
        { emoji: "🍂", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-85", delay: "delay-1500" }
      ],
      overlayGradient: "from-orange-100/20 to-red-100/25"
    },
    forestGreen: {
      name: "Forest Green",
      emoji: "🌲",
      background: "bg-white/20 backdrop-blur-sm",
      border: "border-green-300/50",
      headerText: "text-green-900",
      subText: "text-green-700",
      accentText: "text-emerald-600",
      placeholderText: "placeholder-green-500",
      brainEmoji: "🦌",
      decorative: ["🌲", "🍃"],
      createBg: "bg-emerald-50/90",
      createBorder: "border-emerald-300/50",
      createText: "text-emerald-900",
      createDecor: "🌿",
      editBg: "bg-lime-50/90",
      editBorder: "border-lime-300/50",
      editText: "text-lime-900",
      editDecor: "�",
      buttonGradient: "from-green-400 to-emerald-500",
      buttonHover: "from-green-500 to-emerald-600",
      buttonText: "text-green-900",
      buttonBorder: "border-green-300",
      // Theme selector specific colors
      selectorGradient: "from-green-400 to-emerald-500",
      selectorBorder: "border-green-400",
      selectorActiveGradient: "from-green-500 to-emerald-600",
      // Background theme - forest colors
      appBackground: "bg-gradient-to-br from-green-100 via-emerald-50 to-lime-100",
      floatingElements: [
        { emoji: "🌲", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-70" },
        { emoji: "🍃", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-75" },
        { emoji: "🦌", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-70", delay: "delay-1000" },
        { emoji: "🌿", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-75", delay: "delay-2000" },
        { emoji: "🌱", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-70", delay: "delay-500" },
        { emoji: "🦋", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-75", delay: "delay-1500" }
      ],
      overlayGradient: "from-green-100/20 to-emerald-100/25"
    },
    darkAcademia: {
      name: "Dark Academia",
      emoji: "🕯️",
      background: "bg-black/30 backdrop-blur-sm",
      border: "border-amber-600/50",
      headerText: "text-amber-100",
      subText: "text-amber-200",
      accentText: "text-amber-300",
      placeholderText: "placeholder-amber-400",
      brainEmoji: "🦉",
      decorative: ["📚", "🕯️"],
      createBg: "bg-amber-900",
      createBorder: "border-amber-500",
      createText: "text-amber-100",
      createDecor: "✒️",
      editBg: "bg-stone-800",
      editBorder: "border-stone-500",
      editText: "text-stone-100",
      editDecor: "📖",
      buttonGradient: "from-amber-700 to-stone-800",
      buttonHover: "from-amber-600 to-stone-700",
      buttonText: "text-amber-100",
      buttonBorder: "border-amber-600",
      // Theme selector specific colors
      selectorGradient: "from-amber-600 to-stone-700",
      selectorBorder: "border-amber-600",
      selectorActiveGradient: "from-amber-700 to-stone-800",
      // Background theme - darker academic colors for true dark academia feel
      appBackground: "bg-gradient-to-br from-stone-950 via-amber-950 to-stone-900",
      floatingElements: [
        { emoji: "📚", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-90" },
        { emoji: "🕯️", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-95" },
        { emoji: "🏛️", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-85", delay: "delay-1000" },
        { emoji: "🦉", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-90", delay: "delay-2000" },
        { emoji: "✒️", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-80", delay: "delay-500" },
        { emoji: "📜", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-85", delay: "delay-1500" }
      ],
      overlayGradient: "from-stone-950/40 to-amber-950/30"
    },
    midnight: {
      name: "Midnight",
      emoji: "🌙",
      background: "bg-black/30 backdrop-blur-sm",
      border: "border-slate-600/50",
      headerText: "text-slate-100",
      subText: "text-slate-200",
      accentText: "text-slate-300",
      placeholderText: "placeholder-slate-400",
      brainEmoji: "🌙",
      decorative: ["🌙", "⭐"],
      createBg: "bg-slate-700",
      createBorder: "border-slate-500",
      createText: "text-slate-100",
      createDecor: "✨",
      editBg: "bg-indigo-900",
      editBorder: "border-indigo-700",
      editText: "text-indigo-100",
      editDecor: "�",
      buttonGradient: "from-slate-600 to-slate-700",
      buttonHover: "from-slate-500 to-slate-600",
      buttonText: "text-slate-100",
      buttonBorder: "border-slate-500",
      // Theme selector specific colors
      selectorGradient: "from-slate-500 to-gray-600",
      selectorBorder: "border-slate-500",
      selectorActiveGradient: "from-slate-600 to-gray-700",
      // Background theme - dark midnight colors
      appBackground: "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800",
      floatingElements: [
        { emoji: "🌙", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-80" },
        { emoji: "⭐", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-85" },
        { emoji: "🌌", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-75", delay: "delay-1000" },
        { emoji: "🌟", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-80", delay: "delay-2000" },
        { emoji: "✨", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-70", delay: "delay-500" },
        { emoji: "💫", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-75", delay: "delay-1500" }
      ],
      overlayGradient: "from-slate-900/20 to-gray-900/30"
    }
  };

  const theme = themes[currentTheme];

  // Fetch notes when user is authenticated
  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching notes...');
      fetchNotes();
    }
  }, [user, fetchNotes]);

  // Reminder functions
  const scheduleReminder = useCallback((noteId, reminderDate) => {
    const now = new Date();
    const reminderTime = new Date(reminderDate);
    
    if (reminderTime > now) {
      const timeout = reminderTime.getTime() - now.getTime();
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          const note = notes.find(n => n.id === noteId);
          new Notification('Note Reminder', {
            body: `Reminder: ${note?.title || 'Untitled Note'}`,
            icon: '/favicon.ico'
          });
        }
      }, timeout);
    }
  }, [notes]);

  // Schedule reminders for existing notes
  useEffect(() => {
    if (notes && notes.length > 0) {
      notes.forEach(note => {
        if (note.reminder_time) {
          scheduleReminder(note.id, note.reminder_time);
        }
      });
    }
  }, [notes, scheduleReminder]);

  // Show auth modal if not logged in
  if (!user) {
    return <SimpleAuthModal />;
  }

  // Modified setNotes to work with API  
  const setNotes = (_newNotes) => {
    // Drag and drop is temporarily disabled when using API
    // Will implement server-side reordering in future updates
  };

  // Color options for notes
  const colorOptions = [
    { name: 'Default', class: `${theme.background} ${theme.border}`, value: '' },
    { name: 'Yellow', class: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300', value: 'yellow' },
    { name: 'Green', class: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300', value: 'green' },
    { name: 'Blue', class: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300', value: 'blue' },
    { name: 'Pink', class: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300', value: 'pink' },
    { name: 'Purple', class: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300', value: 'purple' },
    { name: 'Orange', class: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300', value: 'orange' },
    { name: 'Red', class: 'bg-gradient-to-br from-red-50 to-red-100 border-red-300', value: 'red' },
    { name: 'Teal', class: 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-300', value: 'teal' },
    { name: 'Amber', class: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300', value: 'amber' },
    { name: 'Emerald', class: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300', value: 'emerald' },
    { name: 'Cyan', class: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300', value: 'cyan' }
  ];

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file');
      }
    }
  };

  // Checklist management functions
  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, { id: Date.now(), text: '', completed: false }]);
  };

  const updateChecklistItem = (id, text) => {
    setChecklistItems(checklistItems.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  };

  const toggleChecklistItem = (id) => {
    setChecklistItems(checklistItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeChecklistItem = (id) => {
    setChecklistItems(checklistItems.filter(item => item.id !== id));
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      }, 60000); // Max 60 seconds
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };



  const _requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  // Drag and drop handler
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNotes(items);
  };

  // Share note function
  const shareNote = async (note) => {
    const shareData = {
      title: `Note: ${note.title}`,
      text: `${note.title}\n\n${note.content || 'Checklist note'}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        const shareText = `${note.title}\n\n${note.content || 'Checklist note'}\n\nShared from AI Notes App`;
        await navigator.clipboard.writeText(shareText);
        alert('Note copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Advanced search and filter
  const getFilteredAndSortedNotes = () => {
    let filtered = notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.labels.some(label => label.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesMood = !searchFilters.mood || note.detected_mood === searchFilters.mood;
      const matchesColor = !searchFilters.color || note.color === searchFilters.color;
      const matchesReminder = !searchFilters.hasReminder || note.reminder_time;
      const matchesAudio = !searchFilters.hasAudio || note.audioUrl;
      const matchesImage = !searchFilters.hasImage || note.image_url;
      const matchesArchived = showArchived ? note.is_archived : !note.is_archived;

      return matchesSearch && matchesMood && matchesColor && matchesReminder && 
             matchesAudio && matchesImage && matchesArchived;
    });

    // Sort notes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'mood':
          return (a.mood || '').localeCompare(b.mood || '');
        case 'modified':
          return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
        default: // 'date'
          return new Date(b.date) - new Date(a.date);
      }
    });

    // Separate pinned notes
    const pinned = filtered.filter(note => note.is_pinned);
    const unpinned = filtered.filter(note => !note.is_pinned);
    
    return [...pinned, ...unpinned];
  };

  // Add/Edit note
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() || content.trim()) {
      let mood = null;
      let confidence = 0;
      
      if (enableMoodDetection && content.trim()) {
        const moodResult = detectMoodFromText(content);
        mood = moodResult.mood;
        confidence = moodResult.confidence;
      }

      const noteData = {
        title: title.trim() || 'Untitled',
        content: noteType === 'drawing' ? '' : content.trim(),
        drawing_data: noteType === 'drawing' ? content.trim() : null,
        detected_mood: mood,
        mood_confidence: confidence,
        is_pinned: false,
        is_archived: false,
        color: selectedColor,
        labels: [...selectedLabels],
        image_url: imagePreview,
        link_url: linkUrl.trim(),
        link_text: linkText.trim() || linkUrl.trim(),
        note_type: noteType,
        checklist_items: noteType === 'checklist' ? [...checklistItems] : [],
        reminder_time: reminder || null,
        audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null,
        version: 1,
        history: []
      };

      try {
        if (editingNote) {
          await updateNote(editingNote.id, noteData);
          setEditingNote(null);
          setShowCreateForm(false);
        } else {
          const newNote = await createNote(noteData);
          
          // Schedule reminder if set
          if (reminder) {
            scheduleReminder(newNote.id, reminder);
          }
          
          setShowCreateForm(false);
        }
      } catch (error) {
        console.error('Error saving note:', error);
      }
      
      setTitle('');
      setContent('');
      setSelectedColor('');
      setSelectedLabels([]);
      setImageFile(null);
      setImagePreview('');
      setLinkUrl('');
      setLinkText('');
      // Reset new feature fields
      setNoteType('text');
      setChecklistItems([]);
      setReminder('');
      setAudioBlob(null);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowCreateForm(true);
    setTitle(note.title);
    // Load content based on note type
    if (note.note_type === 'drawing') {
      setContent(note.drawing_data || '');
    } else {
      setContent(note.content || '');
    }
    setSelectedColor(note.color || '');
    setSelectedLabels(note.labels || []);
    setEnableMoodDetection(note.detected_mood ? true : false);
    setImagePreview(note.image_url || '');
    setLinkUrl(note.link_url || '');
    setLinkText(note.link_text || '');
    setChecklistItems(note.checklist_items || []);
    setNoteType(note.note_type || 'text');
    setReminder(note.reminder_time || '');
  };

  const _cancelEdit = () => {
    setEditingNote(null);
    setShowCreateForm(false);
    setTitle('');
    setContent('');
    setSelectedColor('');
    setSelectedLabels([]);
    setImageFile(null);
    setChecklistItems([]);
    setNoteType('text');
    setImagePreview('');
    setLinkUrl('');
    setLinkText('');
  };

  const deleteNote = async (id) => {
    try {
      await deleteNoteAPI(id);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const togglePin = async (id) => {
    try {
      const note = notes.find(n => n.id === id);
      if (note) {
        await updateNote(id, { is_pinned: !note.is_pinned });
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const toggleArchive = async (id) => {
    try {
      const note = notes.find(n => n.id === id);
      if (note) {
        await updateNote(id, { is_archived: !note.is_archived });
      }
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  const updateNoteColor = async (id, color) => {
    try {
      await updateNote(id, { color });
    } catch (error) {
      console.error('Error updating note color:', error);
    }
  };

  // Add label functionality
  const addLabel = () => {
    if (labelText.trim() && !selectedLabels.includes(labelText.trim())) {
      setSelectedLabels([...selectedLabels, labelText.trim()]);
      setLabelText('');
    }
  };

  const removeLabel = (labelToRemove) => {
    setSelectedLabels(selectedLabels.filter(label => label !== labelToRemove));
  };

  const addLink = () => {
    if (linkUrl.trim()) {
      const linkMarkdown = `[${linkText.trim() || linkUrl.trim()}](${linkUrl.trim()})`;
      setContent(prev => prev + (prev ? '\n' : '') + linkMarkdown);
      setLinkUrl('');
      setLinkText('');
    }
  };





  const _getColorClass = (color) => {
    // Enhanced color mapping with solid, vibrant backgrounds
    const colorMap = {
      yellow: 'bg-yellow-200 border-yellow-400 text-yellow-900',
      green: 'bg-green-200 border-green-400 text-green-900', 
      blue: 'bg-blue-200 border-blue-400 text-blue-900',
      pink: 'bg-pink-200 border-pink-400 text-pink-900',
      purple: 'bg-purple-200 border-purple-400 text-purple-900',
      orange: 'bg-orange-200 border-orange-400 text-orange-900',
      red: 'bg-red-200 border-red-400 text-red-900',
      teal: 'bg-teal-200 border-teal-400 text-teal-900',
      gray: 'bg-gray-200 border-gray-400 text-gray-900',
      indigo: 'bg-indigo-200 border-indigo-400 text-indigo-900',
      rose: 'bg-rose-200 border-rose-400 text-rose-900',
      amber: 'bg-amber-200 border-amber-400 text-amber-900',
      emerald: 'bg-emerald-200 border-emerald-400 text-emerald-900',
      cyan: 'bg-cyan-200 border-cyan-400 text-cyan-900',
      lime: 'bg-lime-200 border-lime-400 text-lime-900'
    };
    return colorMap[color] || 'bg-white border-gray-300 text-gray-900';
  };

  return (
    <div className={`min-h-screen ${theme.appBackground} p-4 relative overflow-hidden`}>
      {/* Floating decoration elements */}
      {theme.floatingElements.map((element, index) => (
        <div
          key={index}
          className={`fixed ${element.position} ${element.size} ${element.opacity} ${element.animation} pointer-events-none z-10 select-none ${element.delay || ''}`}
          style={{
            animationDelay: element.delay ? (element.delay.includes('delay-') ? `${element.delay.split('delay-')[1]}ms` : '1000ms') : '0s'
          }}
        >
          {element.emoji}
        </div>
      ))}
      
      {/* Modern Navigation Bar */}
      <nav className={`${theme.background} ${theme.border} border-b backdrop-blur-lg sticky top-0 z-30 mb-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Section */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${theme.buttonGradient} shadow-lg`}>
                <FileText className={`w-6 h-6 ${theme.buttonText}`} />
              </div>
              <div className="flex flex-col">
                <h1 className={`text-2xl font-bold ${theme.headerText} font-cedarville leading-tight`}>
                  My Notes
                </h1>
                <p className={`${theme.subText} text-xs hidden sm:block`}>
                  Choose the vibe, save the thought!
                </p>
              </div>
            </div>

            {/* Center Section - Mobile tagline */}
            <div className="flex-1 text-center sm:hidden">
              <p className={`${theme.subText} text-xs`}>
                Choose the vibe, save the thought!
              </p>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className={`hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl ${theme.background} ${theme.border} border shadow-sm`}>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.buttonGradient} flex items-center justify-center`}>
                  <span className={`text-sm font-semibold ${theme.buttonText}`}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${theme.headerText}`}>
                    {user?.username || 'User'}
                  </span>
                  <span className={`text-xs ${theme.subText}`}>
                    Welcome back!
                  </span>
                </div>
              </div>

              {/* Mobile User Initial */}
              <div className={`sm:hidden w-8 h-8 rounded-full bg-gradient-to-br ${theme.buttonGradient} flex items-center justify-center`}>
                <span className={`text-sm font-semibold ${theme.buttonText}`}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-md ${theme.buttonGradient} bg-gradient-to-r ${theme.buttonText} ${theme.buttonBorder} shadow-sm`}
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">👋</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto relative z-20">

        {/* Floating Theme Selector */}
        <div className="fixed top-20 right-4 z-40">
          <div className={`${theme.background} ${theme.border} border rounded-2xl p-3 backdrop-blur-lg shadow-xl transform transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center gap-2 mb-3">
              <Palette className={`w-4 h-4 ${theme.accentText}`} />
              <span className={`text-xs font-medium ${theme.headerText}`}>Themes</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-[120px]">
              {Object.entries(themes).map(([key, themeData]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`relative group flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                    currentTheme === key 
                      ? `bg-gradient-to-br ${themeData.selectorActiveGradient} border-white shadow-lg ring-2 ring-white/50 text-white` 
                      : `bg-gradient-to-br ${themeData.selectorGradient} ${themeData.selectorBorder} hover:shadow-md text-white/90 hover:text-white`
                  }`}
                  title={themeData.name}
                >
                  <div className={`text-lg transition-transform group-hover:scale-125 ${currentTheme === key ? 'animate-bounce' : ''}`}>
                    {themeData.emoji}
                  </div>
                  {currentTheme === key && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-2 h-2 text-gray-800" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 space-y-4">
          {/* Main Controls Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search notes, labels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 px-4 py-3 border rounded-xl ${theme.background} ${theme.border} ${theme.subText} ${theme.placeholderText} focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all`}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 hover:scale-105 ${
                  showArchived 
                    ? `${theme.buttonGradient} bg-gradient-to-r ${theme.buttonText} ${theme.buttonBorder} shadow-md` 
                    : `bg-white/50 ${theme.accentText} border-gray-300 hover:bg-gray-100 hover:shadow-md`
                }`}
              >
                {showArchived ? (
                  <>
                    <Clipboard className="w-4 h-4" />
                    All Notes
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    Archived
                  </>
                )}
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className={`px-4 py-3 rounded-xl border bg-white/50 ${theme.accentText} border-gray-300 hover:bg-gray-100 hover:shadow-md transition-all hover:scale-105`}
              >
                {viewMode === 'grid' ? '☰ List' : '⊞ Grid'}
              </button>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 hover:scale-105 ${
                  showCreateForm || editingNote
                    ? `${theme.buttonGradient} bg-gradient-to-r ${theme.buttonText} ${theme.buttonBorder} shadow-md` 
                    : `bg-white/50 ${theme.accentText} border-gray-300 hover:bg-gray-100 hover:shadow-md`
                }`}
              >
                {showCreateForm || editingNote ? (
                  <>
                    <X className="w-4 h-4" />
                    Close
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    New Note
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Google Keep Style Create Form */}
        {(showCreateForm || editingNote) && (
        <>
        <style>{`
          .themed-placeholder::placeholder {
            color: currentColor;
            opacity: 0.6;
          }
        `}</style>
        <form onSubmit={handleSubmit} className={`${theme.createBg} ${theme.createBorder} border rounded-lg p-4 mb-6 shadow-lg`}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className={`w-full px-0 py-2 text-lg font-medium border-0 outline-none ${theme.createBg} ${theme.createText} themed-placeholder`}
          />
          
          <textarea
            placeholder="Take a note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows="3"
            className={`w-full px-0 py-2 mt-2 border-0 outline-none resize-none ${theme.createBg} ${theme.createText} themed-placeholder`}
          />

          {/* Dynamic Content Based on Note Type */}
          {noteType === 'checklist' ? (
            <div className="mb-4">
              {checklistItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                    placeholder={`Item ${index + 1}...`}
                    className={`flex-1 px-0 py-1 border-0 outline-none ${theme.createBg} focus:${theme.background} rounded ${theme.createText} themed-placeholder`}
                  />
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addChecklistItem}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-600 p-1"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add item</span>
              </button>
            </div>
          ) : noteType === 'drawing' ? (
            <div className="mb-4">
              <DrawingCanvas 
                onDrawingChange={(drawingData) => setContent(drawingData)}
                theme={theme}
              />
            </div>
          ) : null}

          {/* Show active features */}
          {audioBlob && (
            <div className={`mb-3 p-2 ${theme.background} ${theme.border} border rounded-lg flex items-center gap-2`}>
              <Mic className={`w-4 h-4 ${theme.accentText}`} />
              <audio controls src={URL.createObjectURL(audioBlob)} className="flex-1 h-8" />
              <button
                type="button"
                onClick={() => setAudioBlob(null)}
                className={`${theme.subText} hover:text-red-500 p-1`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {imagePreview && (
            <div className="mb-3">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-full h-32 object-contain rounded border"
              />
            </div>
          )}
          
          {reminder && (
            <div className={`mb-3 p-2 ${theme.background} ${theme.border} border rounded-lg flex items-center gap-2`}>
              <Clock className={`w-4 h-4 ${theme.accentText}`} />
              <span className={`text-sm ${theme.subText}`}>
                {new Date(reminder).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setReminder('')}
                className={`${theme.subText} hover:text-red-500 p-1`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {(linkUrl || linkText) && (
            <div className={`mb-3 p-2 ${theme.background} ${theme.border} border rounded-lg flex items-center gap-2`}>
              <Link className={`w-4 h-4 ${theme.accentText}`} />
              <a href={linkUrl} target="_blank" rel="noopener noreferrer" className={`${theme.accentText} hover:underline text-sm`}>
                {linkText || linkUrl}
              </a>
            </div>
          )}
          
          {selectedLabels.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {selectedLabels.map((label) => (
                <span
                  key={label}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1"
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => removeLabel(label)}
                    className="text-blue-600 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Google Keep Style Icon Toolbar */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center gap-1">
              {/* Note Type Icons */}
              <button
                type="button"
                onClick={() => setNoteType(noteType === 'checklist' ? 'text' : 'checklist')}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${noteType === 'checklist' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                title="Toggle checklist"
              >
                <CheckSquare className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={() => setNoteType(noteType === 'drawing' ? 'text' : 'drawing')}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${noteType === 'drawing' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                title="Drawing"
              >
                <Brush className="w-5 h-5" />
              </button>
              
              {/* Voice Recording */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : audioBlob ? 'bg-green-100 text-green-600' : 'text-gray-500'}`}
                title={isRecording ? 'Stop recording' : 'Voice note'}
              >
                {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              {/* Image Upload */}
              <label className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 cursor-pointer" title="Add image">
                <Image className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
              
              {/* Reminder */}
              <div className="relative group">
                <button
                  type="button"
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${reminder ? 'bg-yellow-100 text-yellow-600' : 'text-gray-500'}`}
                  title="Set reminder"
                >
                  <Clock className="w-5 h-5" />
                </button>
                <div className={`absolute bottom-12 left-0 hidden group-hover:flex ${theme.createBg} border rounded-lg shadow-lg p-3 z-10 min-w-[200px]`}>
                  <div className="flex flex-col gap-2">
                    <label className={`text-xs ${theme.subText}`}>Set reminder:</label>
                    <input
                      type="datetime-local"
                      value={reminder}
                      onChange={(e) => setReminder(e.target.value)}
                      className={`p-2 rounded border ${theme.inputBg} ${theme.text} text-sm`}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    {reminder && (
                      <button
                        type="button"
                        onClick={() => setReminder('')}
                        className="text-xs text-red-500 hover:text-red-700 self-start"
                      >
                        Clear reminder
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Color Palette */}
              <div className="relative group">
                <button
                  type="button"
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${selectedColor !== 'white' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                  title="Background color"
                >
                  <Palette className="w-5 h-5" />
                </button>
                <div className={`absolute bottom-12 left-0 hidden group-hover:flex ${theme.createBg} border rounded-lg shadow-lg p-2 gap-1 z-10`}>
                  {colorOptions.slice(0, 8).map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-6 h-6 rounded-full border-2 ${color.class || 'bg-white'} hover:scale-110 transition-transform ${
                        selectedColor === color.value ? 'ring-2 ring-blue-400' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Mood Detection */}
              <button
                type="button"
                onClick={() => setEnableMoodDetection(!enableMoodDetection)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${enableMoodDetection ? 'bg-red-100 text-red-600' : 'text-gray-500'}`}
                title={enableMoodDetection ? 'Disable mood detection' : 'Enable mood detection'}
              >
                {enableMoodDetection ? (
                  <Heart className="w-5 h-5 fill-current" />
                ) : (
                  <Activity className="w-5 h-5" />
                )}
              </button>
              
              {/* Add Label */}
              <div className="relative group">
                <button
                  type="button"
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${selectedLabels.length > 0 ? 'bg-green-100 text-green-600' : 'text-gray-500'}`}
                  title="Add label"
                >
                  <Tag className="w-5 h-5" />
                </button>
                <div className={`absolute bottom-12 left-0 hidden group-hover:block ${theme.createBg} border rounded-lg shadow-lg py-2 z-10 min-w-48`}>
                  <div className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="Add label..."
                      value={labelText}
                      onChange={(e) => setLabelText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                      className={`w-full text-sm border rounded px-2 py-1 ${theme.createBg} ${theme.createText} themed-placeholder focus:outline-none focus:ring-1 focus:ring-blue-400`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Add Link */}
              <div className="relative group">
                <button
                  type="button"
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${linkUrl || linkText ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                  title="Add link"
                >
                  <Link className="w-5 h-5" />
                </button>
                <div className={`absolute bottom-12 left-0 hidden group-hover:block ${theme.createBg} border rounded-lg shadow-lg py-2 z-10 min-w-56`}>
                  <div className="px-3 py-2 space-y-2">
                    <input
                      type="url"
                      placeholder="Paste or type URL..."
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className={`w-full text-sm border rounded px-2 py-1 ${theme.createBg} ${theme.createText} themed-placeholder focus:outline-none focus:ring-1 focus:ring-blue-400`}
                    />
                    <input
                      type="text"
                      placeholder="Link text (optional)..."
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                      className={`w-full text-sm border rounded px-2 py-1 ${theme.createBg} ${theme.createText} themed-placeholder focus:outline-none focus:ring-1 focus:ring-blue-400`}
                    />
                    <button
                      type="button"
                      onClick={addLink}
                      disabled={!linkUrl.trim()}
                      className={`w-full text-xs py-1 px-2 rounded ${linkUrl.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} transition-colors`}
                    >
                      Add Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Save and Close Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="submit"
                className="p-2 rounded-full hover:bg-green-100 transition-colors text-green-600 hover:text-green-700"
                title={editingNote ? "Update Note" : "Save Note"}
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                title="Close without saving"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Auto-submit on content change - Google Keep style */}
          <input type="submit" className="hidden" />
        </form>
        </>
        )}

          {/* Advanced Search and Sort Controls */}
          <div className={`p-4 ${theme.background} ${theme.border} border rounded-xl backdrop-blur-sm shadow-sm`}>
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-2 border rounded-xl ${theme.background} ${theme.border} ${theme.subText} text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all hover:shadow-sm`}
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="mood">Sort by Mood</option>
                <option value="modified">Sort by Modified</option>
              </select>
              
              <select
                value={searchFilters.mood}
                onChange={(e) => setSearchFilters({...searchFilters, mood: e.target.value})}
                className={`px-4 py-2 border rounded-xl ${theme.background} ${theme.border} ${theme.subText} text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all hover:shadow-sm`}
              >
                <option value="">All Moods</option>
                <option value="happy">😊 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="angry">😠 Angry</option>
                <option value="excited">🎉 Excited</option>
                <option value="calm">🧘 Calm</option>
              </select>

              <label className={`flex items-center gap-2 ${theme.subText} text-sm px-4 py-2 rounded-xl border ${theme.border} bg-white/60 hover:bg-white/80 transition-all cursor-pointer hover:scale-105 hover:shadow-sm`}>
                <input
                  type="checkbox"
                  checked={searchFilters.hasReminder}
                  onChange={(e) => setSearchFilters({...searchFilters, hasReminder: e.target.checked})}
                  className="w-4 h-4 rounded text-purple-500 focus:ring-purple-300"
                />
                Has Reminder
              </label>

              <label className={`flex items-center gap-2 ${theme.subText} text-sm px-4 py-2 rounded-xl border ${theme.border} bg-white/60 hover:bg-white/80 transition-all cursor-pointer hover:scale-105 hover:shadow-sm`}>
                <input
                  type="checkbox"
                  checked={searchFilters.hasImage}
                  onChange={(e) => setSearchFilters({...searchFilters, hasImage: e.target.checked})}
                  className="w-4 h-4 rounded text-purple-500 focus:ring-purple-300"
                />
                Has Image
              </label>

              <label className={`flex items-center gap-2 ${theme.subText} text-sm px-4 py-2 rounded-xl border ${theme.border} bg-white/60 hover:bg-white/80 transition-all cursor-pointer hover:scale-105 hover:shadow-sm`}>
                <input
                  type="checkbox"
                  checked={searchFilters.hasAudio}
                  onChange={(e) => setSearchFilters({...searchFilters, hasAudio: e.target.checked})}
                  className="w-4 h-4 rounded text-purple-500 focus:ring-purple-300"
                />
                Has Audio
              </label>
            </div>
          </div>

        {/* Notes Display with Drag and Drop */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="notes">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}`}
              >
                {getFilteredAndSortedNotes().map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`note-card stagger-item ${theme.background} ${theme.border} border rounded-lg p-4 shadow-sm relative group hover:shadow-md transition-all duration-300 transform hover:scale-105 fade-in-up glow-on-hover ${
                          snapshot.isDragging ? 'rotate-3 shadow-lg scale-110' : ''
                        }`}
                        role="article"
                        aria-label={`Note: ${note.title}`}
                        tabIndex={0}
                      >
              {/* Pin indicator */}
              {note.is_pinned && (
                <div className="absolute top-2 right-2">
                  <Pin className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
              )}

              {/* Note content */}
              <div className="pr-8 w-full overflow-hidden">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-semibold ${theme.headerText} font-cedarville text-lg flex-1 break-words`}>
                    {note.title}
                  </h3>
                </div>
                {note.note_type && (
                  <div className="mb-2">
                    <span className={`inline-flex items-center gap-1 text-xs ${theme.background} ${theme.border} px-2 py-1 rounded-full border`}>
                      {note.note_type === 'checklist' ? 
                        <>
                          <CheckSquare className="w-3 h-3" /> 
                          Checklist
                        </> : 
                        note.note_type === 'drawing' ?
                        <>
                          <Palette className="w-3 h-3" /> 
                          Drawing
                        </> :
                        <>
                          <FileText className="w-3 h-3" />
                          Text
                        </>
                      }
                    </span>
                  </div>
                )}

                {/* Text Content */}
                {note.note_type === 'text' && note.content && (
                  <div className="mb-2 w-full overflow-hidden">
                    <p className={`${theme.subText} text-sm mb-2 whitespace-pre-wrap break-words overflow-wrap-anywhere`}>
                      {note.content}
                    </p>
                    {/* Link Previews */}
                    {extractUrls(note.content).map((url, index) => (
                      <div key={index} className="mt-3 w-full">
                        <LinkPreview url={url} getLinkPreview={getLinkPreview} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Drawing Content */}
                {note.note_type === 'drawing' && note.drawing_data && (
                  <div className="mb-2">
                    <img 
                      src={note.drawing_data} 
                      alt="Drawing" 
                      className="max-w-full h-auto rounded border"
                    />
                  </div>
                )}

                {/* Checklist Content */}
                {note.note_type === 'checklist' && note.checklist_items && note.checklist_items.length > 0 && (
                  <div className="mb-2">
                    {note.checklist_items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={async () => {
                            try {
                              console.log('Updating checklist item:', index, 'for note:', note.id);
                              const updatedChecklistItems = note.checklist_items.map((ci, i) => 
                                i === index ? { ...ci, completed: !ci.completed } : ci
                              );
                              console.log('Updated checklist items:', updatedChecklistItems);
                              await updateNote(note.id, { checklist_items: updatedChecklistItems });
                              console.log('Checklist update successful');
                            } catch (error) {
                              console.error('Error updating checklist:', error);
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className={`text-sm ${theme.subText} ${item.completed ? 'line-through opacity-70' : ''}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reminder Display */}
                {note.reminder_time && (
                  <div className={`flex items-center gap-1 mb-2 text-xs ${theme.accentText}`}>
                    <span>⏰</span>
                    <span>{format(parseISO(note.reminder_time), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                )}

                {/* Audio Display */}
                {note.audioUrl && (
                  <div className="mb-2">
                    <audio controls src={note.audioUrl} className="w-full h-8" />
                  </div>
                )}

                {/* Image display */}
                {note.image_url && (
                  <div className="mb-2">
                    <img 
                      src={note.image_url} 
                      alt="Note attachment" 
                      className="max-w-full h-auto rounded-lg shadow-sm max-h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Link display */}
                {note.linkUrl && (
                  <div className="mb-2">
                    <a
                      href={note.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-sm ${theme.accentText} hover:underline`}
                    >
                      <Link className="w-4 h-4" />
                      {note.linkText || note.linkUrl}
                    </a>
                  </div>
                )}
                
                {/* Labels */}
                {note.labels && note.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {note.labels.map((label) => (
                      <span key={label} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Mood display */}
                {note.detected_mood && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getMoodEmoji(note.detected_mood)}</span>
                    <span className={`text-xs ${theme.accentText} capitalize`}>
                      {note.detected_mood} ({Math.round((note.mood_confidence || 0) * 100)}%)
                    </span>
                  </div>
                )}

                <div className={`text-xs ${theme.accentText} flex justify-between items-center`}>
                  <span>{note.created_at ? new Date(note.created_at).toLocaleDateString() : ''}</span>
                </div>
              </div>

              {/* Note actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <button
                    onClick={() => togglePin(note.id)}
                    className={`p-1 rounded text-xs hover:bg-white/50 transition-all ${note.is_pinned ? 'text-yellow-600' : 'text-gray-600'}`}
                    title={note.is_pinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1 rounded text-xs text-blue-600 hover:bg-white/50 transition-all"
                    title="Edit"
                    aria-label={`Edit note: ${note.title}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => shareNote(note)}
                    className="p-1 rounded text-xs text-green-600 hover:bg-white/50 transition-all"
                    title="Share"
                    aria-label={`Share note: ${note.title}`}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {note.version > 1 && (
                    <button
                      onClick={() => {setSelectedNoteHistory(note); setShowVersionHistory(true);}}
                      className="p-1 rounded text-xs text-purple-600 hover:bg-white/50 transition-all"
                      title="Version History"
                      aria-label={`View history for: ${note.title}`}
                    >
                      🕒
                    </button>
                  )}
                  <button
                    onClick={() => toggleArchive(note.id)}
                    className="p-1 rounded text-xs text-gray-600 hover:bg-white/50 transition-all"
                    title={note.is_archived ? 'Unarchive' : 'Archive'}
                  >
                    {note.is_archived ? (
                      <ArchiveRestore className="w-4 h-4" />
                    ) : (
                      <Archive className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1 rounded text-xs text-red-600 hover:bg-white/50 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Color picker for individual notes */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  {colorOptions.slice(0, 6).map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateNoteColor(note.id, color.value)}
                        className={`w-4 h-4 rounded-full border ${color.class || 'bg-white'} hover:scale-110 transition-transform`}
                        title={`Change to ${color.name}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>

{getFilteredAndSortedNotes().length === 0 && (
          <div className={`text-center py-12 ${theme.subText}`}>
            <div className="text-6xl mb-4">{theme.decorative[0]}</div>
            <p className="text-lg">
              {showArchived ? 'No archived notes yet' : 'No notes yet. Create your first note above! ✨'}
            </p>
          </div>
        )}

        {/* Version History Modal */}
        {showVersionHistory && selectedNoteHistory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${theme.background} rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold ${theme.headerText}`}>Version History: {selectedNoteHistory.title}</h3>
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                  aria-label="Close version history"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                {selectedNoteHistory.history && selectedNoteHistory.history.map((version, index) => (
                  <div key={index} className={`p-3 border rounded ${theme.border}`}>
                    <div className={`text-sm ${theme.subText} mb-1`}>
                      Version {version.version} - {format(parseISO(version.date), 'MMM dd, yyyy HH:mm')}
                    </div>
                    <div className={`text-sm ${theme.subText}`}>
                      {version.content || 'No content'}
                    </div>
                  </div>
                ))}
                
                {(!selectedNoteHistory.history || selectedNoteHistory.history.length === 0) && (
                  <div className={`text-center py-8 ${theme.subText}`}>
                    No version history available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleNotesApp;
