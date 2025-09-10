import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { 
  Bold, Italic, Underline, List, ListOrdered, Quote, Code, 
  Image, Heart, Star, Tag, Save, X, Upload, Download, Share2,
  Palette, Type, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

export default function NoteEditor({ note, onSave, onClose, themes, currentTheme }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [mood, setMood] = useState(note?.mood || 'neutral');
  const [category, setCategory] = useState(note?.category || 'personal');
  const [tags, setTags] = useState(note?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isFavorite, setIsFavorite] = useState(note?.isFavorite || false);
  const [imageUrl, setImageUrl] = useState(note?.imageUrl || '');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const moods = [
    { value: 'excited', emoji: '✨', label: 'Excited', color: 'from-yellow-400 to-orange-500' },
    { value: 'calm', emoji: '🌸', label: 'Calm', color: 'from-blue-400 to-purple-500' },
    { value: 'peaceful', emoji: '🕊️', label: 'Peaceful', color: 'from-green-400 to-blue-500' },
    { value: 'creative', emoji: '🎨', label: 'Creative', color: 'from-purple-400 to-pink-500' },
    { value: 'grateful', emoji: '🙏', label: 'Grateful', color: 'from-amber-400 to-orange-500' },
    { value: 'neutral', emoji: '😌', label: 'Neutral', color: 'from-gray-400 to-gray-600' },
    { value: 'energetic', emoji: '⚡', label: 'Energetic', color: 'from-red-400 to-pink-500' },
    { value: 'reflective', emoji: '🤔', label: 'Reflective', color: 'from-indigo-400 to-purple-500' }
  ];

  const categories = [
    { value: 'personal', label: 'Personal', icon: '💝', color: 'bg-pink-100 text-pink-800' },
    { value: 'work', label: 'Work', icon: '💼', color: 'bg-blue-100 text-blue-800' },
    { value: 'journal', label: 'Journal', icon: '📖', color: 'bg-purple-100 text-purple-800' },
    { value: 'ideas', label: 'Ideas', icon: '💡', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'travel', label: 'Travel', icon: '✈️', color: 'bg-green-100 text-green-800' },
    { value: 'goals', label: 'Goals', icon: '🎯', color: 'bg-red-100 text-red-800' },
    { value: 'memories', label: 'Memories', icon: '📸', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'gratitude', label: 'Gratitude', icon: '🌟', color: 'bg-amber-100 text-amber-800' }
  ];

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your thoughts...',
      }),
      Color,
      TextStyle,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (title || content) {
        handleAutoSave();
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, mood, category, tags, isFavorite]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    // Simulate auto-save delay
    setTimeout(() => {
      setIsAutoSaving(false);
      setLastSaved(new Date());
    }, 1000);
  };

  const handleSave = () => {
    const noteData = {
      id: note?.id || Date.now(),
      title: title || 'Untitled Note',
      content,
      mood,
      category,
      tags,
      isFavorite,
      imageUrl,
      date: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };
    
    onSave(noteData);
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(title || 'Untitled Note', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Mood: ${moods.find(m => m.value === mood)?.label || mood}`, 20, 50);
    doc.text(`Category: ${categories.find(c => c.value === category)?.label || category}`, 20, 60);
    doc.text(`Tags: ${tags.join(', ')}`, 20, 70);
    
    // Convert HTML content to plain text for PDF
    const textContent = editor?.getText() || content.replace(/<[^>]*>/g, '');
    const splitText = doc.splitTextToSize(textContent, 170);
    doc.text(splitText, 20, 90);
    
    doc.save(`${title || 'note'}.pdf`);
  };

  const exportToMarkdown = () => {
    const markdown = `# ${title || 'Untitled Note'}

**Mood:** ${moods.find(m => m.value === mood)?.emoji} ${moods.find(m => m.value === mood)?.label || mood}
**Category:** ${categories.find(c => c.value === category)?.icon} ${categories.find(c => c.value === category)?.label || category}
**Tags:** ${tags.map(tag => `#${tag}`).join(' ')}
**Date:** ${new Date().toLocaleDateString()}

---

${editor?.getText() || content.replace(/<[^>]*>/g, '')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'note'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareNote = () => {
    if (navigator.share) {
      navigator.share({
        title: title || 'My Note',
        text: editor?.getText() || content.replace(/<[^>]*>/g, ''),
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${title}\n\n${editor?.getText() || content.replace(/<[^>]*>/g, '')}`);
      alert('Note copied to clipboard!');
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${themes[currentTheme].card} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="text-xl font-bold bg-transparent border-none outline-none placeholder-gray-400 min-w-0 flex-1"
            />
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg transition-colors ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {isAutoSaving && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Saving...
              </span>
            )}
            {lastSaved && (
              <span className="text-xs text-gray-400">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 flex-wrap">
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded ${editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="color"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              title="Text Color"
            />
            <label className="p-2 rounded hover:bg-gray-100 cursor-pointer">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Editor */}
          <div className="flex-1 flex flex-col">
            {imageUrl && (
              <div className="p-4 border-b border-gray-200">
                <img src={imageUrl} alt="Note attachment" className="max-w-full h-32 object-cover rounded-lg" />
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto">
              <EditorContent 
                editor={editor} 
                className="prose prose-sm max-w-none p-6 focus:outline-none min-h-full"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 p-6 overflow-y-auto">
            {/* Mood Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Mood</h3>
              <div className="grid grid-cols-2 gap-2">
                {moods.map((moodOption) => (
                  <button
                    key={moodOption.value}
                    onClick={() => setMood(moodOption.value)}
                    className={`p-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                      mood === moodOption.value
                        ? `bg-gradient-to-r ${moodOption.color} text-white shadow-lg`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{moodOption.emoji}</span>
                    <span className="text-xs">{moodOption.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tag..."
                  className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={exportToPDF}
                className="w-full flex items-center gap-2 p-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
              <button
                onClick={exportToMarkdown}
                className="w-full flex items-center gap-2 p-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export as Markdown
              </button>
              <button
                onClick={shareNote}
                className="w-full flex items-center gap-2 p-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share Note
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {editor.storage.characterCount?.characters() || 0} characters • {editor.storage.characterCount?.words() || 0} words
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r ${themes[currentTheme].accent} text-white rounded-lg hover:scale-105 transition-all shadow-lg`}
            >
              <Save className="w-4 h-4" />
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
