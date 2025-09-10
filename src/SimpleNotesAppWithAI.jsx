import { useState } from 'react';

// AI Mood Detection Function
const detectMoodFromText = (text) => {
  const content = text.toLowerCase();
  
  // Mood keywords and their associated moods
  const moodPatterns = {
    happy: ['happy', 'excited', 'joy', 'amazing', 'wonderful', 'great', 'awesome', 'fantastic', 'love', 'thrilled', 'delighted', 'cheerful', 'elated'],
    sad: ['sad', 'depressed', 'crying', 'tears', 'miserable', 'heartbroken', 'devastated', 'gloomy', 'melancholy', 'sorrow', 'grief', 'upset', 'down'],
    angry: ['angry', 'furious', 'mad', 'rage', 'irritated', 'frustrated', 'annoyed', 'pissed', 'livid', 'outraged', 'infuriated'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'fear', 'scared', 'overwhelmed', 'tense', 'uneasy', 'troubled'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen', 'meditative', 'quiet', 'still', 'composed'],
    excited: ['excited', 'pumped', 'energetic', 'enthusiastic', 'hyped', 'thrilled', 'eager', 'passionate', 'motivated'],
    grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'gratitude', 'fortunate', 'lucky'],
    confused: ['confused', 'lost', 'uncertain', 'unclear', 'puzzled', 'bewildered', 'perplexed'],
    tired: ['tired', 'exhausted', 'sleepy', 'weary', 'drained', 'fatigue', 'worn out'],
    hopeful: ['hopeful', 'optimistic', 'positive', 'bright', 'promising', 'confident', 'faith']
  };
  
  let detectedMood = 'neutral';
  let highestScore = 0;
  
  // Check each mood pattern
  for (const [mood, keywords] of Object.entries(moodPatterns)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (content.includes(keyword)) {
        score += 1;
        // Give extra weight to exact word matches
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = content.match(regex);
        if (matches) {
          score += matches.length * 0.5;
        }
      }
    });
    
    if (score > highestScore) {
      highestScore = score;
      detectedMood = mood;
    }
  }
  
  // Return mood with confidence level
  return {
    mood: detectedMood,
    confidence: Math.min(highestScore * 0.3, 0.95), // Scale confidence
    keywords: highestScore > 0 ? moodPatterns[detectedMood].filter(k => content.includes(k)) : []
  };
};

// Mood colors and emojis
const getMoodStyle = (mood) => {
  const styles = {
    happy: { color: '#f59e0b', emoji: '😊', bg: '#fef3c7' },
    sad: { color: '#3b82f6', emoji: '😢', bg: '#dbeafe' },
    angry: { color: '#ef4444', emoji: '😠', bg: '#fee2e2' },
    anxious: { color: '#8b5cf6', emoji: '😰', bg: '#ede9fe' },
    calm: { color: '#10b981', emoji: '😌', bg: '#d1fae5' },
    excited: { color: '#f97316', emoji: '🤩', bg: '#fed7aa' },
    grateful: { color: '#ec4899', emoji: '🙏', bg: '#fce7f3' },
    confused: { color: '#6b7280', emoji: '😕', bg: '#f3f4f6' },
    tired: { color: '#64748b', emoji: '😴', bg: '#f1f5f9' },
    hopeful: { color: '#06b6d4', emoji: '🌟', bg: '#cffafe' },
    neutral: { color: '#6b7280', emoji: '😐', bg: '#f9fafb' }
  };
  return styles[mood] || styles.neutral;
};

export default function SimpleNotesApp() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Welcome Note 🎉",
      content: "Welcome to your AI Notes App! This is a simplified version to test functionality.",
      mood: "happy",
      date: "2025-09-09"
    }
  ]);

  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const handleCreateNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      // AI Mood Detection
      const fullText = `${newNote.title} ${newNote.content}`;
      const moodAnalysis = detectMoodFromText(fullText);
      
      const note = {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content,
        mood: moodAnalysis.mood,
        detectedMood: moodAnalysis.mood,
        moodConfidence: moodAnalysis.confidence,
        detectedKeywords: moodAnalysis.keywords,
        date: new Date().toISOString().split('T')[0],
        aiAnalysis: `AI detected "${moodAnalysis.mood}" mood with ${Math.round(moodAnalysis.confidence * 100)}% confidence`
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '' });
      setIsCreatingNote(false);
      
      // Show AI feedback
      console.log('🧠 AI Analysis:', moodAnalysis);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          margin: 0, 
          color: '#1e293b',
          fontSize: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🧠 AI Notes App
          <span style={{ fontSize: '1rem', color: '#64748b' }}>
            ({notes.length} notes)
          </span>
        </h1>
      </div>

      {/* Create Note Button */}
      {!isCreatingNote && (
        <button
          onClick={() => setIsCreatingNote(true)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ➕ Create New Note
        </button>
      )}

      {/* Create Note Form */}
      {isCreatingNote && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Create New Note</h3>
          
          <input
            type="text"
            placeholder="Note title..."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '12px',
              boxSizing: 'border-box'
            }}
          />
          
          <textarea
            placeholder="Write your note content... (AI will detect your mood automatically!)"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px',
              minHeight: '120px',
              marginBottom: '12px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          
          {/* Real-time mood preview */}
          {newNote.content.trim() && (
            <div style={{
              padding: '10px',
              backgroundColor: '#f1f5f9',
              borderRadius: '6px',
              marginBottom: '12px',
              fontSize: '14px',
              color: '#475569'
            }}>
              🧠 AI Preview: {(() => {
                const preview = detectMoodFromText(`${newNote.title} ${newNote.content}`);
                const moodStyle = getMoodStyle(preview.mood);
                return (
                  <span style={{ color: moodStyle.color, fontWeight: 'bold' }}>
                    {moodStyle.emoji} {preview.mood} mood detected
                    {preview.confidence > 0.3 && ` (${Math.round(preview.confidence * 100)}% confident)`}
                  </span>
                );
              })()}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleCreateNote}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Save Note
            </button>
            <button
              onClick={() => {
                setIsCreatingNote(false);
                setNewNote({ title: '', content: '' });
              }}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {notes.map(note => {
          const moodStyle = getMoodStyle(note.mood);
          return (
            <div
              key={note.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: `2px solid ${moodStyle.color}20`,
                borderLeft: `6px solid ${moodStyle.color}`
              }}
            >
              <h3 style={{
                margin: '0 0 12px 0',
                color: '#1e293b',
                fontSize: '1.2rem'
              }}>
                {note.title}
              </h3>
              
              <p style={{
                color: '#475569',
                lineHeight: '1.6',
                margin: '0 0 15px 0'
              }}>
                {note.content}
              </p>
              
              {/* AI Analysis Display */}
              {note.aiAnalysis && (
                <div style={{
                  backgroundColor: moodStyle.bg,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  fontSize: '13px',
                  color: moodStyle.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  🧠 {note.aiAnalysis}
                </div>
              )}
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                color: '#64748b'
              }}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  color: moodStyle.color,
                  fontWeight: 'bold'
                }}>
                  {moodStyle.emoji} {note.mood}
                </span>
                <span>{note.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      {notes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#64748b'
        }}>
          <h3>No notes yet!</h3>
          <p>Click "Create New Note" to get started with AI mood detection.</p>
        </div>
      )}
    </div>
  );
}
