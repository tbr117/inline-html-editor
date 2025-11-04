# Inline HTML Editor

A lightweight, themeable React component for inline HTML editing with visual and code modes. Perfect for applications that need night mode support and simple content editing.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- 🎨 **Dual Mode Editing**: Toggle between visual (WYSIWYG) and HTML source code modes
- 🌓 **Theme Compatible**: Fully customizable background and foreground colors for dark/light mode
- 🔗 **Clickable Links**: Ctrl/Cmd+Click to open links in new tabs while editing
- 📝 **Rich Text Support**: Proper rendering of lists, headings, bold, italic, images, and more
- ⚡ **No Cursor Jumping**: Smooth editing experience with stable cursor positioning
- 🎯 **Simple API**: Easy to integrate with minimal configuration
- 📦 **Zero Dependencies**: Pure React implementation using contentEditable

## Demo

![Demo Screenshot](https://via.placeholder.com/800x400?text=Inline+Editor+Demo)

## Installation

### Using in Your Project

1. Copy `InlineEditor.jsx` to your project's components folder
2. Import and use it in your React application

```bash
# If you want to run the demo
git clone https://github.com/YOUR_USERNAME/inline-editor.git
cd inline-editor
npm install
npm run dev
```

## Usage

### Basic Example

```jsx
import InlineEditor from './components/InlineEditor';

function MyApp() {
  const [content, setContent] = useState('<p>Hello World</p>');

  return (
    <InlineEditor
      initialContent={content}
      onChange={(newContent) => setContent(newContent)}
    />
  );
}
```

### With Theme Support

```jsx
import InlineEditor from './components/InlineEditor';

function MyApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const theme = isDarkMode ? {
    backgroundColor: '#1e1e1e',
    foregroundColor: '#e0e0e0',
    borderColor: '#444444'
  } : {
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    borderColor: '#cccccc'
  };

  return (
    <InlineEditor
      initialContent="<p>Start typing...</p>"
      backgroundColor={theme.backgroundColor}
      foregroundColor={theme.foregroundColor}
      borderColor={theme.borderColor}
      onChange={(content) => console.log(content)}
    />
  );
}
```

### Advanced Example with Custom Styling

```jsx
<InlineEditor
  initialContent="<h1>My Document</h1><p>Content here...</p>"
  backgroundColor="#2b2520"
  foregroundColor="#e8dcc8"
  borderColor="#4a3f35"
  className="my-custom-editor"
  style={{ maxWidth: '800px', margin: '0 auto' }}
  onChange={(newContent) => {
    // Save to backend, update state, etc.
    saveContent(newContent);
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialContent` | string | `'<p>Start typing here...</p>'` | Initial HTML content to display |
| `backgroundColor` | string | `'#ffffff'` | Background color of the editor |
| `foregroundColor` | string | `'#000000'` | Text color |
| `borderColor` | string | `'#cccccc'` | Border color |
| `className` | string | `''` | Additional CSS class for the container |
| `style` | object | `{}` | Additional inline styles for the container |
| `onChange` | function | `undefined` | Callback fired when content changes: `(content: string) => void` |

## Features in Detail

### Visual Mode
- Type naturally with rendered HTML
- Click to position cursor
- Cmd/Ctrl+Click links to open in new tab
- Proper rendering of:
  - Headings (h1-h3)
  - Lists (ul, ol)
  - Bold, italic text
  - Links with underline styling
  - Images (responsive, max-width: 100%)
  - Paragraphs with spacing

### HTML Mode
- Edit raw HTML source code
- Monospace font for better readability
- Syntax-friendly textarea
- Switch back to see rendered result

### Keyboard Shortcuts
- **Cmd/Ctrl + Click**: Open links in new tab (visual mode)
- Switch modes using the toolbar button

## Styling

The editor applies default styling to HTML elements. You can customize the appearance by:

1. **Using props**: `backgroundColor`, `foregroundColor`, `borderColor`
2. **Custom className**: Add your own CSS class
3. **Inline styles**: Pass additional styles via `style` prop

### Example Custom Styles

```css
.my-custom-editor .editor-content a {
  color: #ff6600;
  text-decoration: none;
}

.my-custom-editor .editor-content ul {
  list-style-type: square;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Technical Details

### How It Works

The component uses React's `contentEditable` attribute for visual editing mode:
- Initial content is set once on mount via `useEffect`
- Content is not controlled after mount to prevent cursor jumping
- Mode switching manually updates the DOM
- HTML mode uses a controlled textarea

### Why No Cursor Jumping?

Unlike many contentEditable implementations, this component:
- Avoids unnecessary re-renders during typing
- Only updates innerHTML when switching modes
- Uses refs instead of state for the visual editor content
- No event handlers that trigger React updates while typing

## Example: Integration with Backend

```jsx
import { useState, useEffect } from 'react';
import InlineEditor from './components/InlineEditor';

function DocumentEditor({ documentId }) {
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load initial content from API
    fetch(`/api/documents/${documentId}`)
      .then(res => res.json())
      .then(data => setContent(data.content));
  }, [documentId]);

  const handleSave = async (newContent) => {
    setContent(newContent);
    
    // Debounced save to backend
    await fetch(`/api/documents/${documentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newContent })
    });
  };

  return (
    <InlineEditor
      initialContent={content}
      backgroundColor={theme === 'dark' ? '#1e1e1e' : '#ffffff'}
      foregroundColor={theme === 'dark' ? '#e0e0e0' : '#000000'}
      borderColor={theme === 'dark' ? '#444444' : '#cccccc'}
      onChange={handleSave}
    />
  );
}
```

## FAQ

**Q: Can I add toolbar buttons for formatting?**  
A: The component is intentionally minimal. You can extend it by using `document.execCommand()` for basic formatting or add custom buttons that manipulate the content.

**Q: How do I get the current content programmatically?**  
A: Use the `onChange` callback - it provides the current HTML content whenever it changes.

**Q: Can I use this in a form?**  
A: Yes! Just store the content in state and submit it like any other form field.

**Q: Does it sanitize HTML?**  
A: No. You should sanitize user input on your backend before storing/displaying it.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this in your projects!

## Author

Created for easy inline HTML editing with theme support.

## Changelog

### Version 1.0.0
- Initial release
- Visual and HTML editing modes
- Theme customization
- Clickable links
- Proper HTML element styling
- No cursor jumping issues
