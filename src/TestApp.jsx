import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎨 Test Page
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Testing if React and CSS are working...
        </p>
        <button 
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition"
          onClick={() => alert('JavaScript is working!')}
        >
          Click Me to Test JS
        </button>
        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="h-20 bg-pink-200 rounded-lg flex items-center justify-center">Pink</div>
          <div className="h-20 bg-blue-200 rounded-lg flex items-center justify-center">Blue</div>
          <div className="h-20 bg-green-200 rounded-lg flex items-center justify-center">Green</div>
          <div className="h-20 bg-yellow-200 rounded-lg flex items-center justify-center">Yellow</div>
        </div>
      </div>
    </div>
  );
}

export default App;
