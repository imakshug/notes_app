import { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('test');

  console.log('🔄 App is rendering! Current view:', currentView);

  if (currentView === 'landing') {
    console.log('🎨 Trying to render Landing Page...');
    return (
      <div style={{ padding: '40px', backgroundColor: '#f0f9ff', minHeight: '100vh' }}>
        <h1>Landing Page View</h1>
        <button 
          onClick={() => setCurrentView('test')}
          style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Back to Test
        </button>
        <button 
          onClick={() => setCurrentView('app')}
          style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}
        >
          Go to AI App
        </button>
      </div>
    );
  }

  if (currentView === 'app') {
    console.log('🤖 Trying to render AI App...');
    return (
      <div style={{ padding: '40px', backgroundColor: '#fef3c7', minHeight: '100vh' }}>
        <h1>AI Notes App View</h1>
        <p>This would be your full AI Notes application!</p>
        <button 
          onClick={() => setCurrentView('test')}
          style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Back to Test
        </button>
        <button 
          onClick={() => setCurrentView('landing')}
          style={{ padding: '10px 20px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}
        >
          Back to Landing
        </button>
      </div>
    );
  }

  // Default test view
  console.log('✅ Rendering Test View...');
  return (
    <div style={{ padding: '40px', backgroundColor: '#ecfdf5', minHeight: '100vh' }}>
      <h1 style={{ color: '#059669', marginBottom: '20px' }}>Debug Mode - React Working!</h1>
      
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2>Navigation Test</h2>
        <p>Current View: <strong>{currentView}</strong></p>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            onClick={() => {
              console.log('🚀 Button clicked: Going to Landing');
              setCurrentView('landing');
            }}
            style={{ padding: '15px 30px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Go to Landing Page
          </button>
          
          <button 
            onClick={() => {
              console.log('🚀 Button clicked: Going directly to AI App');
              setCurrentView('app');
            }}
            style={{ padding: '15px 30px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Go directly to AI App
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#dbeafe', padding: '20px', borderRadius: '8px' }}>
        <h3>Debug Info:</h3>
        <ul>
          <li>✅ React is working</li>
          <li>✅ State management working</li>
          <li>✅ Console logs working</li>
          <li>✅ Button clicks working</li>
        </ul>
      </div>
    </div>
  );
}
