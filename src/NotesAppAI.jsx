import { useState, useEffect } from 'react';
import { Plus, Search, Heart, Star, Calendar, Palette, Settings, ArrowLeft, Filter, Download, Tag, Grid, List, Trash2, X, Brain, Sparkles, Wand2, Mic, Camera, MapPin } from 'lucide-react';
import AIEditor from './AIEditor';

export default function NotesAppAI({ onBackToLanding }) {
  const [notes, setNotes] = useState([
    { 
      id: 1, 
      title: "Brainstorm 💡", 
      content: "Ideas for my new project! So excited to finally start building this amazing app that will change everything!", 
      mood: "excited", 
      detectedMood: "energetic", // AI detected mood
      moodConfidence: 0.89,
      theme: "pink",
      date: "2025-01-15",
      category: "work",
      tags: ["ideas", "project"],
      isFavorite: true,
      updatedAt: "2025-01-15T10:30:00Z",
      aiSummary: "• Excited about new project\n• Building an amazing app\n• Feeling transformative energy",
      contextLocation: "coffee shop",
      stickers: ["⚡", "🚀"]
    },
    { 
      id: 2, 
      title: "Shopping List 🛒", 
      content: "Need to get matcha, oat milk, candles, and some cute succulents for my room. Feeling pretty calm today.", 
      mood: "calm", 
      detectedMood: "peaceful",
      moodConfidence: 0.76,
      theme: "emerald",
      date: "2025-01-14",
      category: "personal",
      tags: ["shopping", "lifestyle"],
      isFavorite: false,
      updatedAt: "2025-01-14T15:20:00Z",
      aiSummary: "• Essential items: matcha, oat milk\n• Home decor: candles, succulents\n• Peaceful mindset",
      contextLocation: "home",
      stickers: ["🌱", "🕯️"]
    },
    { 
      id: 3, 
      title: "Feeling Overwhelmed", 
      content: "Today has been really stressful. Work deadlines are piling up and I can't seem to focus on anything. Need to find a way to calm down and get organized.", 
      mood: "stressed", 
      detectedMood: "anxious",
      moodConfidence: 0.94,
      theme: "purple",
      date: "2025-01-13",
      category: "journal",
      tags: ["stress", "work", "mental-health"],
      isFavorite: false,
      updatedAt: "2025-01-13T20:45:00Z",
      aiSummary: "• High stress from work deadlines\n• Difficulty focusing\n• Seeking calm and organization",
      contextLocation: "office",
      stickers: ["😓", "🌊"]
    }
  ]);

  const [currentTheme, setCurrentTheme] = useState('adaptive'); // New adaptive theme
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const [showAIEditor, setShowAIEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);

  // AI Mood Detection Function
  const detectMoodFromText = (text) => {
    const moodKeywords = {
      excited: ['excited', 'amazing', 'awesome', 'fantastic', 'thrilled', 'pumped'],
      happy: ['happy', 'joy', 'cheerful', 'delighted', 'pleased', 'content'],
      calm: ['calm', 'peaceful', 'serene', 'relaxed', 'tranquil', 'zen'],
      stressed: ['stressed', 'overwhelmed', 'pressure', 'deadlines', 'anxiety', 'worried'],
      anxious: ['anxious', 'nervous', 'worried', 'concerned', 'uneasy', 'restless'],
      creative: ['creative', 'inspired', 'innovative', 'artistic', 'imaginative', 'ideas'],
      grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'fortunate', 'lucky'],
      energetic: ['energy', 'pumped', 'motivated', 'driven', 'active', 'dynamic']
    };

    const words = text.toLowerCase().split(/\s+/);
    const moodScores = {};

    Object.keys(moodKeywords).forEach(mood => {
      moodScores[mood] = 0;
      moodKeywords[mood].forEach(keyword => {
        if (words.some(word => word.includes(keyword))) {
          moodScores[mood] += 1;
        }
      });
    });

    const detectedMood = Object.keys(moodScores).reduce((a, b) => 
      moodScores[a] > moodScores[b] ? a : b
    );

    const maxScore = Math.max(...Object.values(moodScores));
    const confidence = maxScore > 0 ? Math.min(0.6 + (maxScore * 0.1), 0.95) : 0.3;

    return { mood: detectedMood, confidence };
  };

  // Dynamic Theme Based on Mood
  const adaptiveThemes = {
    adaptive: {
      name: 'Adaptive AI',
      bg: 'from-indigo-100 via-purple-100 to-pink-100',
      card: 'bg-white/80 backdrop-blur-sm',
      accent: 'from-indigo-400 to-purple-500'
    },
    excited: {
      name: 'High Energy',
      bg: 'from-yellow-200 via-orange-200 to-red-200',
      card: 'bg-white/90 backdrop-blur-sm',
      accent: 'from-orange-400 to-red-500'
    },
    calm: {
      name: 'Zen Mode',
      bg: 'from-blue-100 via-green-100 to-teal-100',
      card: 'bg-white/85 backdrop-blur-sm',
      accent: 'from-blue-400 to-green-500'
    },
    stressed: {
      name: 'Stress Relief',
      bg: 'from-purple-200 via-blue-200 to-indigo-200',
      card: 'bg-white/90 backdrop-blur-sm',
      accent: 'from-purple-400 to-blue-500'
    },
    creative: {
      name: 'Creative Flow',
      bg: 'from-pink-200 via-purple-200 to-indigo-200',
      card: 'bg-white/85 backdrop-blur-sm',
      accent: 'from-pink-400 to-purple-500'
    }
  };

  // Auto-adjust theme based on detected mood
  useEffect(() => {
    if (currentTheme === 'adaptive' && notes.length > 0) {
      const recentNote = notes[0];
      if (recentNote.detectedMood) {
        // Don't actually change theme, just use adaptive colors
      }
    }
  }, [notes, currentTheme]);

  const themes = {
    ...adaptiveThemes,
    pastel: {
      name: 'Pastel Dreams',
      bg: 'from-pink-100 via-purple-100 to-emerald-100',
      card: 'bg-white/80 backdrop-blur-sm',
      accent: 'from-pink-400 to-purple-500'
    },
    dark: {
      name: 'Dark Mode',
      bg: 'from-gray-900 via-purple-900 to-gray-900',
      card: 'bg-gray-800/80 backdrop-blur-sm text-white',
      accent: 'from-purple-400 to-pink-400'
    }
  };

  const moods = [
    { value: 'all', emoji: '🌈', label: 'All Moods' },
    { value: 'excited', emoji: '✨', label: 'Excited' },
    { value: 'calm', emoji: '🌸', label: 'Calm' },
    { value: 'peaceful', emoji: '🕊️', label: 'Peaceful' },
    { value: 'creative', emoji: '🎨', label: 'Creative' },
    { value: 'grateful', emoji: '🙏', label: 'Grateful' },
    { value: 'stressed', emoji: '😓', label: 'Stressed' },
    { value: 'anxious', emoji: '😰', label: 'Anxious' },
    { value: 'energetic', emoji: '⚡', label: 'Energetic' }
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === 'all' || note.mood === selectedMood || note.detectedMood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowAIEditor(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowAIEditor(true);
  };

  const handleSaveNote = (noteData) => {
    // AI mood detection
    const detected = detectMoodFromText(noteData.content);
    const enhancedNoteData = {
      ...noteData,
      detectedMood: detected.mood,
      moodConfidence: detected.confidence,
      aiSummary: generateAISummary(noteData.content),
      contextLocation: getCurrentLocation(),
      stickers: generateContextStickers(detected.mood)
    };

    if (enhancedNoteData._delete) {
      setNotes(notes.filter(note => note.id !== enhancedNoteData.id));
    } else if (editingNote) {
      setNotes(notes.map(note => note.id === editingNote.id ? enhancedNoteData : note));
    } else {
      setNotes([enhancedNoteData, ...notes]);
    }
    setShowAIEditor(false);
  };

  const generateAISummary = (text) => {
    // Simple AI summary generation
    const sentences = text.split('.').filter(s => s.trim().length > 10);
    const keywords = extractKeywords(text);
    
    let summary = '';
    if (sentences.length > 0) {
      summary += `• ${sentences[0].trim()}\n`;
    }
    if (keywords.length > 0) {
      summary += `• Key themes: ${keywords.slice(0, 3).join(', ')}\n`;
    }
    
    return summary || '• Brief note entry';
  };

  const extractKeywords = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'];
    
    return words
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .filter((word, index, arr) => arr.indexOf(word) === index)
      .slice(0, 5);
  };

  const getCurrentLocation = () => {
    // Mock location detection
    const locations = ['home', 'coffee shop', 'office', 'park', 'library', 'café'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const generateContextStickers = (mood) => {
    const stickerSets = {
      excited: ['🚀', '⚡', '🌟', '💥', '🎉'],
      calm: ['🌸', '🍃', '🌊', '☁️', '🌙'],
      stressed: ['😓', '🌊', '🧘', '☕', '🛁'],
      creative: ['🎨', '💡', '✨', '🌈', '🦋'],
      peaceful: ['🕊️', '🌿', '🌺', '🍃', '🌅'],
      energetic: ['⚡', '🔥', '💪', '🏃', '⭐']
    };
    
    const stickers = stickerSets[mood] || stickerSets.calm;
    return [stickers[0], stickers[1]]; // Return 2 random stickers
  };

  const handleToggleFavorite = (noteId) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };

  const handleDeleteNote = (noteId) => {
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const handleVoiceToNote = () => {
    setIsListening(true);
    // Mock voice recognition
    setTimeout(() => {
      const mockTranscription = "I had an amazing day at the coffee shop today. The weather was perfect and I felt so inspired to work on my creative projects.";
      const detected = detectMoodFromText(mockTranscription);
      
      const voiceNote = {
        id: Date.now(),
        title: "Voice Note ✨",
        content: mockTranscription,
        mood: detected.mood,
        detectedMood: detected.mood,
        moodConfidence: detected.confidence,
        category: 'personal',
        tags: ['voice', 'inspiration'],
        isFavorite: false,
        date: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
        aiSummary: generateAISummary(mockTranscription),
        contextLocation: 'coffee shop',
        stickers: generateContextStickers(detected.mood)
      };
      
      setNotes([voiceNote, ...notes]);
      setIsListening(false);
      alert('🎤 Voice note created with AI mood detection!');
    }, 3000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].bg} transition-all duration-500`}>
      {/* Header with AI Features */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/20 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Landing</span>
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">🤖 AI Aesthetic Notes</h1>
            <span className="text-sm text-gray-600">({themes[currentTheme].name})</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Voice Input */}
            <button
              onClick={handleVoiceToNote}
              className={`p-2 rounded-lg transition-all ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'bg-white/50 text-gray-600 hover:bg-white/70'
              }`}
              title="Voice to Note"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Mood Tracker */}
            <button
              onClick={() => setShowMoodTracker(true)}
              className="p-2 rounded-lg bg-white/50 text-gray-600 hover:bg-white/70 transition-all"
              title="Mood Tracker"
            >
              <Brain className="w-4 h-4" />
            </button>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-white/80 transition-all"
              />
            </div>
            
            {/* Theme Selector */}
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-gray-600" />
              <select
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
                className="bg-white/50 border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {Object.entries(themes).map(([key, theme]) => (
                  <option key={key} value={key}>{theme.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* AI Mood Detection Status */}
      {isListening && (
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3">
            <div className="animate-pulse">
              <Mic className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-red-700">🎤 Listening... AI will detect your mood and create a beautiful note!</span>
          </div>
        </div>
      )}

      {/* Enhanced Mood Filter */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700 mr-2">AI Mood Detection:</span>
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all ${
                selectedMood === mood.value
                  ? `bg-gradient-to-r ${themes[currentTheme].accent} text-white shadow-lg`
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rest of component continues... */}
      <main className="max-w-7xl mx-auto px-6 pb-8">
        {/* AI Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className={`${themes[currentTheme].card} rounded-2xl p-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${themes[currentTheme].accent} rounded-xl flex items-center justify-center`}>
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notes.filter(n => n.detectedMood).length}</p>
                <p className="text-sm text-gray-600">AI Analyzed</p>
              </div>
            </div>
          </div>
          
          <div className={`${themes[currentTheme].card} rounded-2xl p-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${themes[currentTheme].accent} rounded-xl flex items-center justify-center`}>
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notes.filter(n => n.isFavorite).length}</p>
                <p className="text-sm text-gray-600">Favorites</p>
              </div>
            </div>
          </div>
          
          <div className={`${themes[currentTheme].card} rounded-2xl p-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${themes[currentTheme].accent} rounded-xl flex items-center justify-center`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notes.filter(n => n.aiSummary).length}</p>
                <p className="text-sm text-gray-600">AI Summaries</p>
              </div>
            </div>
          </div>

          <div className={`${themes[currentTheme].card} rounded-2xl p-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${themes[currentTheme].accent} rounded-xl flex items-center justify-center`}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(notes.map(n => n.contextLocation)).size}</p>
                <p className="text-sm text-gray-600">Locations</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleCreateNote}
            className={`${themes[currentTheme].card} rounded-2xl p-4 shadow-lg hover:scale-105 transition-all group cursor-pointer border-2 border-dashed border-gray-300 hover:border-purple-400`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${themes[currentTheme].accent} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold">AI Note</p>
                <p className="text-sm text-gray-600">Create</p>
              </div>
            </div>
          </button>
        </div>

        {/* Enhanced Notes Grid with AI Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`${themes[currentTheme].card} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer group relative overflow-hidden`}
              onClick={() => handleEditNote(note)}
            >
              {/* AI Mood Confidence Indicator */}
              {note.moodConfidence && (
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs ${
                  note.moodConfidence > 0.8 ? 'bg-green-100 text-green-700' :
                  note.moodConfidence > 0.6 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  AI: {Math.round(note.moodConfidence * 100)}%
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {note.title}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="p-1 rounded transition-colors text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(note.id);
                    }}
                    className={`p-1 rounded transition-colors ${
                      note.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <span className="text-lg">
                    {moods.find(m => m.value === note.detectedMood)?.emoji || 
                     moods.find(m => m.value === note.mood)?.emoji || '✨'}
                  </span>
                </div>
              </div>
              
              {/* AI Summary */}
              {note.aiSummary && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-700">AI Summary</span>
                  </div>
                  <pre className="text-blue-600 whitespace-pre-wrap font-sans">
                    {note.aiSummary}
                  </pre>
                </div>
              )}
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                {note.content}
              </p>
              
              {/* Context & Stickers */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-2">
                  <span className="capitalize bg-gray-100 px-2 py-1 rounded-full">
                    {note.category}
                  </span>
                  {note.contextLocation && (
                    <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                      {note.contextLocation}
                    </span>
                  )}
                </div>
                <span>{note.date}</span>
              </div>

              {/* Stickers */}
              {note.stickers && note.stickers.length > 0 && (
                <div className="flex gap-1 mb-2">
                  {note.stickers.map((sticker, index) => (
                    <span key={index} className="text-lg">{sticker}</span>
                  ))}
                </div>
              )}

              {/* Detected vs Manual Mood */}
              {note.detectedMood && note.detectedMood !== note.mood && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    You: {moods.find(m => m.value === note.mood)?.emoji} {note.mood}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    AI: {moods.find(m => m.value === note.detectedMood)?.emoji} {note.detectedMood}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or mood filter, or create your first AI-powered note!</p>
            <button
              onClick={handleCreateNote}
              className={`bg-gradient-to-r ${themes[currentTheme].accent} text-white px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg`}
            >
              Create AI Note
            </button>
          </div>
        )}
      </main>

      {/* AI Editor Modal */}
      {showAIEditor && (
        <AIEditor
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => setShowAIEditor(false)}
          currentTheme={currentTheme}
        />
      )}

      {/* Mood Tracker Modal */}
      {showMoodTracker && (
        <MoodTracker 
          notes={notes} 
          onClose={() => setShowMoodTracker(false)}
          themes={themes}
          currentTheme={currentTheme}
        />
      )}
    </div>
  );
}

