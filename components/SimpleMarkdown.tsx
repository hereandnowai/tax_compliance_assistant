import React from 'react';

// Helper to format text with basic markdown (paragraphs, bold, lists)
export const SimpleMarkdown: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  const formatText = (inputText: string) => {
    let html = inputText;
    // Bold: **text** or __text__
    html = html.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>');
    // Italics: *text* or _text_
    html = html.replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');
    // Unordered lists: * item or - item or + item
    html = html.replace(/^\s*([*+-])\s+(.*)/gm, '<li>$2</li>');
    html = html.replace(/<\/li>\n<li>/g, '</li><li>'); 
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, ''); 
    // Ordered lists: 1. item
    html = html.replace(/^\s*(\d+)\.\s+(.*)/gm, '<olitag>$2</olitag>'); 
    html = html.replace(/<\/olitag>\n<olitag>/g, '</olitag><olitag>');
    html = html.replace(/(<olitag>.*?<\/olitag>)/gs, '<ol>$1</ol>');
    html = html.replace(/<\/ol>\s*<ol>/g, '');
    html = html.replace(/<olitag>/g, '<li>').replace(/<\/olitag>/g, '</li>');
    // Paragraphs (split by double newlines)
    html = html.split(/\n\s*\n/).map(p => {
      const trimmedP = p.trim();
      if (trimmedP.startsWith('<ul>') || trimmedP.startsWith('<ol>')) {
        return trimmedP;
      }
      return trimmedP.length > 0 ? `<p>${trimmedP.replace(/\n/g, '<br/>')}</p>` : '';
    }).join('');
    html = html.replace(/<p>\s*(<(?:ul|ol)>.*?<\/(?:ul|ol)>)\s*<\/p>/gs, '$1');
    // Code blocks: ```code``` or ```lang\ncode``` (basic handling)
    html = html.replace(/```(\w*\s*\n)?([\s\S]*?)```/g, (_match, _lang, code) => {
      // Basic escaping for HTML within code blocks
      const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre><code class="language-${_lang ? _lang.trim() : ''} bg-[rgb(var(--code-bg))] text-[rgb(var(--code-text))] p-2 rounded block overflow-x-auto">${escapedCode.trim()}</code></pre>`;
    });

    return html;
  };
  
  // Apply prose classes for overall markdown styling. Specific overrides can be done via CSS variables.
  // Tailwind's prose plugin automatically handles dark mode if 'dark' class is on html/body.
  // prose-sm sm:prose ensures responsive typography.
  // text-[rgb(var(--text-primary))] ensures the base text color respects the theme.
  return (
    <div 
      className={`prose prose-sm sm:prose-base max-w-none 
                  text-[rgb(var(--text-primary))] 
                  prose-headings:text-[rgb(var(--text-primary))] 
                  prose-strong:text-[rgb(var(--text-primary))] 
                  prose-em:text-[rgb(var(--text-primary))] 
                  prose-a:text-[rgb(var(--text-accent))] hover:prose-a:text-[rgb(var(--text-accent-hover))]
                  prose-ul:text-[rgb(var(--text-secondary))]
                  prose-ol:text-[rgb(var(--text-secondary))]
                  prose-li:marker:text-[rgb(var(--text-accent))]
                  dark:prose-invert dark:prose-headings:text-[rgb(var(--text-primary))]
                  dark:prose-strong:text-[rgb(var(--text-primary))]
                  dark:prose-em:text-[rgb(var(--text-primary))]
                  dark:prose-a:text-[rgb(var(--text-accent))] dark:hover:prose-a:text-[rgb(var(--text-accent-hover))]
                  dark:prose-ul:text-[rgb(var(--text-secondary))]
                  dark:prose-ol:text-[rgb(var(--text-secondary))]
                  dark:prose-li:marker:text-[rgb(var(--text-accent))]
                  ${className}`}
      dangerouslySetInnerHTML={{ __html: formatText(text) }} 
    />
  );
};