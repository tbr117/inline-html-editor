import React, { useState, useRef, useEffect } from 'react';

const InlineEditor = ({ 
  initialContent = '<p>Start typing here...</p>',
  backgroundColor = '#ffffff',
  foregroundColor = '#000000',
  borderColor = '#cccccc',
  className = '',
  style = {},
  onChange
}) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlSource, setHtmlSource] = useState(initialContent);
  const editorRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current && editorRef.current) {
      editorRef.current.innerHTML = initialContent;
      isInitialMount.current = false;
    }
  }, [initialContent]);

  const handleContentChange = () => {
    if (editorRef.current && !isHtmlMode && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleHtmlChange = (e) => {
    setHtmlSource(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleClick = (e) => {
    let target = e.target;
    
    // If clicking on an image, check if it's inside a link
    if (target.tagName === 'IMG') {
      let parent = target.parentElement;
      while (parent && parent !== editorRef.current) {
        if (parent.tagName === 'A') {
          e.preventDefault();
          window.open(parent.href, '_blank', 'noopener,noreferrer');
          return;
        }
        parent = parent.parentElement;
      }
    }
    
    // For regular links, require Ctrl/Cmd to avoid interfering with editing
    if (target.tagName === 'A' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      window.open(target.href, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleMode = () => {
    if (isHtmlMode) {
      // Switching from HTML to visual mode
      setIsHtmlMode(false);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = htmlSource;
        }
      }, 0);
    } else {
      // Switching from visual to HTML mode
      if (editorRef.current) {
        setHtmlSource(editorRef.current.innerHTML);
      }
      setIsHtmlMode(true);
    }
  };

  const editorStyles = {
    border: `1px solid ${borderColor}`,
    borderRadius: '4px',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    ...style
  };

  const contentAreaStyles = {
    minHeight: '200px',
    padding: '12px',
    backgroundColor,
    color: foregroundColor,
    outline: 'none',
    overflowY: 'auto',
    lineHeight: '1.6'
  };

  const textareaStyles = {
    width: '100%',
    minHeight: '200px',
    padding: '12px',
    backgroundColor,
    color: foregroundColor,
    border: 'none',
    outline: 'none',
    fontFamily: 'monospace',
    fontSize: '14px',
    resize: 'vertical',
    lineHeight: '1.6'
  };

  const toolbarStyles = {
    display: 'flex',
    gap: '8px',
    padding: '8px',
    backgroundColor: backgroundColor === '#ffffff' ? '#f5f5f5' : 
                     backgroundColor === '#000000' ? '#1a1a1a' : 
                     `color-mix(in srgb, ${backgroundColor} 90%, ${foregroundColor === '#000000' ? 'white' : 'black'} 10%)`,
    borderBottom: `1px solid ${borderColor}`
  };

  const buttonStyles = {
    padding: '6px 12px',
    border: `1px solid ${borderColor}`,
    borderRadius: '3px',
    backgroundColor,
    color: foregroundColor,
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s'
  };

  return (
    <div className={`inline-editor ${className}`} style={editorStyles}>
      <style>
        {`
          .editor-content ul,
          .editor-content ol {
            margin-left: 24px;
            margin-top: 0.5em;
            margin-bottom: 0.5em;
          }
          .editor-content ul {
            list-style-type: disc;
          }
          .editor-content ol {
            list-style-type: decimal;
          }
          .editor-content li {
            display: list-item;
          }
          .editor-content h1 {
            font-size: 2em;
            font-weight: bold;
            margin-top: 0.67em;
            margin-bottom: 0.67em;
          }
          .editor-content h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin-top: 0.75em;
            margin-bottom: 0.75em;
          }
          .editor-content h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin-top: 0.83em;
            margin-bottom: 0.83em;
          }
          .editor-content p {
            margin-top: 1em;
            margin-bottom: 1em;
          }
          .editor-content strong {
            font-weight: bold;
          }
          .editor-content em {
            font-style: italic;
          }
          .editor-content sub {
            vertical-align: sub;
            font-size: smaller;
          }
          .editor-content sup {
            vertical-align: super;
            font-size: smaller;
          }
          .editor-content a {
            color: #0066cc;
            text-decoration: underline;
            cursor: pointer;
          }
          .editor-content img {
            max-width: 100%;
            height: auto;
          }
        `}
      </style>
      <div style={toolbarStyles}>
        <button
          onClick={toggleMode}
          style={buttonStyles}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
          }}
        >
          {isHtmlMode ? '📝 Visual' : '< > HTML'}
        </button>
      </div>
      
      {isHtmlMode ? (
        <textarea
          value={htmlSource}
          onChange={handleHtmlChange}
          style={textareaStyles}
          spellCheck="false"
          placeholder="Enter HTML here..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onClick={handleClick}
          style={contentAreaStyles}
          suppressContentEditableWarning
          className="editor-content"
        />
      )}
    </div>
  );
};

export default InlineEditor;