// Mood Tracker Component
function MoodTracker({ notes, onClose, themes, currentTheme }) {
  const getMoodStats = () => {
    const moodCounts = {};
    notes.forEach(note => {
      const mood = note.detectedMood || note.mood;
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    return moodCounts;
  };

  const moodStats = getMoodStats();
  const totalNotes = notes.length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${themes[currentTheme].card} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold">🧠 AI Mood Tracker</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Mood Distribution</h4>
            <div className="space-y-3">
              {Object.entries(moodStats).map(([mood, count]) => {
                const percentage = Math.round((count / totalNotes) * 100);
                return (
                  <div key={mood} className="flex items-center gap-4">
                    <div className="w-20 text-sm capitalize font-medium">
                      {mood}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${themes[currentTheme].accent} h-2 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 w-16">
                      {count} ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Wellness Insights</h4>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
              <p>🌟 Your most common mood: <strong>{Object.keys(moodStats).reduce((a, b) => moodStats[a] > moodStats[b] ? a : b)}</strong></p>
              <p>📊 AI has analyzed <strong>{notes.filter(n => n.detectedMood).length}</strong> of your notes</p>
              <p>💡 Consider reflecting on patterns in your mood changes over time</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-2 bg-gradient-to-r ${themes[currentTheme].accent} text-white rounded-lg hover:scale-105 transition-all shadow-lg`}
            >
              Close Tracker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
