import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { AuthProvider } from './AuthContext';
import SimpleNotesApp from './SimpleNotesApp';

function App() {
  console.log('App component is rendering');
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SimpleNotesApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
