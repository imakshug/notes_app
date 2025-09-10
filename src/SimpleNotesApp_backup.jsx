import { useState } from 'react';

// AI Mood Detection Function
const detectMoodFromText = (text) => {
  const content         { emoji: "🏛️", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-25", delay: "delay-1000" }, text.toLowerCase();
  
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
  return emojis[mood] || emojis.neutral;
};

// Main SimpleNotesApp Component
function SimpleNotesApp({ onThemeChange }) {
  // Theme configurations
  const themes = {
    cottageCore: {
      name: "Cottage Core",
      emoji: "🌻",
      background: "bg-amber-100/80",
      border: "border-amber-200/50",
      headerText: "text-amber-900",
      subText: "text-amber-700",
      accentText: "text-amber-600",
      brainEmoji: "🧠",
      decorative: ["🌿", "🌸"],
      createBg: "bg-green-50/90",
      createBorder: "border-green-200/50",
      createText: "text-green-800",
      createDecor: "🍄",
      editBg: "bg-blue-50/90",
      editBorder: "border-blue-200/50",
      editText: "text-blue-800",
      editDecor: "✏️",
      buttonGradient: "from-amber-300 to-yellow-400",
      buttonHover: "from-amber-400 to-yellow-500",
      buttonText: "text-amber-900",
      buttonBorder: "border-amber-200",
      // Background theme
      appBackground: "bg-gradient-to-br from-amber-50 via-green-50 to-yellow-100",
      floatingElements: [
        { emoji: "🌻", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-30" },
        { emoji: "🌸", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-40" },
        { emoji: "🌿", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-25", delay: "delay-1000" },
        { emoji: "🍄", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-35", delay: "delay-2000" },
        { emoji: "🌾", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-20", delay: "delay-500" },
        { emoji: "🌼", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-30", delay: "delay-1500" }
      ],
      overlayGradient: "from-green-100/20 to-amber-100/20"
    },
    darkAcademia: {
      name: "Dark Academia",
      emoji: "�️",
      background: "bg-stone-900/90",
      border: "border-amber-700/70",
      headerText: "text-amber-100",
      subText: "text-amber-200",
      accentText: "text-amber-300",
      brainEmoji: "🦉",
      decorative: ["📚", "🕯️"],
      createBg: "bg-amber-900/40",
      createBorder: "border-amber-600/60",
      createText: "text-amber-100",
      createDecor: "✒️",
      editBg: "bg-stone-800/50",
      editBorder: "border-stone-600/60",
      editText: "text-stone-100",
      editDecor: "📖",
      buttonGradient: "from-amber-700 to-stone-800",
      buttonHover: "from-amber-600 to-stone-700",
      buttonText: "text-amber-100",
      buttonBorder: "border-amber-700",
      // Background theme - warm academic colors
      appBackground: "bg-gradient-to-br from-stone-900 via-amber-900 to-stone-800",
      floatingElements: [
        { emoji: "📚", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-30" },
        { emoji: "🕯️", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-35" },
        { emoji: "�", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-25", delay: "delay-1000" },
        { emoji: "🦉", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-30", delay: "delay-2000" },
        { emoji: "✒️", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-20", delay: "delay-500" },
        { emoji: "�", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-25", delay: "delay-1500" }
      ],
      overlayGradient: "from-amber-200/10 to-yellow-200/15"
    },
    midnight: {
      name: "Midnight",
      emoji: "🌙",
      background: "bg-slate-800/90",
      border: "border-slate-600/50",
      headerText: "text-slate-100",
      subText: "text-slate-200",
      accentText: "text-slate-300",
      brainEmoji: "�",
      decorative: ["🌙", "⭐"],
      createBg: "bg-slate-700/30",
      createBorder: "border-slate-500/50",
      createText: "text-slate-100",
      createDecor: "✨",
      editBg: "bg-indigo-900/30",
      editBorder: "border-indigo-700/50",
      editText: "text-indigo-100",
      editDecor: "🌌",
      buttonGradient: "from-slate-600 to-slate-700",
      buttonHover: "from-slate-500 to-slate-600",
      buttonText: "text-slate-100",
      buttonBorder: "border-slate-500",
      // Background theme - dark midnight colors
      appBackground: "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800",
      floatingElements: [
        { emoji: "🌙", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-20" },
        { emoji: "⭐", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-25" },
        { emoji: "🌌", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-15", delay: "delay-1000" },
        { emoji: "🌟", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-20", delay: "delay-2000" },
        { emoji: "✨", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-10", delay: "delay-500" },
        { emoji: "💫", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-15", delay: "delay-1500" }
      ],
      overlayGradient: "from-slate-900/20 to-gray-900/30"
    },
    sakuraBlossom: {
      name: "Sakura Blossom",
      emoji: "🌸",
      background: "bg-pink-50/80",
      border: "border-pink-200/50",
      headerText: "text-pink-900",
      subText: "text-pink-700",
      accentText: "text-pink-600",
      brainEmoji: "🦋",
      decorative: ["🌸", "🍃"],
      createBg: "bg-green-50/90",
      createBorder: "border-green-200/50",
      createText: "text-green-800",
      createDecor: "🌺",
      editBg: "bg-purple-50/90",
      editBorder: "border-purple-200/50",
      editText: "text-purple-800",
      editDecor: "✨",
      buttonGradient: "from-pink-300 to-rose-400",
      buttonHover: "from-pink-400 to-rose-500",
      buttonText: "text-pink-900",
      buttonBorder: "border-pink-200",
      // Background theme
      appBackground: "bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100",
      floatingElements: [
        { emoji: "🌸", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-40" },
        { emoji: "🌺", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-50" },
        { emoji: "🦋", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-35", delay: "delay-1000" },
        { emoji: "🍃", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-45", delay: "delay-2000" },
        { emoji: "✨", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-30", delay: "delay-500" },
        { emoji: "🌿", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-40", delay: "delay-1500" }
      ],
      overlayGradient: "from-pink-100/20 to-rose-100/20"
    },
    oceanBreeze: {
      name: "Ocean Breeze",
      emoji: "🌊",
      background: "bg-cyan-100/80",
      border: "border-cyan-200/50",
      headerText: "text-cyan-900",
      subText: "text-cyan-700",
      accentText: "text-cyan-600",
      brainEmoji: "🐚",
      decorative: ["🌊", "⭐"],
      createBg: "bg-teal-50/90",
      createBorder: "border-teal-200/50",
      createText: "text-teal-800",
      createDecor: "🏖️",
      editBg: "bg-blue-50/90",
      editBorder: "border-blue-200/50",
      editText: "text-blue-800",
      editDecor: "🐠",
      buttonGradient: "from-cyan-300 to-teal-400",
      buttonHover: "from-cyan-400 to-teal-500",
      buttonText: "text-cyan-900",
      buttonBorder: "border-cyan-200",
      // Background theme
      appBackground: "bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-100",
      floatingElements: [
        { emoji: "🌊", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-35" },
        { emoji: "🐚", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-45" },
        { emoji: "🏖️", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-30", delay: "delay-1000" },
        { emoji: "⭐", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-40", delay: "delay-2000" },
        { emoji: "🐠", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-25", delay: "delay-500" },
        { emoji: "🌅", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-35", delay: "delay-1500" }
      ],
      overlayGradient: "from-cyan-100/20 to-teal-100/20"
    },
    sunsetGlow: {
      name: "Sunset Glow",
      emoji: "🌅",
      background: "bg-orange-100/80",
      border: "border-orange-200/50",
      headerText: "text-orange-900",
      subText: "text-orange-700",
      accentText: "text-orange-600",
      brainEmoji: "☀️",
      decorative: ["🌅", "🦋"],
      createBg: "bg-rose-50/90",
      createBorder: "border-rose-200/50",
      createText: "text-rose-800",
      createDecor: "🌺",
      editBg: "bg-purple-50/90",
      editBorder: "border-purple-200/50",
      editText: "text-purple-800",
      editDecor: "✨",
      buttonGradient: "from-orange-300 to-red-400",
      buttonHover: "from-orange-400 to-red-500",
      buttonText: "text-orange-900",
      buttonBorder: "border-orange-200",
      // Background theme
      appBackground: "bg-gradient-to-br from-orange-50 via-red-50 to-yellow-100",
      floatingElements: [
        { emoji: "🌅", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-40" },
        { emoji: "☀️", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-50" },
        { emoji: "🦋", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-35", delay: "delay-1000" },
        { emoji: "🌺", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-45", delay: "delay-2000" },
        { emoji: "✨", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-30", delay: "delay-500" },
        { emoji: "🔥", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-40", delay: "delay-1500" }
      ],
      overlayGradient: "from-orange-100/20 to-red-100/20"
    },
    forestGreen: {
      name: "Forest Green",
      emoji: "🌲",
      background: "bg-green-100/80",
      border: "border-green-200/50",
      headerText: "text-green-900",
      subText: "text-green-700",
      accentText: "text-green-600",
      brainEmoji: "🦌",
      decorative: ["🌲", "🍂"],
      createBg: "bg-emerald-50/90",
      createBorder: "border-emerald-200/50",
      createText: "text-emerald-800",
      createDecor: "🌿",
      editBg: "bg-lime-50/90",
      editBorder: "border-lime-200/50",
      editText: "text-lime-800",
      editDecor: "🍃",
      buttonGradient: "from-green-300 to-emerald-400",
      buttonHover: "from-green-400 to-emerald-500",
      buttonText: "text-green-900",
      buttonBorder: "border-green-200",
      // Background theme
      appBackground: "bg-gradient-to-br from-green-50 via-emerald-50 to-lime-100",
      floatingElements: [
        { emoji: "🌲", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-35" },
        { emoji: "🦌", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-45" },
        { emoji: "🍂", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-30", delay: "delay-1000" },
        { emoji: "🌿", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-40", delay: "delay-2000" },
        { emoji: "🍃", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-25", delay: "delay-500" },
        { emoji: "🌳", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-35", delay: "delay-1500" }
      ],
      overlayGradient: "from-green-100/20 to-emerald-100/20"
    }
  };

  const [currentTheme, setCurrentTheme] = useState('cottageCore');
  const theme = themes[currentTheme];

  // Notify parent component about theme change
  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(themes[newTheme]);
    }
  };

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Welcome Note",
      content: "Welcome to your AI Notes App! This is a compact version with mood detection.",
      mood: "excited",
      confidence: 0.85,
      date: "2025-09-09",
      isPinned: true,
      isArchived: false,
      color: "yellow",
      labels: ["welcome", "demo"],
      enableMoodDetection: true
    }
  ]);

  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNote, setNewNote] = useState({ 
    title: '', 
    content: '', 
    color: 'white', 
    labels: [], 
    enableMoodDetection: true 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showArchived, setShowArchived] = useState(false);
  const [newLabelInput, setNewLabelInput] = useState('');
  const [availableLabels, setAvailableLabels] = useState(['work', 'personal', 'ideas', 'todo', 'important', 'demo', 'welcome']);
  const [editingNote, setEditingNote] = useState(null);

  const noteColors = {
    white: { bg: 'bg-white', border: 'border-gray-200' },
    yellow: { bg: 'bg-yellow-100', border: 'border-yellow-200' },
    orange: { bg: 'bg-orange-100', border: 'border-orange-200' },
    red: { bg: 'bg-red-100', border: 'border-red-200' },
    pink: { bg: 'bg-pink-100', border: 'border-pink-200' },
    purple: { bg: 'bg-purple-100', border: 'border-purple-200' },
    blue: { bg: 'bg-blue-100', border: 'border-blue-200' },
    cyan: { bg: 'bg-cyan-100', border: 'border-cyan-200' },
    teal: { bg: 'bg-teal-100', border: 'border-teal-200' },
    green: { bg: 'bg-green-100', border: 'border-green-200' },
    gray: { bg: 'bg-gray-100', border: 'border-gray-200' }
  };

  const handleCreateNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      let moodData = { mood: 'neutral', confidence: 0 };
      
      if (newNote.enableMoodDetection) {
        moodData = detectMoodFromText(newNote.content);
      }
      
      const note = {
        id: Date.now(),
        title: newNote.title || 'Untitled',
        content: newNote.content,
        mood: moodData.mood,
        confidence: moodData.confidence,
        date: new Date().toISOString().split('T')[0],
        isPinned: false,
        isArchived: false,
        color: newNote.color,
        labels: newNote.labels,
        enableMoodDetection: newNote.enableMoodDetection
      };
      
      setNotes([note, ...notes]);
      setNewNote({ 
        title: '', 
        content: '', 
        color: 'white', 
        labels: [], 
        enableMoodDetection: true 
      });
      setNewLabelInput('');
      setIsCreatingNote(false);
    }
  };

  const handleEditNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNote({
        ...note,
        labels: [...note.labels]
      });
    }
  };

  const handleSaveEdit = () => {
    if (editingNote && (editingNote.title.trim() || editingNote.content.trim())) {
      let moodData = { mood: editingNote.mood, confidence: editingNote.confidence };
      
      if (editingNote.enableMoodDetection) {
        moodData = detectMoodFromText(editingNote.content);
      } else {
        moodData = { mood: 'neutral', confidence: 0 };
      }
      
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? {
              ...editingNote,
              mood: moodData.mood,
              confidence: moodData.confidence,
              title: editingNote.title || 'Untitled'
            }
          : note
      ));
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handlePinNote = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const handleArchiveNote = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isArchived: !note.isArchived } : note
    ));
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.labels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesArchiveStatus = showArchived ? note.isArchived : !note.isArchived;
    return matchesSearch && matchesArchiveStatus;
  });

  const sortedNotes = filteredNotes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const addNewLabel = (targetNote = newNote, setTargetNote = setNewNote) => {
    if (newLabelInput.trim()) {
      const trimmedLabel = newLabelInput.trim().toLowerCase();
      if (!availableLabels.includes(trimmedLabel)) {
        setAvailableLabels([...availableLabels, trimmedLabel]);
      }
      if (!targetNote.labels.includes(trimmedLabel)) {
        setTargetNote({ ...targetNote, labels: [...targetNote.labels, trimmedLabel] });
      }
      setNewLabelInput('');
    }
  };

  return (
    <div className="min-h-screen p-3">
      {/* Compact Header */}
      <div className={`${theme.background} backdrop-blur-sm border-2 ${theme.border} rounded-2xl p-4 mb-4 shadow-lg relative overflow-hidden`}>
        <div className={`absolute top-1 right-1 text-lg opacity-50`}>{theme.decorative[0]}</div>
        <div className={`absolute bottom-1 left-1 text-lg opacity-40`}>{theme.decorative[1]}</div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className={`cedarville-cursive-regular text-3xl font-bold ${theme.headerText} mb-1 tracking-tight`}>📝 My Notes</h1>
            <p className={`${theme.subText} text-base font-medium`}>Simple notes with mood detection</p>
            <span className={`${theme.accentText} text-xs`}>{filteredNotes.length} notes {showArchived && '(archived)'}</span>
          </div>
          <div className="text-3xl animate-pulse">{theme.brainEmoji}</div>
        </div>
        
        {/* Theme Selector */}
        <div className="mt-3 mb-2 relative z-10">
          <div className="flex flex-wrap gap-2">
            <label className={`${theme.headerText} text-sm font-medium`}>Theme:</label>
            {Object.entries(themes).map(([themeKey, themeData]) => (
              <button
                key={themeKey}
                onClick={() => handleThemeChange(themeKey)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1 ${
                  currentTheme === themeKey
                    ? `bg-white/90 ${theme.headerText} ring-2 ring-white/50`
                    : `bg-white/50 ${theme.headerText} hover:bg-white/70`
                }`}
                title={themeData.name}
              >
                {themeData.emoji} {themeData.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Compact Controls */}
        <div className="mt-3 flex flex-wrap gap-2 items-center relative z-10">
          <div className="flex-1 min-w-48">
            <input
              type="text"
              placeholder="Search notes, labels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-3 py-2 border-2 ${theme.border} rounded-xl bg-white/90 backdrop-blur-sm ${theme.headerText} placeholder-opacity-60 text-sm`}
              style={{ placeholderColor: theme.accentText }}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className={`bg-white/80 border-2 ${theme.border} ${theme.headerText} px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/90`}
            >
              {viewMode === 'grid' ? '📋' : '⊞'}
            </button>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`border-2 px-3 py-2 rounded-xl text-sm font-medium ${
                showArchived 
                  ? `bg-white/90 ${theme.border} ${theme.headerText}` 
                  : `bg-white/80 ${theme.border} ${theme.headerText} hover:bg-white/90`
              }`}
            >
              {showArchived ? '📝' : '📦'}
            </button>
          </div>
          
          <button
            onClick={() => setIsCreatingNote(true)}
            className={`bg-gradient-to-r ${theme.buttonGradient} ${theme.buttonText} px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:${theme.buttonHover} transform hover:scale-105 transition-all duration-300 border ${theme.buttonBorder}`}
          >
            ➕ Add Note
          </button>
        </div>
      </div>

      {/* Create Note Form */}
      {isCreatingNote && (
        <div className={`${theme.createBg} backdrop-blur-sm border-2 ${theme.createBorder} rounded-2xl p-4 mb-4 shadow-lg relative overflow-hidden`}>
          <div className="absolute top-1 right-1 text-lg opacity-30">{theme.createDecor}</div>
          
          <h3 className={`text-xl font-bold ${theme.createText} mb-3 flex items-center gap-2 relative z-10`}>
            <span className="text-xl">📝</span> Create Note
          </h3>
          
          <input
            type="text"
            placeholder="Note title..."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full p-3 bg-white/70 border-2 border-amber-200/50 rounded-xl text-amber-900 placeholder-amber-600 text-sm font-medium backdrop-blur-sm mb-3"
          />
          
          <textarea
            placeholder="Write your thoughts..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="w-full p-3 bg-white/70 border-2 border-amber-200/50 rounded-xl text-amber-900 placeholder-amber-600 text-sm backdrop-blur-sm mb-3 resize-none"
            rows="4"
          />
          
          {/* Mood Detection Toggle */}
          <div className="mb-3">
            <label className="flex items-center gap-2 text-green-800 font-medium text-sm">
              <input
                type="checkbox"
                checked={newNote.enableMoodDetection}
                onChange={(e) => setNewNote({ ...newNote, enableMoodDetection: e.target.checked })}
                className="rounded"
              />
              Enable AI Mood Detection
            </label>
          </div>
          
          <div className="mb-3">
            <label className="block text-green-800 font-medium text-sm mb-1">Color:</label>
            <div className="flex flex-wrap gap-1">
              {Object.entries(noteColors).map(([colorName, colorClass]) => (
                <button
                  key={colorName}
                  onClick={() => setNewNote({ ...newNote, color: colorName })}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                    colorClass.bg
                  } ${
                    newNote.color === colorName 
                      ? 'border-amber-600 ring-1 ring-amber-300' 
                      : 'border-amber-300/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-green-800 font-medium text-sm mb-1">Labels:</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {availableLabels.map(label => (
                <button
                  key={label}
                  onClick={() => {
                    const isSelected = newNote.labels.includes(label);
                    setNewNote({
                      ...newNote,
                      labels: isSelected 
                        ? newNote.labels.filter(l => l !== label)
                        : [...newNote.labels, label]
                    });
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                    newNote.labels.includes(label)
                      ? 'bg-green-200 text-green-800 border border-green-300'
                      : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new label..."
                value={newLabelInput}
                onChange={(e) => setNewLabelInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addNewLabel();
                  }
                }}
                className="flex-1 px-2 py-1 bg-white/70 border border-amber-200/50 rounded-lg text-sm text-amber-900 placeholder-amber-600"
              />
              <button
                onClick={() => addNewLabel()}
                className="bg-green-200 text-green-800 px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-300"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="flex gap-3 relative z-10">
            <button
              onClick={handleCreateNote}
              className="bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-900 px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:from-amber-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300 border border-amber-200"
            >
              💾 Save
            </button>
            <button
              onClick={() => {
                setIsCreatingNote(false);
                setNewNote({ title: '', content: '', color: 'white', labels: [], enableMoodDetection: true });
                setNewLabelInput('');
              }}
              className="bg-stone-200/80 backdrop-blur-sm border-2 border-stone-300/50 text-stone-700 px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-stone-300/80 transform hover:scale-105 transition-all duration-300"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Note Form */}
      {editingNote && (
        <div className={`${theme.editBg} backdrop-blur-sm border-2 ${theme.editBorder} rounded-2xl p-4 mb-4 shadow-lg relative overflow-hidden`}>
          <div className="absolute top-1 right-1 text-lg opacity-30">{theme.editDecor}</div>
          
          <h3 className={`text-xl font-bold ${theme.editText} mb-3 flex items-center gap-2 relative z-10`}>
            <span className="text-xl">✏️</span> Edit Note
          </h3>
          
          <input
            type="text"
            placeholder="Note title..."
            value={editingNote.title}
            onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
            className="w-full p-3 bg-white/70 border-2 border-blue-200/50 rounded-xl text-blue-900 placeholder-blue-600 text-sm font-medium backdrop-blur-sm mb-3"
          />
          
          <textarea
            placeholder="Write your thoughts..."
            value={editingNote.content}
            onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
            className="w-full p-3 bg-white/70 border-2 border-blue-200/50 rounded-xl text-blue-900 placeholder-blue-600 text-sm backdrop-blur-sm mb-3 resize-none"
            rows="4"
          />
          
          {/* Mood Detection Toggle for Edit */}
          <div className="mb-3">
            <label className="flex items-center gap-2 text-blue-800 font-medium text-sm">
              <input
                type="checkbox"
                checked={editingNote.enableMoodDetection}
                onChange={(e) => setEditingNote({ ...editingNote, enableMoodDetection: e.target.checked })}
                className="rounded"
              />
              Enable AI Mood Detection
            </label>
          </div>
          
          <div className="mb-3">
            <label className="block text-blue-800 font-medium text-sm mb-1">Color:</label>
            <div className="flex flex-wrap gap-1">
              {Object.entries(noteColors).map(([colorName, colorClass]) => (
                <button
                  key={colorName}
                  onClick={() => setEditingNote({ ...editingNote, color: colorName })}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                    colorClass.bg
                  } ${
                    editingNote.color === colorName 
                      ? 'border-blue-600 ring-1 ring-blue-300' 
                      : 'border-blue-300/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-blue-800 font-medium text-sm mb-1">Labels:</label>
            <div className="flex flex-wrap gap-1 mb-2">
              {availableLabels.map(label => (
                <button
                  key={label}
                  onClick={() => {
                    const isSelected = editingNote.labels.includes(label);
                    setEditingNote({
                      ...editingNote,
                      labels: isSelected 
                        ? editingNote.labels.filter(l => l !== label)
                        : [...editingNote.labels, label]
                    });
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                    editingNote.labels.includes(label)
                      ? 'bg-blue-200 text-blue-800 border border-blue-300'
                      : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new label..."
                value={newLabelInput}
                onChange={(e) => setNewLabelInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addNewLabel(editingNote, setEditingNote);
                  }
                }}
                className="flex-1 px-2 py-1 bg-white/70 border border-blue-200/50 rounded-lg text-sm text-blue-900 placeholder-blue-600"
              />
              <button
                onClick={() => addNewLabel(editingNote, setEditingNote)}
                className="bg-blue-200 text-blue-800 px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-300"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="flex gap-3 relative z-10">
            <button
              onClick={handleSaveEdit}
              className="bg-gradient-to-r from-blue-300 to-cyan-400 text-blue-900 px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:from-blue-400 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300 border border-blue-200"
            >
              💾 Update
            </button>
            <button
              onClick={() => {
                setEditingNote(null);
                setNewLabelInput('');
              }}
              className="bg-stone-200/80 backdrop-blur-sm border-2 border-stone-300/50 text-stone-700 px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-stone-300/80 transform hover:scale-105 transition-all duration-300"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Compact Notes Display */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3' : 'space-y-3'}`}>
        {sortedNotes.map(note => (
          <div
            key={note.id}
            className={`backdrop-blur-sm border-2 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-500 transform hover:scale-102 group cursor-pointer relative overflow-hidden ${
              noteColors[note.color]?.bg || 'bg-white/60'
            } ${
              noteColors[note.color]?.border || 'border-gray-200'
            }/50`}
          >
            {note.isPinned && (
              <div className="absolute top-2 right-2 text-amber-500 text-lg">📌</div>
            )}
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="cedarville-cursive-regular text-lg font-bold text-stone-800 truncate pr-2">
                {note.title}
              </h3>
            </div>
            
            <div className="mb-3">
              <p className="text-stone-700 text-sm leading-relaxed line-clamp-4">
                {note.content}
              </p>
            </div>
            
            {/* Single mood display - only show if mood detection is enabled */}
            {note.enableMoodDetection && (
              <div className="mb-3 p-2 bg-white/50 rounded-lg border border-amber-200/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600">Mood:</span>
                  <span className="text-xl">{getMoodEmoji(note.mood)}</span>
                </div>
                <div className="text-xs text-stone-700 font-medium capitalize">
                  {note.mood} ({Math.round(note.confidence * 100)}%)
                </div>
              </div>
            )}
            
            {note.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {note.labels.map(label => (
                  <span
                    key={label}
                    className="px-2 py-1 bg-stone-200/80 text-stone-700 text-xs rounded-full font-medium"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center text-xs text-stone-500 mb-3">
              <span>{note.date}</span>
            </div>
            
            {/* Action buttons with edit option */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditNote(note.id);
                }}
                className="flex-1 px-2 py-1 bg-blue-200/80 text-blue-800 rounded-lg text-xs font-medium hover:bg-blue-300/80 transition-all duration-300"
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinNote(note.id);
                }}
                className={`flex-1 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                  note.isPinned 
                    ? 'bg-amber-200/80 text-amber-800 hover:bg-amber-300/80' 
                    : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300/80'
                }`}
              >
                {note.isPinned ? '📌' : '📍'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchiveNote(note.id);
                }}
                className="flex-1 px-2 py-1 bg-gray-200/80 text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-300/80 transition-all duration-300"
              >
                📦
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id);
                }}
                className="flex-1 px-2 py-1 bg-red-200/80 text-red-800 rounded-lg text-xs font-medium hover:bg-red-300/80 transition-all duration-300"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sortedNotes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">📝</div>
          <h3 className="text-xl font-semibold text-stone-600 mb-2">
            {searchQuery ? 'No notes found' : showArchived ? 'No archived notes' : 'No notes yet'}
          </h3>
          <p className="text-stone-500">
            {searchQuery 
              ? 'Try a different search term' 
              : showArchived 
                ? 'Notes you archive will appear here' 
                : 'Create your first note to get started!'
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default SimpleNotesApp;
