import { useState } from 'react';

// AI Mood Detection Function
const detectMoodFromText = (text) => {
  const content = text.toLowerCase();
  
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
  
  for (const [mood, keywords] of Object.entries(moodPatterns)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (content.includes(keyword)) {
        score += 1;
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
  
  return {
    mood: detectedMood,
    confidence: Math.min(highestScore * 0.3, 0.95),
    keywords: highestScore > 0 ? moodPatterns[detectedMood].filter(k => content.includes(k)) : []
  };
};

// Beautiful mood themes
const getMoodTheme = (mood) => {
  const themes = {
    happy: { 
      gradient: 'linear-gradient(135deg, #FFE17D 0%, #FFCD69 50%, #FFA726 100%)',
      shadow: '0 8px 32px rgba(255, 167, 38, 0.3)',
      emoji: '😊',
      color: '#E65100',
      bg: '#FFF8E1'
    },
    sad: { 
      gradient: 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 50%, #2196F3 100%)',
      shadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
      emoji: '😢',
      color: '#1565C0',
      bg: '#E3F2FD'
    },
    angry: { 
      gradient: 'linear-gradient(135deg, #EF5350 0%, #F44336 50%, #E53935 100%)',
      shadow: '0 8px 32px rgba(244, 67, 54, 0.3)',
      emoji: '😠',
      color: '#C62828',
      bg: '#FFEBEE'
    },
    anxious: { 
      gradient: 'linear-gradient(135deg, #BA68C8 0%, #AB47BC 50%, #9C27B0 100%)',
      shadow: '0 8px 32px rgba(156, 39, 176, 0.3)',
      emoji: '😰',
      color: '#6A1B9A',
      bg: '#F3E5F5'
    },
    calm: { 
      gradient: 'linear-gradient(135deg, #81C784 0%, #66BB6A 50%, #4CAF50 100%)',
      shadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
      emoji: '😌',
      color: '#2E7D32',
      bg: '#E8F5E8'
    },
    excited: { 
      gradient: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 50%, #FF5722 100%)',
      shadow: '0 8px 32px rgba(255, 87, 34, 0.3)',
      emoji: '🤩',
      color: '#D84315',
      bg: '#FBE9E7'
    },
    grateful: { 
      gradient: 'linear-gradient(135deg, #F06292 0%, #EC407A 50%, #E91E63 100%)',
      shadow: '0 8px 32px rgba(233, 30, 99, 0.3)',
      emoji: '🙏',
      color: '#AD1457',
      bg: '#FCE4EC'
    },
    confused: { 
      gradient: 'linear-gradient(135deg, #90A4AE 0%, #78909C 50%, #607D8B 100%)',
      shadow: '0 8px 32px rgba(96, 125, 139, 0.3)',
      emoji: '😕',
      color: '#37474F',
      bg: '#ECEFF1'
    },
    tired: { 
      gradient: 'linear-gradient(135deg, #A1887F 0%, #8D6E63 50%, #795548 100%)',
      shadow: '0 8px 32px rgba(121, 85, 72, 0.3)',
      emoji: '😴',
      color: '#4E342E',
      bg: '#EFEBE9'
    },
    hopeful: { 
      gradient: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 50%, #03A9F4 100%)',
      shadow: '0 8px 32px rgba(3, 169, 244, 0.3)',
      emoji: '🌟',
      color: '#0277BD',
      bg: '#E1F5FE'
    },
    neutral: { 
      gradient: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 50%, #9E9E9E 100%)',
      shadow: '0 8px 32px rgba(158, 158, 158, 0.2)',
      emoji: '😐',
      color: '#424242',
      bg: '#FAFAFA'
    }
  };
  return themes[mood] || themes.neutral;
};

export default function BeautifulNotesApp() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Welcome to Your AI Notes! ✨",
      content: "This is your beautiful, intelligent notes app that understands your emotions. Write anything and watch the magic happen!",
      mood: "happy",
      date: "2025-09-09"
    }
  ]);

  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const fullText = `${newNote.title} ${newNote.content}`;
      const moodAnalysis = detectMoodFromText(fullText);
      
      const note = {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content,
        mood: moodAnalysis.mood,
        moodConfidence: moodAnalysis.confidence,
        detectedKeywords: moodAnalysis.keywords,
        date: new Date().toISOString().split('T')[0],
        aiAnalysis: `${Math.round(moodAnalysis.confidence * 100)}% confident`
      };
      
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '' });
      setIsCreatingNote(false);
    }
  };

  // Filter notes based on search
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif"
    }}>
      {/* Glassmorphism Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '20px 30px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <h1 style={{ 
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.5rem',
            fontWeight: '700',
            letterSpacing: '-1px'
          }}>
            🧠 AI Notes
          </h1>
          
          {/* Search Bar */}
          <div style={{ position: 'relative', minWidth: '300px' }}>
            <input
              type="text"
              placeholder="🔍 Search your notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '25px',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px',
                outline: 'none',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      {!isCreatingNote && (
        <button
          onClick={() => setIsCreatingNote(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(238, 90, 36, 0.4)',
            transition: 'all 0.3s ease',
            zIndex: 1000
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 12px 35px rgba(238, 90, 36, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 8px 25px rgba(238, 90, 36, 0.4)';
          }}
        >
          ✨
        </button>
      )}

      {/* Create Note Modal */}
      {isCreatingNote && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ 
              margin: '0 0 25px 0',
              color: '#2c3e50',
              fontSize: '1.8rem',
              textAlign: 'center'
            }}>
              ✨ Create New Note
            </h2>
            
            <input
              type="text"
              placeholder="Give your note a beautiful title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '2px solid #e9ecef',
                borderRadius: '15px',
                fontSize: '18px',
                marginBottom: '20px',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontWeight: '600',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
            
            <textarea
              placeholder="Pour your thoughts here... The AI will detect your emotions and create a beautiful note! ✨"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              style={{
                width: '100%',
                padding: '20px',
                border: '2px solid #e9ecef',
                borderRadius: '15px',
                fontSize: '16px',
                minHeight: '150px',
                resize: 'vertical',
                outline: 'none',
                lineHeight: '1.6',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
            
            {/* Real-time AI Preview */}
            {newNote.content.trim() && (
              <div style={{
                marginTop: '20px',
                padding: '15px 20px',
                background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%)',
                borderRadius: '15px',
                border: '1px solid #d4e6ff'
              }}>
                {(() => {
                  const preview = detectMoodFromText(`${newNote.title} ${newNote.content}`);
                  const theme = getMoodTheme(preview.mood);
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{theme.emoji}</span>
                      <span style={{ color: theme.color, fontWeight: '600' }}>
                        AI detected: {preview.mood} mood
                      </span>
                      {preview.confidence > 0.3 && (
                        <span style={{ 
                          background: theme.color + '20',
                          color: theme.color,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {Math.round(preview.confidence * 100)}% confident
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
            
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              marginTop: '25px',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleCreateNote}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🚀 Save Note
              </button>
              <button
                onClick={() => {
                  setIsCreatingNote(false);
                  setNewNote({ title: '', content: '' });
                }}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Masonry Grid */}
      <div style={{
        columns: window.innerWidth > 768 ? '3 300px' : '1 300px',
        columnGap: '20px',
        columnFill: 'balance'
      }}>
        {filteredNotes.map(note => {
          const theme = getMoodTheme(note.mood);
          return (
            <div
              key={note.id}
              style={{
                background: theme.gradient,
                borderRadius: '20px',
                padding: '25px',
                marginBottom: '20px',
                breakInside: 'avoid',
                boxShadow: theme.shadow,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = theme.shadow.replace('0.3', '0.5');
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.shadow;
              }}
            >
              {/* Note Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <h3 style={{
                  margin: 0,
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  wordBreak: 'break-word'
                }}>
                  {note.title}
                </h3>
                <span style={{ 
                  fontSize: '24px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}>
                  {theme.emoji}
                </span>
              </div>
              
              {/* Note Content */}
              <p style={{
                color: 'white',
                lineHeight: '1.6',
                margin: '0 0 20px 0',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                wordBreak: 'break-word'
              }}>
                {note.content}
              </p>
              
              {/* Note Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontWeight: '600'
                }}>
                  🧠 {note.mood} {note.aiAnalysis && `(${note.aiAnalysis})`}
                </div>
                <span style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '6px 12px',
                  borderRadius: '20px'
                }}>
                  {note.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'white'
        }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '20px',
            opacity: 0.7
          }}>
            {searchTerm ? '🔍' : '✨'}
          </div>
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '10px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {searchTerm ? 'No notes found' : 'Your beautiful notes await!'}
          </h2>
          <p style={{ 
            fontSize: '1.2rem',
            opacity: 0.8,
            textShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}>
            {searchTerm ? 'Try a different search term' : 'Click the ✨ button to create your first AI-powered note'}
          </p>
        </div>
      )}
    </div>
  );
}
