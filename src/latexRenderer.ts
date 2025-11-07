import katex from 'katex';

/**
 * Renders LaTeX math expressions in HTML content.
 * Supports both inline math ($...$) and block math ($$...$$).
 * 
 * @param html - HTML content that may contain LaTeX expressions
 * @returns HTML with LaTeX expressions rendered using KaTeX
 */
export const renderLatex = (html: string): string => {
  // First, replace block math ($$...$$) to avoid conflicts with inline math
  // We need to handle block math first since $$ contains $ delimiters
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, latex) => {
    try {
      const rendered = katex.renderToString(latex.trim(), {
        throwOnError: false,
        displayMode: true,
      });
      // Store raw LaTeX in data attribute for re-editing
      return `<div class="math-block" data-latex="${escapeHtml(latex.trim())}">${rendered}</div>`;
    } catch (e) {
      // If rendering fails, return the original text
      return match;
    }
  });

  // Then replace inline math ($...$)
  html = html.replace(/\$([^$\n]+?)\$/g, (match, latex) => {
    try {
      const rendered = katex.renderToString(latex.trim(), {
        throwOnError: false,
        displayMode: false,
      });
      // Store raw LaTeX in data attribute for re-editing
      return `<span class="math-inline" data-latex="${escapeHtml(latex.trim())}">${rendered}</span>`;
    } catch (e) {
      // If rendering fails, return the original text
      return match;
    }
  });

  return html;
};

/**
 * Extracts raw LaTeX from rendered math elements back to $ notation.
 * This is used when switching from visual mode to HTML mode.
 * Uses DOM parsing for accurate extraction.
 * 
 * @param html - HTML content that may contain rendered math elements
 * @returns HTML with math elements converted back to LaTeX notation
 */
export const extractLatex = (html: string): string => {
  // Create a temporary DOM element to parse the HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Find all block math elements and replace them
  const blockMathElements = temp.querySelectorAll('.math-block[data-latex]');
  blockMathElements.forEach((element) => {
    const latex = element.getAttribute('data-latex');
    if (latex) {
      const textNode = document.createTextNode(`$$${unescapeHtml(latex)}$$`);
      element.parentNode?.replaceChild(textNode, element);
    }
  });

  // Find all inline math elements and replace them
  const inlineMathElements = temp.querySelectorAll('.math-inline[data-latex]');
  inlineMathElements.forEach((element) => {
    const latex = element.getAttribute('data-latex');
    if (latex) {
      const textNode = document.createTextNode(`$${unescapeHtml(latex)}$`);
      element.parentNode?.replaceChild(textNode, element);
    }
  });

  return temp.innerHTML;
};

/**
 * Escapes HTML special characters for safe attribute storage
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Unescapes HTML entities back to original characters
 */
function unescapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };
  return text.replace(/&(?:amp|lt|gt|quot|#039);/g, (entity) => map[entity]);
}
