import React, { useState } from 'react';
import SimpleNotesApp from './SimpleNotesApp';

function App() {
  const [currentTheme, setCurrentTheme] = useState({
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
  });

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
  };

  return (
    <div className={`min-h-screen ${currentTheme.appBackground} relative overflow-hidden`}>
      {/* Dynamic background elements */}
      <div className="absolute inset-0">
        {/* Floating elements based on theme */}
        {currentTheme.floatingElements.map((element, index) => (
          <div 
            key={index}
            className={`absolute ${element.position} ${element.size} ${element.animation} ${element.opacity} ${element.delay || ''}`}
          >
            {element.emoji}
          </div>
        ))}
        
        {/* Soft overlay patterns */}
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${currentTheme.overlayGradient}`}></div>
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(34, 139, 34, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <SimpleNotesApp onThemeChange={handleThemeChange} />
      </div>
    </div>
  );
}

export default App;
