import { useState } from 'react';
import { Plus, Search, Heart, Star, Calendar, Palette, Settings, ArrowLeft, Filter, Download, Tag, Grid, List, Trash2, X } from 'lucide-react';

export default function NotesAppSimple({ onBackToLanding }) {
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
  const [showSimpleEditor, setShowSimpleEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

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

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === 'all' || note.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowSimpleEditor(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowSimpleEditor(true);
  };

  const handleSaveNote = (noteData) => {
    if (noteData._delete) {
      // Handle deletion
      setNotes(notes.filter(note => note.id !== noteData.id));
    } else if (editingNote) {
      // Update existing note
      setNotes(notes.map(note => note.id === editingNote.id ? noteData : note));
    } else {
      // Add new note
      setNotes([noteData, ...notes]);
    }
    setShowSimpleEditor(false);
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

      {/* Mood Filter */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700 mr-2">Filter by mood:</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    {moods.find(m => m.value === note.mood)?.emoji || '✨'}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {note.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="capitalize bg-gray-100 px-2 py-1 rounded-full">
                  {note.category}
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

      {/* Simple Note Editor Modal */}
      {showSimpleEditor && (
        <SimpleNoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => setShowSimpleEditor(false)}
          themes={themes}
          currentTheme={currentTheme}
        />
      )}
    </div>
  );
}

// Simple Note Editor Component
function SimpleNoteEditor({ note, onSave, onClose, themes, currentTheme }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [mood, setMood] = useState(note?.mood || 'neutral');
  const [category, setCategory] = useState(note?.category || 'personal');

  const moods = [
    { value: 'excited', emoji: '✨', label: 'Excited' },
    { value: 'calm', emoji: '🌸', label: 'Calm' },
    { value: 'peaceful', emoji: '🕊️', label: 'Peaceful' },
    { value: 'creative', emoji: '🎨', label: 'Creative' },
    { value: 'grateful', emoji: '🙏', label: 'Grateful' },
    { value: 'neutral', emoji: '😌', label: 'Neutral' }
  ];

  const categories = [
    { value: 'personal', label: 'Personal', icon: '💝' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'journal', label: 'Journal', icon: '📖' },
    { value: 'ideas', label: 'Ideas', icon: '💡' }
  ];

  const handleSave = () => {
    const noteData = {
      id: note?.id || Date.now(),
      title: title || 'Untitled Note',
      content,
      mood,
      category,
      tags: note?.tags || [],
      isFavorite: note?.isFavorite || false,
      date: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };
    
    onSave(noteData);
  };

  const handleDelete = () => {
    if (note && confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      onSave({ ...note, _delete: true });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${themes[currentTheme].card} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-xl font-bold bg-transparent border-none outline-none placeholder-gray-400 flex-1"
          />
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts..."
            className="w-full h-48 bg-transparent border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
          />

          {/* Mood & Category */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {moods.map((m) => (
                  <option key={m.value} value={m.value}>{m.emoji} {m.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div>
            {note && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Note
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-6 py-2 bg-gradient-to-r ${themes[currentTheme].accent} text-white rounded-lg hover:scale-105 transition-all shadow-lg`}
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
