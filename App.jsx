import React, { useState } from 'react';
import InlineEditor from './InlineEditor';

const App = () => {
  const [theme, setTheme] = useState('light');
  const [content, setContent] = useState('<h2>Welcome to Inline Editor</h2><p>This is a <strong>rich text</strong> editor that supports both visual and HTML editing modes.</p><ul><li>Click the HTML button to view source</li><li>Edit in either mode</li><li>Theme compatible!</li></ul>');

  const themes = {
    light: {
      backgroundColor: '#ffffff',
      foregroundColor: '#000000',
      borderColor: '#cccccc',
      appBackground: '#f0f0f0'
    },
    dark: {
      backgroundColor: '#1e1e1e',
      foregroundColor: '#e0e0e0',
      borderColor: '#444444',
      appBackground: '#0d0d0d'
    },
    blue: {
      backgroundColor: '#1a2332',
      foregroundColor: '#c5d4e8',
      borderColor: '#2d3e52',
      appBackground: '#0f1823'
    },
    warm: {
      backgroundColor: '#2b2520',
      foregroundColor: '#e8dcc8',
      borderColor: '#4a3f35',
      appBackground: '#1a1512'
    }
  };

  const currentTheme = themes[theme];

  const appStyles = {
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: currentTheme.appBackground,
    color: currentTheme.foregroundColor,
    transition: 'all 0.3s ease'
  };

  const containerStyles = {
    maxWidth: '900px',
    margin: '0 auto'
  };

  const headerStyles = {
    marginBottom: '20px',
    textAlign: 'center'
  };

  const themeButtonsStyles = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap'
  };

  const themeButtonStyle = (themeName) => ({
    padding: '8px 16px',
    border: `2px solid ${theme === themeName ? currentTheme.foregroundColor : currentTheme.borderColor}`,
    borderRadius: '4px',
    backgroundColor: theme === themeName ? currentTheme.foregroundColor : currentTheme.backgroundColor,
    color: theme === themeName ? currentTheme.backgroundColor : currentTheme.foregroundColor,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: theme === themeName ? 'bold' : 'normal',
    transition: 'all 0.2s'
  });

  const infoStyles = {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: currentTheme.backgroundColor,
    border: `1px solid ${currentTheme.borderColor}`,
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '1.6'
  };

  return (
    <div style={appStyles}>
      <div style={containerStyles}>
        <h1 style={headerStyles}>Inline HTML Editor</h1>
        
        <div style={themeButtonsStyles}>
          <button onClick={() => setTheme('light')} style={themeButtonStyle('light')}>
            ☀️ Light
          </button>
          <button onClick={() => setTheme('dark')} style={themeButtonStyle('dark')}>
            🌙 Dark
          </button>
          <button onClick={() => setTheme('blue')} style={themeButtonStyle('blue')}>
            💙 Blue
          </button>
          <button onClick={() => setTheme('warm')} style={themeButtonStyle('warm')}>
            🔥 Warm
          </button>
        </div>

        <InlineEditor
          initialContent={content}
          backgroundColor={currentTheme.backgroundColor}
          foregroundColor={currentTheme.foregroundColor}
          borderColor={currentTheme.borderColor}
          onChange={(newContent) => setContent(newContent)}
        />

        <div style={infoStyles}>
          <h3 style={{ marginTop: 0 }}>Features:</h3>
          <ul style={{ marginBottom: 0 }}>
            <li>Toggle between visual and HTML editing modes</li>
            <li>Fully themeable with custom background and foreground colors</li>
            <li>Type naturally in visual mode with rendered HTML</li>
            <li>Edit raw HTML in code mode</li>
            <li>Perfect for night mode implementations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
