import { Notebook, Sparkles, CalendarHeart, Plus } from "lucide-react";
import { useState } from "react";

// Simple Button component - using native button
const Button = ({ children, className = "", variant = "default", onClick, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors px-4 py-2 cursor-pointer";
  const variantClasses = variant === "outline" 
    ? "border border-gray-300 hover:bg-gray-50 text-gray-700" 
    : "bg-blue-600 text-white hover:bg-blue-700";
  
  const handleClick = (e) => {
    console.log('Button clicked, onClick handler:', typeof onClick);
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`} 
      onClick={handleClick}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default function SimpleLandingPage() {
  const [activeTheme, setActiveTheme] = useState('pastel');
  const [noteCount, setNoteCount] = useState(4);

  const handleStartCreating = () => {
    console.log('Start Creating button clicked!');
    alert('🎨 Ready to start creating amazing notes!');
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
    alert(`🎯 ${theme} theme selected!`);
  };

  const handleNoteClick = (noteTitle) => {
    alert(`📖 Opening "${noteTitle}" note...`);
  };

  return (
    <main className="w-full overflow-hidden">
      {/* Test Button */}
      <div className="fixed top-4 left-4 z-50">
        <button 
          onClick={() => alert('TEST BUTTON WORKS!')} 
          className="bg-red-500 text-white p-2 rounded"
          type="button"
        >
          TEST
        </button>
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-between px-12 bg-gradient-to-br from-pink-100 via-purple-100 to-emerald-100 overflow-hidden">
        {/* Left Side - Text */}
        <div className="max-w-xl z-10">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Notes, but make them <span className="text-purple-500">aesthetic ✨</span>
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            A mood-based notes app for Gen Z. Color-coded. Doodle-friendly. Pure vibes.
          </p>

          <div className="mt-6 flex gap-4">
            <button 
              className="bg-gradient-to-r from-pink-400 to-purple-500 text-white text-lg px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
              onClick={handleStartCreating}
              type="button"
            >
              Start Creating
            </button>
            <button 
              className="border-2 border-purple-400 text-purple-500 px-6 py-3 rounded-2xl hover:bg-purple-50"
              onClick={handleSeeThemes}
              type="button"
            >
              See Themes
            </button>
          </div>
        </div>

        {/* Right Side - Mockup */}
        <div className="relative w-96 h-96 bg-white rounded-3xl shadow-2xl border border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-pink-200 rounded-xl h-32"></div>
            <div className="bg-emerald-200 rounded-xl h-32"></div>
            <div className="bg-purple-200 rounded-xl h-32"></div>
            <div className="bg-yellow-200 rounded-xl h-32"></div>
          </div>
        </div>

        {/* Floating Stickers */}
        <span className="absolute top-20 left-10 text-4xl">🌸</span>
        <span className="absolute bottom-24 right-12 text-4xl">🐸</span>
        <span className="absolute top-40 right-1/3 text-3xl">✨</span>
      </section>

      {/* Features Section */}
      <section className="py-24 px-12 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-gray-900">
          Why <span className="text-purple-500">You'll Love It</span>
        </h2>
        <p className="mt-2 text-center text-gray-600 max-w-2xl mx-auto">
          Designed for creativity and vibes. Not just another boring notes app.
        </p>

        <div className="mt-16 grid gap-12 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition hover:scale-105">
            <Notebook className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Mood-Based Notes</h3>
            <p className="mt-2 text-gray-600">Tag each note with a vibe and filter by how you felt when writing it.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition hover:scale-105">
            <Sparkles className="h-12 w-12 text-pink-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Rich + Fun Editing</h3>
            <p className="mt-2 text-gray-600">Highlight in pastels, add doodles, stickers, or emojis to personalize notes.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition hover:scale-105">
            <CalendarHeart className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Daily Recap</h3>
            <p className="mt-2 text-gray-600">Get flashbacks and aesthetic scrapbooks of what you wrote each day.</p>
          </div>
        </div>
      </section>

      {/* Notes Section */}
      <section className="py-24 px-12 bg-gradient-to-br from-purple-50 via-pink-50 to-emerald-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            Your <span className="text-purple-500">Notes</span>
          </h2>
          <button 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-105 transition" 
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
          <div className="h-48 rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200 shadow-md flex items-center justify-center font-semibold text-gray-800 hover:scale-105 transition cursor-pointer" onClick={() => handleThemeSelect('Pastel')}>
            Pastel
          </div>
          <div className="h-48 rounded-2xl bg-gradient-to-br from-gray-900 to-purple-900 shadow-md flex items-center justify-center font-semibold text-white hover:scale-105 transition cursor-pointer" onClick={() => handleThemeSelect('Dark')}>
            Dark
          </div>
          <div className="h-48 rounded-2xl bg-gradient-to-br from-yellow-300 to-pink-400 shadow-md flex items-center justify-center font-semibold text-gray-800 hover:scale-105 transition cursor-pointer" onClick={() => handleThemeSelect('Retro')}>
            Retro
          </div>
          <div className="h-48 rounded-2xl bg-gradient-to-br from-green-200 to-amber-200 shadow-md flex items-center justify-center font-semibold text-gray-800 hover:scale-105 transition cursor-pointer" onClick={() => handleThemeSelect('Cottagecore')}>
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
