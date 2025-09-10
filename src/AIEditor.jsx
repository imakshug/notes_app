import { useState, useEffect, useRef } from 'react';
import { X, Save, Wand2, Mic, Camera, MapPin, Palette, Tag, Heart, Brain, Sparkles, Download, Share, Magic, Volume2, Image as ImageIcon, Smile } from 'lucide-react';

export default function AIEditor({ note, onSave, onClose, currentTheme }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [mood, setMood] = useState(note?.mood || 'calm');
  const [category, setCategory] = useState(note?.category || 'personal');
  const [tags, setTags] = useState(note?.tags || []);
  const [isFavorite, setIsFavorite] = useState(note?.isFavorite || false);
  const [isListening, setIsListening] = useState(false);
  const [aiExpansion, setAiExpansion] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [customStickers, setCustomStickers] = useState(note?.stickers || []);
  const [theme] = useState(note?.theme || currentTheme);
  const [isPrivate, setIsPrivate] = useState(note?.isPrivate || false);
  
  const textareaRef = useRef(null);

  const moods = [
    { value: 'excited', emoji: '✨', label: 'Excited', color: 'from-yellow-400 to-orange-500' },
    { value: 'calm', emoji: '🌸', label: 'Calm', color: 'from-blue-400 to-green-500' },
    { value: 'creative', emoji: '🎨', label: 'Creative', color: 'from-purple-400 to-pink-500' },
    { value: 'grateful', emoji: '🙏', label: 'Grateful', color: 'from-emerald-400 to-blue-500' },
    { value: 'stressed', emoji: '😓', label: 'Stressed', color: 'from-red-400 to-purple-500' },
    { value: 'peaceful', emoji: '🕊️', label: 'Peaceful', color: 'from-teal-400 to-blue-500' },
    { value: 'energetic', emoji: '⚡', label: 'Energetic', color: 'from-orange-400 to-red-500' },
    { value: 'reflective', emoji: '🤔', label: 'Reflective', color: 'from-indigo-400 to-purple-500' }
  ];

  const categories = [
    { value: 'personal', icon: '👤', label: 'Personal' },
    { value: 'work', icon: '💼', label: 'Work' },
    { value: 'creative', icon: '🎨', label: 'Creative' },
    { value: 'journal', icon: '📔', label: 'Journal' },
    { value: 'ideas', icon: '💡', label: 'Ideas' },
    { value: 'goals', icon: '🎯', label: 'Goals' },
    { value: 'memories', icon: '📸', label: 'Memories' },
    { value: 'quotes', icon: '💬', label: 'Quotes' }
  ];

  const stickerPacks = {
    emotions: ['😊', '🥺', '😍', '🤔', '😴', '🤪', '😎', '🥰'],
    nature: ['🌸', '🍃', '🌙', '⭐', '🌊', '🌺', '🦋', '🌈'],
    activities: ['☕', '📚', '🎵', '🏃', '🧘', '✈️', '🎭', '🎨'],
    symbols: ['✨', '💫', '🔥', '💎', '🌟', '⚡', '💜', '🖤'],
    food: ['🍃', '🍯', '🧋', '🍰', '🍓', '🥐', '🫖', '🧁'],
    objects: ['💻', '📱', '🎧', '📷', '🕯️', '🌱', '📝', '🎪']
  };

  const dynamicThemes = {
    excited: { bg: 'from-yellow-200 via-orange-200 to-red-200', accent: 'from-orange-400 to-red-500' },
    calm: { bg: 'from-blue-100 via-green-100 to-teal-100', accent: 'from-blue-400 to-green-500' },
    creative: { bg: 'from-pink-200 via-purple-200 to-indigo-200', accent: 'from-pink-400 to-purple-500' },
    stressed: { bg: 'from-purple-200 via-blue-200 to-indigo-200', accent: 'from-purple-400 to-blue-500' },
    peaceful: { bg: 'from-green-100 via-teal-100 to-blue-100', accent: 'from-teal-400 to-blue-500' }
  };

  // AI-powered mood detection
  const detectMoodFromText = (text) => {
    const moodKeywords = {
      excited: ['excited', 'amazing', 'awesome', 'fantastic', 'thrilled', 'pumped', 'energy'],
      happy: ['happy', 'joy', 'cheerful', 'delighted', 'pleased', 'content', 'smile'],
      calm: ['calm', 'peaceful', 'serene', 'relaxed', 'tranquil', 'zen', 'quiet'],
      stressed: ['stressed', 'overwhelmed', 'pressure', 'deadlines', 'anxiety', 'worried', 'busy'],
      creative: ['creative', 'inspired', 'innovative', 'artistic', 'imaginative', 'ideas', 'vision'],
      grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'fortunate', 'lucky', 'grateful']
    };

    const words = text.toLowerCase().split(/\s+/);
    let maxScore = 0;
    let detectedMood = 'calm';

    Object.entries(moodKeywords).forEach(([mood, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        return acc + words.filter(word => word.includes(keyword)).length;
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        detectedMood = mood;
      }
    });

    return { mood: detectedMood, confidence: Math.min(0.6 + (maxScore * 0.1), 0.95) };
  };

  // Auto-detect mood when content changes
  useEffect(() => {
    if (content.length > 20) {
      const detected = detectMoodFromText(content);
      if (detected.confidence > 0.7) {
        setMood(detected.mood);
      }
    }
  }, [content]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (title.trim() || content.trim()) {
        console.log('Auto-saving...'); // In real app, this would save to backend
      }
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [title, content]);

  const handleTextSelection = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);
      if (selected.trim()) {
        setSelectedText(selected);
      }
    }
  };

  const expandIdea = () => {
    const expansions = [
      `💡 Building on "${selectedText}": Consider exploring how this connects to current trends or emerging opportunities in this space.`,
      `🌟 From "${selectedText}": This could be the foundation for something bigger. What if you took this concept and applied it to a different context?`,
      `🚀 Expanding "${selectedText}": The deeper implications here suggest there's room to develop this into multiple related ideas or projects.`,
      `🎯 Regarding "${selectedText}": The core insight here has potential. Consider what evidence or examples would strengthen this perspective.`,
      `🌈 Related to "${selectedText}": This connects to broader themes of innovation, creativity, and human potential. How might you explore these connections?`
    ];
    
    const randomExpansion = expansions[Math.floor(Math.random() * expansions.length)];
    setAiExpansion(randomExpansion);
  };

  const generateSummary = () => {
    const sentences = content.split('.').filter(s => s.trim().length > 10);
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    const summary = `📊 AI Analysis:
• ${sentences.length} key points
• ${wordCount} words (~${readingTime} min read)
• Mood: ${mood} (AI detected)
• Themes: ${extractThemes(content).join(', ')}`;
    
    setAiExpansion(summary);
  };

  const extractThemes = (text) => {
    const themes = {
      productivity: ['work', 'productivity', 'goals', 'achievement', 'success'],
      wellness: ['health', 'mental', 'wellness', 'self-care', 'mindfulness'],
      relationships: ['family', 'friends', 'love', 'relationships', 'social'],
      creativity: ['art', 'creative', 'design', 'inspiration', 'innovative'],
      learning: ['learn', 'study', 'knowledge', 'education', 'growth']
    };
    
    const words = text.toLowerCase().split(/\s+/);
    const foundThemes = [];
    
    Object.entries(themes).forEach(([theme, keywords]) => {
      if (keywords.some(keyword => words.some(word => word.includes(keyword)))) {
        foundThemes.push(theme);
      }
    });
    
    return foundThemes.slice(0, 3);
  };

  const voiceToText = () => {
    setIsListening(true);
    // Mock voice recognition - in real app would use Web Speech API
    setTimeout(() => {
      const mockTranscriptions = [
        "I'm feeling really inspired today and want to capture this creative energy in my notes.",
        "Had an amazing conversation with a friend about future possibilities and dreams.",
        "Feeling a bit overwhelmed with everything on my plate, but trying to stay positive.",
        "Beautiful morning walk gave me so many ideas for my upcoming project."
      ];
      
      const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      setContent(content + (content ? ' ' : '') + transcription);
      setIsListening(false);
    }, 3000);
  };

  const addImagePlaceholder = () => {
    setContent(content + '\n\n📸 [Image: Add description here]\n\n');
  };

  const getCurrentLocation = () => {
    // Mock location - in real app would use Geolocation API
    const locations = ['Coffee Shop ☕', 'Home 🏠', 'Park 🌳', 'Library 📚', 'Office 🏢'];
    const location = locations[Math.floor(Math.random() * locations.length)];
    setContent(content + `\n📍 Location: ${location}\n`);
  };

  const addCustomSticker = (sticker) => {
    if (!customStickers.includes(sticker)) {
      setCustomStickers([...customStickers, sticker]);
    }
  };

  const removeCustomSticker = (sticker) => {
    setCustomStickers(customStickers.filter(s => s !== sticker));
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const exportToPDF = () => {
    alert('📄 Exporting to PDF... (Feature coming soon!)');
  };

  const exportToMarkdown = () => {
    const markdown = `# ${title}\n\n${content}\n\n---\n*Mood: ${mood} | Category: ${category} | Tags: ${tags.join(', ')}*`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareNote = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${title}\n\n${content}`);
      alert('📋 Note copied to clipboard!');
    }
  };

  const handleSave = () => {
    const noteData = {
      id: note?.id || Date.now(),
      title: title.trim() || 'Untitled Note',
      content,
      mood,
      category,
      tags,
      isFavorite,
      theme,
      stickers: customStickers,
      isPrivate,
      date: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };
    
    onSave(noteData);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      onSave({ ...note, _delete: true });
    }
  };

  const currentMoodTheme = dynamicThemes[mood] || dynamicThemes.calm;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-gradient-to-br ${currentMoodTheme.bg} rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300`}>
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-gray-900">
              {note ? '✨ Edit AI Note' : '🤖 Create AI Note'}
            </h3>
            {isPrivate && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                🔒 Secret Mode
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Auto-save indicator */}
            <span className="text-xs text-gray-600 bg-white/50 px-2 py-1 rounded-full">
              ✅ Auto-save enabled
            </span>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-140px)]">
          {/* Main Editor */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Title */}
            <input
              type="text"
              placeholder="✨ What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-500 text-gray-900 mb-4"
            />

            {/* AI Expansion Panel */}
            {aiExpansion && (
              <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-700">AI Assistant</span>
                  </div>
                  <button onClick={() => setAiExpansion('')} className="text-blue-400 hover:text-blue-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-blue-700 text-sm whitespace-pre-wrap">{aiExpansion}</p>
              </div>
            )}

            {/* Voice Recording Indicator */}
            {isListening && (
              <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="animate-pulse">
                    <Mic className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-red-700">🎤 Listening... Speak naturally and AI will enhance your note!</span>
                </div>
              </div>
            )}

            {/* Content */}
            <textarea
              ref={textareaRef}
              placeholder="Start typing... AI will detect your mood and suggest enhancements ✨"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onSelect={handleTextSelection}
              className="w-full h-64 bg-transparent border-none outline-none resize-none placeholder-gray-500 text-gray-800 leading-relaxed"
            />

            {/* Custom Stickers */}
            {customStickers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 p-3 bg-white/50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Stickers:</span>
                {customStickers.map((sticker, index) => (
                  <button
                    key={index}
                    onClick={() => removeCustomSticker(sticker)}
                    className="text-xl hover:scale-110 transition-transform"
                    title="Click to remove"
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    onClick={() => removeTag(tag)}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-purple-200 transition-colors"
                  >
                    #{tag} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* AI Tools Sidebar */}
          <div className="w-80 bg-white/20 backdrop-blur-sm border-l border-white/20 p-6 overflow-y-auto">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Tools & Features
            </h4>

            {/* Quick AI Actions */}
            <div className="space-y-3 mb-6">
              <button
                onClick={voiceToText}
                disabled={isListening}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isListening 
                    ? 'bg-red-100 text-red-700 cursor-not-allowed' 
                    : 'bg-white/50 hover:bg-white/70 text-gray-700'
                }`}
              >
                <Mic className="w-4 h-4" />
                {isListening ? 'Listening...' : 'Voice to Text'}
              </button>

              <button
                onClick={addImagePlaceholder}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/70 text-gray-700 transition-all"
              >
                <Camera className="w-4 h-4" />
                Add Image
              </button>

              <button
                onClick={getCurrentLocation}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/70 text-gray-700 transition-all"
              >
                <MapPin className="w-4 h-4" />
                Add Location
              </button>
            </div>

            {/* Text Enhancement */}
            {selectedText && (
              <div className="mb-6 p-4 bg-yellow-50/80 rounded-xl border border-yellow-200">
                <h5 className="font-medium text-yellow-800 mb-2">Selected: "{selectedText.substring(0, 30)}..."</h5>
                <div className="space-y-2">
                  <button
                    onClick={expandIdea}
                    className="w-full flex items-center gap-2 p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm transition-colors"
                  >
                    <Wand2 className="w-4 h-4" />
                    Expand Idea
                  </button>
                  <button
                    onClick={generateSummary}
                    className="w-full flex items-center gap-2 p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm transition-colors"
                  >
                    <Brain className="w-4 h-4" />
                    AI Summary
                  </button>
                </div>
              </div>
            )}

            {/* Mood Selection */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-3">🎭 Mood (Auto-detected)</h5>
              <div className="grid grid-cols-2 gap-2">
                {moods.map((moodOption) => (
                  <button
                    key={moodOption.value}
                    onClick={() => setMood(moodOption.value)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
                      mood === moodOption.value
                        ? `bg-gradient-to-r ${moodOption.color} text-white shadow-lg`
                        : 'bg-white/50 hover:bg-white/70 text-gray-700'
                    }`}
                  >
                    <span>{moodOption.emoji}</span>
                    <span>{moodOption.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-3">📁 Category</h5>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
                      category === cat.value
                        ? `bg-gradient-to-r ${currentMoodTheme.accent} text-white shadow-lg`
                        : 'bg-white/50 hover:bg-white/70 text-gray-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sticker Marketplace */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-3">✨ Sticker Packs</h5>
              <div className="space-y-3">
                {Object.entries(stickerPacks).map(([packName, stickers]) => (
                  <div key={packName}>
                    <h6 className="text-xs font-medium text-gray-600 mb-1 capitalize">{packName}</h6>
                    <div className="grid grid-cols-8 gap-1">
                      {stickers.map((sticker, index) => (
                        <button
                          key={index}
                          onClick={() => addCustomSticker(sticker)}
                          className="text-lg hover:scale-110 transition-transform bg-white/30 hover:bg-white/50 rounded-lg p-1"
                          title={`Add ${sticker}`}
                        >
                          {sticker}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Settings */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-3">🔒 Privacy & Settings</h5>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                    className="rounded"
                  />
                  <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                  <span className="text-sm">Add to Favorites</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">🔒 Secret Note Mode</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Export Options */}
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-3 py-2 bg-white/50 hover:bg-white/70 text-gray-700 rounded-lg text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            
            <button
              onClick={exportToMarkdown}
              className="flex items-center gap-2 px-3 py-2 bg-white/50 hover:bg-white/70 text-gray-700 rounded-lg text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Markdown
            </button>
            
            <button
              onClick={shareNote}
              className="flex items-center gap-2 px-3 py-2 bg-white/50 hover:bg-white/70 text-gray-700 rounded-lg text-sm transition-all"
            >
              <Share className="w-4 h-4" />
              Share
            </button>
          </div>

          <div className="flex items-center gap-3">
            {note && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-all"
              >
                Delete
              </button>
            )}
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/50 hover:bg-white/70 text-gray-700 rounded-lg transition-all"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              className={`px-6 py-2 bg-gradient-to-r ${currentMoodTheme.accent} text-white rounded-lg hover:scale-105 transition-all shadow-lg flex items-center gap-2`}
            >
              <Save className="w-4 h-4" />
              Save AI Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
