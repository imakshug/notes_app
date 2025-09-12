import React from 'react';

function TestApp() {
  console.log('TestApp is rendering!');
  console.log('Current timestamp:', new Date().toISOString());
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial', 
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1>Test App - Basic React Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Notes App Status</h2>
        <ul>
          <li>✅ React is loading</li>
          <li>✅ Vite dev server is running</li>
          <li>🔄 Testing authentication integration...</li>
        </ul>
      </div>
    </div>
  );
}

export default TestApp;