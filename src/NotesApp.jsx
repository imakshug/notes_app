import { useState } from 'react';
import { Plus, Search, Heart, Star, Calendar, Palette, Settings, ArrowLeft, Filter, Download, Tag, Grid, List } from 'lucide-react';
import NoteEditor from './NoteEditor.jsx';

export default function NotesApp({ onBackToLanding }) {
  const [notes, setNotes] = useState([
    { 
      id: 1, 
      title: "Brainstorm 💡", 
      content: "Ideas for my new project...", 
      mood: "excited", 
      theme: "pink",
      date: "2025-01-15",
      category: "work",
      tags: ["ideas", "project"],
      isFavorite: true,
      updatedAt: "2025-01-15T10:30:00Z"
    },
    { 
      id: 2, 
      title: "Shopping List 🛒", 
      content: "Matcha, oat milk, candles, succulents", 
      mood: "calm", 
      theme: "emerald",
      date: "2025-01-14",
      category: "personal",
      tags: ["shopping", "lifestyle"],
      isFavorite: false,
      updatedAt: "2025-01-14T15:20:00Z"
    },
    { 
      id: 3, 
      title: "Mood Journal 📝", 
      content: "Today I felt super calm and creative. The weather was perfect for a walk in the park.", 
      mood: "peaceful", 
      theme: "purple",
      date: "2025-01-13",
      category: "journal",
      tags: ["mood", "reflection", "nature"],
      isFavorite: true,
      updatedAt: "2025-01-13T20:45:00Z"
    }
  ]);

  const [currentTheme, setCurrentTheme] = useState('pastel');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('updatedAt'); // 'updatedAt', 'title', 'mood'

  const themes = {
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
    },
    retro: {
      name: 'Retro Vibes',
      bg: 'from-yellow-200 via-orange-200 to-pink-300',
      card: 'bg-amber-50/80 backdrop-blur-sm',
      accent: 'from-orange-400 to-pink-400'
    },
    cottagecore: {
      name: 'Cottagecore',
      bg: 'from-green-100 via-amber-100 to-green-200',
      card: 'bg-amber-50/80 backdrop-blur-sm',
      accent: 'from-green-400 to-amber-400'
    }
  };

  const moods = [
    { value: 'all', emoji: '🌈', label: 'All Moods' },
    { value: 'excited', emoji: '✨', label: 'Excited' },
    { value: 'calm', emoji: '🌸', label: 'Calm' },
    { value: 'peaceful', emoji: '🕊️', label: 'Peaceful' },
    { value: 'creative', emoji: '🎨', label: 'Creative' },
    { value: 'grateful', emoji: '🙏', label: 'Grateful' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🌈' },
    { value: 'personal', label: 'Personal', icon: '💝' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'journal', label: 'Journal', icon: '📖' },
    { value: 'ideas', label: 'Ideas', icon: '💡' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'goals', label: 'Goals', icon: '🎯' },
    { value: 'memories', label: 'Memories', icon: '📸' },
    { value: 'gratitude', label: 'Gratitude', icon: '🌟' }
  ];

  // Get all unique tags from notes
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === 'all' || note.mood === selectedMood;
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesTag = selectedTag === 'all' || (note.tags && note.tags.includes(selectedTag));
    const matchesFavorite = !showFavoritesOnly || note.isFavorite;
    
    return matchesSearch && matchesMood && matchesCategory && matchesTag && matchesFavorite;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'mood':
        return a.mood.localeCompare(b.mood);
      case 'updatedAt':
      default:
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleSaveNote = (noteData) => {
    if (editingNote) {
      // Update existing note
      setNotes(notes.map(note => note.id === editingNote.id ? noteData : note));
    } else {
      // Add new note
      setNotes([noteData, ...notes]);
    }
  };

  const handleDeleteNote = (noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const handleToggleFavorite = (noteId) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].bg} transition-all duration-500`}>
      {/* Header */}
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
            <h1 className="text-2xl font-bold text-gray-900">✨ Aesthetic Notes</h1>
            <span className="text-sm text-gray-600">({themes[currentTheme].name})</span>
          </div>
          
          <div className="flex items-center gap-4">
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
                onChange={(e) => handleThemeChange(e.target.value)}
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

      {/* Mood Filter */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Mood:</span>
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
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/50 border border-white/30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Tag:</span>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-white/50 border border-white/30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>#{tag}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all ${
              showFavoritesOnly
                ? 'bg-red-100 text-red-700'
                : 'bg-white/50 text-gray-700 hover:bg-white/70'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            <span>Favorites</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/50 border border-white/30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="updatedAt">Latest First</option>
              <option value="title">A-Z</option>
              <option value="mood">By Mood</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`${themes[currentTheme].card} rounded-2xl p-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${themes[currentTheme].accent} rounded-xl flex items-center justify-center`}>
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notes.length}</p>
                <p className="text-sm text-gray-600">Total Notes</p>
              </div>
            </div>
          </div>
          
          <div className={`${themes[currentTheme].card} rounded-2xl p-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${themes[currentTheme].accent} rounded-xl flex items-center justify-center`}>
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredNotes.length}</p>
                <p className="text-sm text-gray-600">Filtered</p>
              </div>
            </div>
          </div>
          
          <div className={`${themes[currentTheme].card} rounded-2xl p-4 shadow-lg`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${themes[currentTheme].accent} rounded-xl flex items-center justify-center`}>
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">Today</p>
                <p className="text-sm text-gray-600">Last Updated</p>
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
                <p className="text-lg font-bold">New Note</p>
                <p className="text-sm text-gray-600">Create</p>
              </div>
            </div>
          </button>
        </div>

        {/* Notes Grid */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'} gap-6`}>
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`${themes[currentTheme].card} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer group relative`}
              onClick={() => handleEditNote(note)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {note.title}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(note.id);
                    }}
                    className={`p-1 rounded transition-colors ${
                      note.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <span className="text-lg">
                    {moods.find(m => m.value === note.mood)?.emoji || '✨'}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: note.content.replace(/<[^>]*>/g, '') }}>
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="capitalize bg-gray-100 px-2 py-1 rounded-full">
                  {categories.find(c => c.value === note.category)?.icon} {note.category}
                </span>
                <span>{note.date}</span>
              </div>

              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{note.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or mood filter</p>
            <button
              onClick={handleCreateNote}
              className={`bg-gradient-to-r ${themes[currentTheme].accent} text-white px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg`}
            >
              Create your first note
            </button>
          </div>
        )}
      </main>

      {/* Note Editor */}
      {showEditor && (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => setShowEditor(false)}
          themes={themes}
          currentTheme={currentTheme}
        />
      )}
    </div>
  );
}
