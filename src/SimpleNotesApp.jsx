import { useState } from 'react';

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

function SimpleNotesApp({ onThemeChange }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentTheme, setCurrentTheme] = useState('cottagcore');
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [labelText, setLabelText] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [editingNote, setEditingNote] = useState(null);
  const [enableMoodDetection, setEnableMoodDetection] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Theme configurations
  const themes = {
    cottagcore: {
      name: "Cottage Core",
      emoji: "🌻",
      background: "bg-green-50/80",
      border: "border-green-200/50",
      headerText: "text-green-900",
      subText: "text-green-700",
      accentText: "text-amber-600",
      placeholderText: "placeholder-green-500",
      brainEmoji: "🧠",
      decorative: ["🌻", "🌸"],
      createBg: "bg-amber-50/90",
      createBorder: "border-amber-200/50",
      createText: "text-amber-900",
      createDecor: "🌿",
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
        { emoji: "🌻", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-70" },
        { emoji: "🌸", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-75" },
        { emoji: "🌿", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-70", delay: "delay-1000" },
        { emoji: "🍄", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-75", delay: "delay-2000" },
        { emoji: "🌾", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-70", delay: "delay-500" },
        { emoji: "🌼", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-75", delay: "delay-1500" }
      ],
      overlayGradient: "from-green-100/20 to-amber-100/20"
    },
    darkAcademia: {
      name: "Dark Academia",
      emoji: "🕯️",
      background: "bg-stone-900/95",
      border: "border-amber-600/50",
      headerText: "text-amber-100",
      subText: "text-amber-200",
      accentText: "text-amber-300",
      placeholderText: "placeholder-amber-400",
      brainEmoji: "🦉",
      decorative: ["📚", "🕯️"],
      createBg: "bg-amber-900/40",
      createBorder: "border-amber-500/60",
      createText: "text-amber-100",
      createDecor: "✒️",
      editBg: "bg-stone-800/60",
      editBorder: "border-stone-500/60",
      editText: "text-stone-100",
      editDecor: "📖",
      buttonGradient: "from-amber-700 to-stone-800",
      buttonHover: "from-amber-600 to-stone-700",
      buttonText: "text-amber-100",
      buttonBorder: "border-amber-600",
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
      background: "bg-slate-800/90",
      border: "border-slate-600/50",
      headerText: "text-slate-100",
      subText: "text-slate-200",
      accentText: "text-slate-300",
      placeholderText: "placeholder-slate-400",
      brainEmoji: "🌙",
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
        { emoji: "🌙", position: "top-10 left-10", size: "text-6xl", animation: "animate-bounce", opacity: "opacity-80" },
        { emoji: "⭐", position: "top-20 right-20", size: "text-5xl", animation: "animate-pulse", opacity: "opacity-85" },
        { emoji: "🌌", position: "bottom-20 left-20", size: "text-7xl", animation: "animate-bounce", opacity: "opacity-75", delay: "delay-1000" },
        { emoji: "🌟", position: "bottom-10 right-10", size: "text-4xl", animation: "animate-pulse", opacity: "opacity-80", delay: "delay-2000" },
        { emoji: "✨", position: "top-1/3 left-1/4", size: "text-5xl", animation: "animate-bounce", opacity: "opacity-70", delay: "delay-500" },
        { emoji: "💫", position: "top-2/3 right-1/3", size: "text-6xl", animation: "animate-pulse", opacity: "opacity-75", delay: "delay-1500" }
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
      placeholderText: "placeholder-pink-500",
      brainEmoji: "🦋",
      decorative: ["🌸", "🍃"],
      createBg: "bg-green-50/90",
      createBorder: "border-green-200/50",
      createText: "text-green-800",
      createDecor: "🌺",
      editBg: "bg-purple-50/90",
      editBorder: "border-purple-200/50",
      editText: "text-purple-800",
      editDecor: "🌷",
      buttonGradient: "from-pink-300 to-rose-400",
      buttonHover: "from-pink-400 to-rose-500",
      buttonText: "text-pink-900",
      buttonBorder: "border-pink-200",
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
      background: "bg-blue-50/80",
      border: "border-blue-200/50",
      headerText: "text-blue-900",
      subText: "text-blue-700",
      accentText: "text-teal-600",
      placeholderText: "placeholder-blue-500",
      brainEmoji: "🐋",
      decorative: ["🌊", "🐚"],
      createBg: "bg-teal-50/90",
      createBorder: "border-teal-200/50",
      createText: "text-teal-900",
      createDecor: "🏖️",
      editBg: "bg-cyan-50/90",
      editBorder: "border-cyan-200/50",
      editText: "text-cyan-900",
      editDecor: "🌊",
      buttonGradient: "from-blue-300 to-teal-400",
      buttonHover: "from-blue-400 to-teal-500",
      buttonText: "text-blue-900",
      buttonBorder: "border-blue-200",
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
      background: "bg-orange-50/80",
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
      background: "bg-green-50/80",
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
      editDecor: "🌱",
      buttonGradient: "from-green-400 to-emerald-500",
      buttonHover: "from-green-500 to-emerald-600",
      buttonText: "text-green-900",
      buttonBorder: "border-green-300",
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
    }
  };

  // Color options for notes
  const colorOptions = [
    { name: 'Default', class: '', value: '' },
    { name: 'Yellow', class: 'bg-yellow-100 border-yellow-300', value: 'yellow' },
    { name: 'Green', class: 'bg-green-100 border-green-300', value: 'green' },
    { name: 'Blue', class: 'bg-blue-100 border-blue-300', value: 'blue' },
    { name: 'Pink', class: 'bg-pink-100 border-pink-300', value: 'pink' },
    { name: 'Purple', class: 'bg-purple-100 border-purple-300', value: 'purple' },
    { name: 'Orange', class: 'bg-orange-100 border-orange-300', value: 'orange' },
    { name: 'Red', class: 'bg-red-100 border-red-300', value: 'red' },
    { name: 'Teal', class: 'bg-teal-100 border-teal-300', value: 'teal' },
    { name: 'Gray', class: 'bg-gray-100 border-gray-300', value: 'gray' },
    { name: 'Indigo', class: 'bg-indigo-100 border-indigo-300', value: 'indigo' },
    { name: 'Rose', class: 'bg-rose-100 border-rose-300', value: 'rose' }
  ];

  const theme = themes[currentTheme];

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    if (onThemeChange) {
      onThemeChange({
        ...themes[newTheme],
        name: newTheme
      });
    }
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

  // Add/Edit note
  const handleSubmit = (e) => {
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
        content: content.trim(),
        mood,
        confidence,
        date: new Date().toLocaleDateString(),
        isPinned: false,
        isArchived: false,
        color: selectedColor,
        labels: [...selectedLabels],
        enableMoodDetection,
        imageUrl: imagePreview,
        linkUrl: linkUrl.trim(),
        linkText: linkText.trim() || linkUrl.trim()
      };

      if (editingNote) {
        setNotes(notes.map(note => 
          note.id === editingNote.id 
            ? { ...note, ...noteData }
            : note
        ));
        setEditingNote(null);
        setShowCreateForm(false);
      } else {
        const newNote = {
          ...noteData,
          id: Date.now()
        };
        setNotes([...notes, newNote]);
        setShowCreateForm(false);
      }
      
      setTitle('');
      setContent('');
      setSelectedColor('');
      setSelectedLabels([]);
      setImageFile(null);
      setImagePreview('');
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowCreateForm(true);
    setTitle(note.title);
    setContent(note.content);
    setSelectedColor(note.color || '');
    setSelectedLabels(note.labels || []);
    setEnableMoodDetection(note.enableMoodDetection || false);
    setImagePreview(note.imageUrl || '');
    setLinkUrl(note.linkUrl || '');
    setLinkText(note.linkText || '');
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setShowCreateForm(false);
    setTitle('');
    setContent('');
    setSelectedColor('');
    setSelectedLabels([]);
    setImageFile(null);
    setImagePreview('');
    setLinkUrl('');
    setLinkText('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const togglePin = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const toggleArchive = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isArchived: !note.isArchived } : note
    ));
  };

  const updateNoteColor = (id, color) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, color } : note
    ));
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

  // Filter notes based on search and archive status
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.labels && note.labels.some(label => label.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesArchive = showArchived ? note.isArchived : !note.isArchived;
    return matchesSearch && matchesArchive;
  });

  // Sort notes: pinned first, then by date
  const sortedNotes = filteredNotes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const getColorClass = (color) => {
    const colorMap = {
      yellow: 'bg-yellow-100 border-yellow-300',
      green: 'bg-green-100 border-green-300',
      blue: 'bg-blue-100 border-blue-300',
      pink: 'bg-pink-100 border-pink-300',
      purple: 'bg-purple-100 border-purple-300',
      orange: 'bg-orange-100 border-orange-300',
      red: 'bg-red-100 border-red-300',
      teal: 'bg-teal-100 border-teal-300',
      gray: 'bg-gray-100 border-gray-300',
      indigo: 'bg-indigo-100 border-indigo-300',
      rose: 'bg-rose-100 border-rose-300'
    };
    return colorMap[color] || `${theme.background} ${theme.border}`;
  };

  return (
    <div className={`min-h-screen ${theme.appBackground} p-4 relative overflow-hidden`}>
      {/* Floating decoration elements */}
      {theme.floatingElements.map((element, index) => (
        <div
          key={index}
          className={`fixed ${element.position} ${element.size} ${element.opacity} ${element.animation} pointer-events-none z-0 ${element.delay || ''}`}
          style={{
            animationDelay: element.delay ? '1s' : '0s'
          }}
        >
          {element.emoji}
        </div>
      ))}
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold ${theme.headerText} mb-2 font-cedarville`}>
            My Notes
          </h1>
          <p className={`${theme.subText} text-sm`}>
            Your moodboard for life’s notes
          </p>
          
          {/* Theme Selector */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {Object.entries(themes).map(([key, themeData]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  currentTheme === key 
                    ? `${theme.buttonGradient} bg-gradient-to-r ${theme.buttonText} ${theme.buttonBorder} shadow-md` 
                    : `bg-white/50 ${theme.accentText} border-gray-300 hover:${theme.buttonHover} hover:bg-gradient-to-r hover:${theme.buttonText}`
                }`}
              >
                {themeData.emoji} {themeData.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search notes, labels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 px-4 py-2 border rounded-lg ${theme.background} ${theme.border} ${theme.subText} ${theme.placeholderText} focus:outline-none focus:ring-2 focus:ring-blue-300`}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                showArchived 
                  ? `${theme.buttonGradient} bg-gradient-to-r ${theme.buttonText} ${theme.buttonBorder}` 
                  : `bg-white/50 ${theme.accentText} border-gray-300 hover:bg-gray-50`
              }`}
            >
              {showArchived ? '📋 All Notes' : '📁 Archived'}
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className={`px-4 py-2 rounded-lg border bg-white/50 ${theme.accentText} border-gray-300 hover:bg-gray-50 transition-all`}
            >
              {viewMode === 'grid' ? '☰ List' : '⊞ Grid'}
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                showCreateForm || editingNote
                  ? `${theme.buttonGradient} bg-gradient-to-r ${theme.buttonText} ${theme.buttonBorder}` 
                  : `bg-white/50 ${theme.accentText} border-gray-300 hover:bg-gray-50`
              }`}
            >
              {showCreateForm || editingNote ? '✖ Close' : '✍ New Note'}
            </button>
          </div>
        </div>

        {/* Create/Edit Note Form */}
        {(showCreateForm || editingNote) && (
        <form onSubmit={handleSubmit} className={`${editingNote ? theme.editBg : theme.createBg} ${editingNote ? theme.editBorder : theme.createBorder} border rounded-lg p-4 mb-6 shadow-sm`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{editingNote ? theme.editDecor : theme.createDecor}</span>
            <h3 className={`text-lg font-semibold ${editingNote ? theme.editText : theme.createText} font-cedarville`}>
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h3>
          </div>
          
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md mb-3 ${theme.background} ${theme.border} ${theme.subText} ${theme.placeholderText} focus:outline-none focus:ring-2 focus:ring-blue-300`}
          />
          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            className={`w-full px-3 py-2 border rounded-md mb-3 ${theme.background} ${theme.border} ${theme.subText} ${theme.placeholderText} focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none`}
          />
          
          {/* Color Picker */}
          <div className="mb-3">
            <label className={`block text-sm font-medium ${theme.createText} mb-2`}>Color:</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 ${color.class || 'bg-white'} ${
                    selectedColor === color.value ? 'ring-2 ring-blue-400' : ''
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-3">
            <label className={`block text-sm font-medium ${editingNote ? theme.editText : theme.createText} mb-2`}>🖼️ Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${theme.background} ${theme.border} ${theme.subText} focus:outline-none focus:ring-2 focus:ring-blue-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-full h-32 object-contain rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Link */}
          <div className="mb-3">
            <label className={`block text-sm font-medium ${editingNote ? theme.editText : theme.createText} mb-2`}>🔗 Link:</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md text-sm ${theme.background} ${theme.border} ${theme.subText} ${theme.placeholderText} focus:outline-none focus:ring-2 focus:ring-blue-300`}
              />
              <input
                type="text"
                placeholder="Link text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className={`w-32 px-3 py-2 border rounded-md text-sm ${theme.background} ${theme.border} ${theme.subText} ${theme.placeholderText} focus:outline-none focus:ring-2 focus:ring-blue-300`}
              />
            </div>
          </div>

          {/* Labels */}
          <div className="mb-3">
            <label className={`block text-sm font-medium ${editingNote ? theme.editText : theme.createText} mb-2`}>Labels:</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add label..."
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                className={`flex-1 px-3 py-1 border rounded-md text-sm ${theme.background} ${theme.border} ${theme.subText}`}
              />
              <button
                type="button"
                onClick={addLabel}
                className={`px-3 py-1 ${theme.buttonGradient} bg-gradient-to-r ${theme.buttonText} rounded-md text-sm hover:${theme.buttonHover} hover:bg-gradient-to-r transition-all`}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedLabels.map((label) => (
                <span
                  key={label}
                  className={`px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1`}
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => removeLabel(label)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Mood Detection Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="moodDetection"
              checked={enableMoodDetection}
              onChange={(e) => setEnableMoodDetection(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
            />
            <label htmlFor="moodDetection" className={`text-sm ${editingNote ? theme.editText : theme.createText}`}>
              Enable AI mood detection
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className={`px-6 py-2 ${theme.buttonGradient} bg-gradient-to-r ${theme.buttonText} rounded-lg hover:${theme.buttonHover} hover:bg-gradient-to-r transition-all shadow-md`}
            >
              {editingNote ? 'Update Note' : 'Add Note'} ✨
            </button>
            {editingNote && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        )}

        {/* Notes Display */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}`}>
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`${getColorClass(note.color)} border rounded-lg p-4 shadow-sm relative group hover:shadow-md transition-all`}
            >
              {/* Pin indicator */}
              {note.isPinned && (
                <div className="absolute top-2 right-2">
                  <span className="text-yellow-500">📌</span>
                </div>
              )}

              {/* Note content */}
              <div className="pr-8">
                <h3 className={`font-semibold ${theme.headerText} mb-2 font-cedarville text-lg`}>
                  {note.title}
                </h3>
                <p className={`${theme.subText} text-sm mb-2 whitespace-pre-wrap`}>
                  {note.content}
                </p>

                {/* Image display */}
                {note.imageUrl && (
                  <div className="mb-2">
                    <img 
                      src={note.imageUrl} 
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
                      🔗 {note.linkText || note.linkUrl}
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
                {note.mood && note.enableMoodDetection && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getMoodEmoji(note.mood)}</span>
                    <span className={`text-xs ${theme.accentText} capitalize`}>
                      {note.mood} ({Math.round(note.confidence * 100)}%)
                    </span>
                  </div>
                )}

                <div className={`text-xs ${theme.accentText} flex justify-between items-center`}>
                  <span>{note.date}</span>
                </div>
              </div>

              {/* Note actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <button
                    onClick={() => togglePin(note.id)}
                    className={`p-1 rounded text-xs hover:bg-white/50 transition-all ${note.isPinned ? 'text-yellow-600' : 'text-gray-600'}`}
                    title={note.isPinned ? 'Unpin' : 'Pin'}
                  >
                    📌
                  </button>
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1 rounded text-xs text-blue-600 hover:bg-white/50 transition-all"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => toggleArchive(note.id)}
                    className="p-1 rounded text-xs text-gray-600 hover:bg-white/50 transition-all"
                    title={note.isArchived ? 'Unarchive' : 'Archive'}
                  >
                    📁
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1 rounded text-xs text-red-600 hover:bg-white/50 transition-all"
                    title="Delete"
                  >
                    🗑️
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
          ))}
        </div>

        {sortedNotes.length === 0 && (
          <div className={`text-center py-12 ${theme.subText}`}>
            <div className="text-6xl mb-4">{theme.decorative[0]}</div>
            <p className="text-lg">
              {showArchived ? 'No archived notes yet' : 'No notes yet. Create your first note above! ✨'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleNotesApp;
