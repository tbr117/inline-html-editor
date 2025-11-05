import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import type {
  ChangeEvent,
  CSSProperties,
  MouseEvent as ReactMouseEvent,
} from 'react';
import type {
  InlineEditorProps,
  InlineEditorHandle,
  InlineEditorMode,
  InlineEditorHeaderSlotProps,
} from './src/types';

const DEFAULT_CONTENT = '<p>Start typing here...</p>';

const InlineEditor = forwardRef<InlineEditorHandle, InlineEditorProps>(
  (
    {
      id,
      initialContent = DEFAULT_CONTENT,
      backgroundColor = '#ffffff',
      foregroundColor = '#000000',
      borderColor = '#cccccc',
      className = '',
      style,
      onChange,
      onBlur,
      onModeChange,
      headerSlot,
      showInternalToggle = true,
    },
    ref
  ) => {
    const [isHtmlMode, setIsHtmlMode] = useState<boolean>(false);
    const [htmlSource, setHtmlSource] = useState<string>(initialContent);
    const editorRef = useRef<HTMLDivElement | null>(null);
    const lastEmittedContentRef = useRef<string>(initialContent);

    useEffect(() => {
      if (!isHtmlMode && editorRef.current) {
        editorRef.current.innerHTML = htmlSource;
      }
    }, [htmlSource, isHtmlMode]);

    useEffect(() => {
      if (initialContent !== lastEmittedContentRef.current) {
        lastEmittedContentRef.current = initialContent;
        setHtmlSource(initialContent);
      }
    }, [initialContent]);

    const getLatestInnerHtml = () =>
      isHtmlMode
        ? htmlSource
        : editorRef.current?.innerHTML ?? lastEmittedContentRef.current;

    const switchToVisualMode = () => {
      setIsHtmlMode(false);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = htmlSource;
        }
      }, 0);
    };

    const switchToHtmlMode = () => {
      if (editorRef.current) {
        const currentContent = editorRef.current.innerHTML;
        setHtmlSource(currentContent);
        lastEmittedContentRef.current = currentContent;
      }
      setIsHtmlMode(true);
    };

    const setEditorMode = (mode: InlineEditorMode) => {
      if (mode === 'html') {
        if (!isHtmlMode) {
          switchToHtmlMode();
        }
        return;
      }

      if (isHtmlMode) {
        switchToVisualMode();
      }
    };

    const toggleMode = () => {
      if (isHtmlMode) {
        switchToVisualMode();
      } else {
        switchToHtmlMode();
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        getContent: () => getLatestInnerHtml(),
        setContent: (value: string) => {
          lastEmittedContentRef.current = value;
          setHtmlSource(value);
          if (editorRef.current) {
            editorRef.current.innerHTML = value;
          }
        },
        toggleMode,
        getMode: () => (isHtmlMode ? 'html' : 'visual'),
        setMode: setEditorMode,
      }),
      [getLatestInnerHtml, htmlSource, isHtmlMode]
    );

    const handleContentChange = () => {
      if (editorRef.current && !isHtmlMode) {
        const nextValue = editorRef.current.innerHTML;
        lastEmittedContentRef.current = nextValue;
        if (onChange) {
          onChange(nextValue);
        }
      }
    };

    const handleHtmlChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.target.value;
      setHtmlSource(nextValue);
      lastEmittedContentRef.current = nextValue;
      if (onChange) {
        onChange(nextValue);
      }
    };

    const handleHtmlBlur = () => {
      if (onBlur) {
        onBlur(htmlSource);
      }
    };

    const handleBlur = () => {
      if (onBlur) {
        onBlur(getLatestInnerHtml());
      }
    };

    useEffect(() => {
      if (onModeChange) {
        onModeChange(isHtmlMode ? 'html' : 'visual');
      }
    }, [isHtmlMode, onModeChange]);

    const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      
      // If clicking on an image, check if it's inside a link
      if (target.tagName === 'IMG') {
        let parent = target.parentElement;
        while (parent && parent !== editorRef.current) {
          if (parent instanceof HTMLAnchorElement) {
            event.preventDefault();
            window.open(parent.href, '_blank', 'noopener,noreferrer');
            return;
          }
          parent = parent.parentElement;
        }
      }
      
      // For regular links, require Ctrl/Cmd to avoid interfering with editing
      if (
        target instanceof HTMLAnchorElement &&
        (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
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
          const currentContent = editorRef.current.innerHTML;
          setHtmlSource(currentContent);
          lastEmittedContentRef.current = currentContent;
        }
        setIsHtmlMode(true);
      }
    };

    const inlineStyle = style ?? {};

    const editorStyles: CSSProperties = {
      border: `1px solid ${borderColor}`,
      borderRadius: '4px',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      ...inlineStyle,
    };

    const contentAreaStyles: CSSProperties = {
      minHeight: '200px',
      padding: '12px',
      backgroundColor,
      color: foregroundColor,
      outline: 'none',
      overflowY: 'auto',
      lineHeight: '1.6',
    };

    const textareaStyles: CSSProperties = {
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
      lineHeight: '1.6',
    };

    const toolbarBackground =
      backgroundColor === '#ffffff'
        ? '#f5f5f5'
        : backgroundColor === '#000000'
        ? '#1a1a1a'
        : `color-mix(in srgb, ${backgroundColor} 90%, ${
            foregroundColor === '#000000' ? 'white' : 'black'
          } 10%)`;

    const toolbarStyles: CSSProperties = {
      display: 'flex',
      gap: '8px',
      padding: '8px',
      backgroundColor: toolbarBackground,
      borderBottom: `1px solid ${borderColor}`,
    };

    const buttonStyles: CSSProperties = {
      padding: '6px 12px',
      border: `1px solid ${borderColor}`,
      borderRadius: '3px',
      backgroundColor,
      color: foregroundColor,
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s',
    };

    return (
      <div id={id} className={`inline-editor ${className}`} style={editorStyles}>
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
          .editor-content code {
            font-family: 'Courier New', Courier, monospace;
            background-color: rgba(128, 128, 128, 0.1);
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.9em;
          }
          .editor-content pre {
            font-family: 'Courier New', Courier, monospace;
            background-color: rgba(128, 128, 128, 0.1);
            padding: 12px;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1em 0;
          }
          .editor-content pre code {
            background-color: transparent;
            padding: 0;
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
        {headerSlot
          ? headerSlot({
              mode: isHtmlMode ? 'html' : 'visual',
              toggleMode,
              setMode: setEditorMode,
            } satisfies InlineEditorHeaderSlotProps)
          : null}
        {showInternalToggle && (
          <div style={toolbarStyles}>
            <button
              type="button"
              onClick={toggleMode}
              style={buttonStyles}
              onMouseEnter={(event) => {
                event.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.opacity = '1';
              }}
            >
              {isHtmlMode ? '📝 Visual' : '< > HTML'}
            </button>
          </div>
        )}

        {isHtmlMode ? (
          <textarea
            value={htmlSource}
            onChange={handleHtmlChange}
            onBlur={handleHtmlBlur}
            style={textareaStyles}
            spellCheck="false"
            placeholder="Enter HTML here..."
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onClick={handleClick}
            onInput={handleContentChange}
            onBlur={handleBlur}
            style={contentAreaStyles}
            suppressContentEditableWarning
            className="editor-content"
          />
        )}
      </div>
    );
  }
);

InlineEditor.displayName = 'InlineEditor';

export default InlineEditor;
