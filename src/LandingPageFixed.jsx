import { Notebook, Sparkles, CalendarHeart, Plus } from "lucide-react";
import { useState } from "react";

export default function SimpleLandingPageClean({ onStartCreating }) {
  const [activeTheme, setActiveTheme] = useState('pastel');
  const [noteCount, setNoteCount] = useState(4);

  const handleStartCreating = () => {
    console.log('Start Creating button clicked!');
    if (onStartCreating) {
      onStartCreating();
    } else {
      alert('🎨 Ready to start creating amazing notes!');
    }
  };

  const handleSeeThemes = () => {
    console.log('See Themes button clicked!');
    alert('✨ Let me show you all the beautiful themes!');
    document.getElementById('themes-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewNote = () => {
    console.log('New Note button clicked!');
    setNoteCount(prev => prev + 1);
    alert(`📝 New note created! You now have ${noteCount + 1} notes.`);
  };

  const handleThemeSelect = (theme) => {
    setActiveTheme(theme);
    console.log('Theme selected:', theme);
    alert(`🎯 ${theme} theme selected!`);
  };

  const handleNoteClick = (noteTitle) => {
    console.log('Note clicked:', noteTitle);
    alert(`📖 Opening "${noteTitle}" note...`);
  };

  return (
    <main className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-between px-12 bg-gradient-to-br from-pink-100 via-purple-100 to-emerald-100 overflow-hidden">
        {/* Left Side - Text */}
        <div className="max-w-xl z-10">
          <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            Your thoughts,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              beautifully
            </span>
            <br />
            organized
          </h1>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            Create stunning notes with custom themes, mood tracking, and aesthetic layouts that inspire creativity.
          </p>

          <div className="mt-8 flex gap-4">
            <button 
              className="bg-gradient-to-r from-pink-400 to-purple-500 text-white text-lg px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition cursor-pointer"
              onClick={handleStartCreating}
              type="button"
            >
              Start Creating
            </button>
            <button 
              className="border-2 border-purple-400 text-purple-500 px-6 py-3 rounded-2xl hover:bg-purple-50 cursor-pointer"
              onClick={handleSeeThemes}
              type="button"
            >
              See Themes
            </button>
          </div>
        </div>

        {/* Right Side - Mockup */}
        <div className="relative">
          <div className="w-80 h-96 bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-pink-200 rounded-full w-3/4"></div>
              <div className="h-4 bg-purple-200 rounded-full w-full"></div>
              <div className="h-4 bg-emerald-200 rounded-full w-2/3"></div>
              <div className="h-16 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-12 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-900">
          Features that <span className="text-purple-500">inspire</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Themes</h3>
            <p className="text-gray-600">Choose from pastel, dark, retro, and more aesthetic themes.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CalendarHeart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Mood Tracking</h3>
            <p className="text-gray-600">Track your emotions and reflect on your daily experiences.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Notebook className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Beautiful Layouts</h3>
            <p className="text-gray-600">Organize your notes with stunning, customizable layouts.</p>
          </div>
        </div>
      </section>

      {/* Notes Preview Section */}
      <section className="py-24 px-12 bg-gray-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            Your <span className="text-purple-500">Notes</span>
          </h2>
          <button 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-105 transition cursor-pointer" 
            onClick={handleNewNote}
            type="button"
          >
            <Plus className="w-5 h-5" /> New Note
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
          {[
            { color: "bg-pink-200", title: "Brainstorm 💡", text: "Ideas for my new project..." },
            { color: "bg-emerald-200", title: "Shopping List 🛒", text: "Matcha, oat milk, candles" },
            { color: "bg-purple-200", title: "Mood Journal 📝", text: "Today I felt super calm and creative." },
            { color: "bg-yellow-200", title: "Playlist 🎶", text: "Songs that keep me vibing" },
          ].map((note, i) => (
            <div
              key={i}
              className={`${note.color} rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:scale-105 flex flex-col cursor-pointer`}
              onClick={() => handleNoteClick(note.title)}
            >
              <h3 className="font-bold text-lg mb-2 text-gray-800">{note.title}</h3>
              <p className="text-gray-700 flex-grow">{note.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Theme Switcher Preview Section */}
      <section id="themes-section" className="py-24 px-12 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-900">
          Pick Your <span className="text-purple-500">Vibe</span>
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Choose from pastel, dark, retro, or cozy themes to match your mood.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div 
            className="h-48 rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200 shadow-md flex items-center justify-center font-semibold text-gray-800 hover:scale-105 transition cursor-pointer" 
            onClick={() => handleThemeSelect('Pastel')}
          >
            Pastel
          </div>
          <div 
            className="h-48 rounded-2xl bg-gradient-to-br from-gray-900 to-purple-900 shadow-md flex items-center justify-center font-semibold text-white hover:scale-105 transition cursor-pointer" 
            onClick={() => handleThemeSelect('Dark')}
          >
            Dark
          </div>
          <div 
            className="h-48 rounded-2xl bg-gradient-to-br from-yellow-300 to-pink-400 shadow-md flex items-center justify-center font-semibold text-gray-800 hover:scale-105 transition cursor-pointer" 
            onClick={() => handleThemeSelect('Retro')}
          >
            Retro
          </div>
          <div 
            className="h-48 rounded-2xl bg-gradient-to-br from-green-200 to-amber-200 shadow-md flex items-center justify-center font-semibold text-gray-800 hover:scale-105 transition cursor-pointer" 
            onClick={() => handleThemeSelect('Cottagecore')}
          >
            Cottagecore
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 bg-gray-50">
        <p>© 2025 Aesthetic Notes. All rights reserved.</p>
      </footer>
    </main>
  );
}
