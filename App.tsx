import type { CSSProperties } from 'react';
import InlineEditor from './InlineEditor';
import type { InlineEditorHandle, ThemeName, Theme } from './src/types';
import { useState, useRef } from 'react';

const INITIAL_CONTENT =
  "<h2>Welcome to Inline Editor</h2><p>This is a simplified <strong>rich text</strong> editor that supports both visual and HTML editing modes.</p><ul><li>Click the HTML button to view source</li><li>Edit in either mode</li><li>See how it behaves in a theme by clicking one of the modes above</li></ul><p>Have some H<sub>2</sub>O and enjoy...</p>";

const themes: Record<ThemeName, Theme> = {
  light: {
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    borderColor: '#cccccc',
    appBackground: '#f0f0f0',
  },
  dark: {
    backgroundColor: '#1e1e1e',
    foregroundColor: '#e0e0e0',
    borderColor: '#444444',
    appBackground: '#0d0d0d',
  },
  blue: {
    backgroundColor: '#1a2332',
    foregroundColor: '#c5d4e8',
    borderColor: '#2d3e52',
    appBackground: '#0f1823',
  },
  warm: {
    backgroundColor: '#2b2520',
    foregroundColor: '#e8dcc8',
    borderColor: '#4a3f35',
    appBackground: '#1a1512',
  },
};

const App = () => {
  const [theme, setTheme] = useState<ThemeName>('light');
  const [content, setContent] = useState<string>(INITIAL_CONTENT);
  const editorRef = useRef<InlineEditorHandle | null>(null);

  const handleSaveClick = () => {
    const editorContent =
      editorRef.current?.getContent() ?? content;
    console.log('Persisting editor content:', editorContent);
    setContent(editorContent);
  };

  

  const currentTheme = themes[theme];

  const appStyles: CSSProperties = {
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: currentTheme.appBackground,
    color: currentTheme.foregroundColor,
    transition: 'all 0.3s ease',
  };

  const containerStyles: CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
  };

  const headerStyles: CSSProperties = {
    marginBottom: '20px',
    textAlign: 'left',
  };

  const themeButtonsStyles: CSSProperties = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
  };

  const themeButtonStyle = (themeName: ThemeName): CSSProperties => ({
    padding: '8px 16px',
    border: `2px solid ${
      theme === themeName
        ? currentTheme.foregroundColor
        : currentTheme.borderColor
    }`,
    borderRadius: '4px',
    backgroundColor:
      theme === themeName
        ? currentTheme.foregroundColor
        : currentTheme.backgroundColor,
    color:
      theme === themeName
        ? currentTheme.backgroundColor
        : currentTheme.foregroundColor,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: theme === themeName ? 'bold' : 'normal',
    transition: 'all 0.2s',
  });

  return (
    <div style={appStyles}>
      <div style={containerStyles}>
        <h1 style={headerStyles}>Inline Rich Text/HTML Editor</h1>

        <div style={themeButtonsStyles}>
          <span style={{ marginRight: 12 }}>Select a theme to experiment:</span>
          <button
            onClick={() => setTheme('light')}
            style={themeButtonStyle('light')}
          >
            ☀️
          </button>
          <button
            onClick={() => setTheme('dark')}
            style={themeButtonStyle('dark')}
          >
            🌙
          </button>
          <button
            onClick={() => setTheme('blue')}
            style={themeButtonStyle('blue')}
          >
            🔵
          </button>
          <button
            onClick={() => setTheme('warm')}
            style={themeButtonStyle('warm')}
          >
            🔴
          </button>
        </div>

        <InlineEditor
          ref={editorRef}
          initialContent={content}
          backgroundColor={currentTheme.backgroundColor}
          foregroundColor={currentTheme.foregroundColor}
          borderColor={currentTheme.borderColor}
          onChange={(newContent) => setContent(newContent)} // live update rich text content
          onBlur={(content) => {
            console.log("User finished editing:", content);
            // This is where you'd save to your database
          }}
        />

        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <button
            type="button"
            style={themeButtonStyle(theme)}
            onClick={handleSaveClick}
          >
            Get Editor Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
