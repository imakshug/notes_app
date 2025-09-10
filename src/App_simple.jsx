import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  console.log('App rendering, count:', count);

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ 
        color: '#1e40af', 
        marginBottom: '20px',
        fontSize: '2.5rem'
      }}>
        React App Working!
      </h1>
      
      <p style={{ 
        color: '#374151', 
        fontSize: '1.2rem',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        If you can see this page and the counter works, React is functioning correctly.
      </p>
      
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#374151', marginBottom: '20px' }}>
          Counter: {count}
        </h2>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => {
              console.log('Increment clicked');
              setCount(count + 1);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            + Increment
          </button>
          
          <button
            onClick={() => {
              console.log('Decrement clicked');
              setCount(count - 1);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            - Decrement
          </button>
          
          <button
            onClick={() => {
              console.log('Reset clicked');
              setCount(0);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reset
          </button>
        </div>
      </div>
      
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#ecfdf5',
        borderRadius: '8px',
        border: '1px solid #d1fae5'
      }}>
        <h3 style={{ color: '#065f46', marginBottom: '15px' }}>System Status</h3>
        <ul style={{ color: '#047857', listStyle: 'none', padding: 0 }}>
          <li>✓ React: Working</li>
          <li>✓ State Management: Working</li>
          <li>✓ Event Handlers: Working</li>
          <li>✓ JavaScript: Working</li>
          <li>✓ CSS Styling: Working</li>
        </ul>
      </div>
      
      <button
        onClick={() => {
          alert('Ready to load the full AI Notes app!\n\nThis basic test proves React is working correctly.\nNow we can safely load the complex components.');
        }}
        style={{
          marginTop: '20px',
          padding: '15px 30px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold'
        }}
      >
        Load AI Notes App
      </button>
    </div>
  );
}
