import { useState } from 'react';
import LandingPageFixed from './LandingPageFixed.jsx';
import NotesAppAI from './NotesAppAI.jsx';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'app'
  
  console.log('AppRouter loaded, currentView:', currentView); // Debug log

  const navigateToApp = () => {
    setCurrentView('app');
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
  };

  try {
    if (currentView === 'app') {
      return <NotesAppAI onBackToLanding={navigateToLanding} />;
    }

    return <LandingPageFixed onStartCreating={navigateToApp} />;
  } catch (error) {
    console.error('Error in AppRouter:', error);
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>Error Loading App</h1>
        <p>There was an error loading the application. Check the console for details.</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
}
