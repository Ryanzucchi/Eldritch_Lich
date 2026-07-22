"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToMarkdown = htmlToMarkdown;
exports.markdownToHtml = markdownToHtml;
exports.htmlToPlainText = htmlToPlainText;
exports.exportManuscripts = exportManuscripts;
/**
 * Converts HTML content to clean Markdown string
 */
function htmlToMarkdown(html) {
    if (!html)
        return '';
    let md = html;
    // Headings
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
    // Formatting
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    md = md.replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_');
    md = md.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');
    md = md.replace(/<strike[^>]*>(.*?)<\/strike>/gi, '~~$1~~');
    // Paragraphs & Line Breaks
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    md = md.replace(/<br\s*\/?>/gi, '\n');
    // Blockquotes & Lists
    md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    md = md.replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1\n');
    md = md.replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1\n');
    // Strip remaining HTML tags
    md = md.replace(/<[^>]*>/g, '');
    // Unescape common HTML entities
    md = md.replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"');
    return md.trim();
}
/**
 * Converts Markdown string to clean HTML
 */
function markdownToHtml(md) {
    if (!md)
        return '';
    let html = md;
    // Escape HTML entities first
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Headings
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.*?)~~/g, '<s>$1</s>');
    // Paragraphs
    const lines = html.split(/\n\n+/);
    html = lines.map(line => {
        if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<ol')) {
            return line;
        }
        return `<p>${line.replace(/\n/g, '<br>')}</p>`;
    }).join('');
    return html;
}
/**
 * Strips HTML and converts to plain text
 */
function htmlToPlainText(html) {
    if (!html)
        return '';
    return html
        .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n\n')
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
}
/**
 * Compiles single or multiple manuscripts into specified format file
 */
function exportManuscripts(manuscripts, format, projectTitle = 'Manuscrito') {
    const sanitizeTitle = projectTitle.toLowerCase().replace(/[^a-z0-9_-]/gi, '_');
    if (format === 'txt') {
        const textContent = manuscripts.map(m => `=== ${m.title} ===\n\n${htmlToPlainText(m.content)}`).join('\n\n\n');
        return {
            filename: `${sanitizeTitle}.txt`,
            mimeType: 'text/plain;charset=utf-8',
            content: textContent
        };
    }
    if (format === 'md') {
        const mdContent = `# ${projectTitle}\n\n` + manuscripts.map(m => `## ${m.title}\n\n${htmlToMarkdown(m.content)}`).join('\n\n---\n\n');
        return {
            filename: `${sanitizeTitle}.md`,
            mimeType: 'text/markdown;charset=utf-8',
            content: mdContent
        };
    }
    if (format === 'html') {
        const htmlBody = manuscripts.map(m => `<section class="chapter"><h1>${m.title}</h1>${m.content}</section>`).join('<hr/>');
        const fullHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${projectTitle}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #111; }
    h1 { text-align: center; margin-top: 40px; }
    hr { margin: 60px 0; border: none; border-top: 1px solid #ccc; }
    p { text-indent: 1.5em; margin: 0.5em 0; }
  </style>
</head>
<body>
  <header><h1>${projectTitle}</h1></header>
  <main>${htmlBody}</main>
</body>
</html>`;
        return {
            filename: `${sanitizeTitle}.html`,
            mimeType: 'text/html;charset=utf-8',
            content: fullHtml
        };
    }
    if (format === 'docx') {
        // DOCX XML/HTML formatted blob for Word compatibility
        const docxBody = manuscripts.map(m => `<h1>${m.title}</h1>${m.content}`).join('<br style="page-break-before:always;" />');
        const docxHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${projectTitle}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: "Calibri", "Arial", sans-serif; font-size: 12pt; line-height: 1.5; }
    h1 { font-size: 18pt; font-weight: bold; color: #1e293b; page-break-before: always; }
    p { margin-bottom: 10pt; }
  </style>
</head>
<body>
  ${docxBody}
</body>
</html>`;
        return {
            filename: `${sanitizeTitle}.docx`,
            mimeType: 'application/msword',
            content: docxHtml
        };
    }
    if (format === 'pdf') {
        // Printable HTML layout for Browser Print/PDF
        const pdfHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${projectTitle}</title>
  <style>
    @page { size: A4; margin: 25mm; }
    body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.6; color: #000; }
    .cover { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; page-break-after: always; text-align: center; }
    .cover h1 { font-size: 28pt; margin-bottom: 20px; }
    .chapter { page-break-before: always; }
    h1.chapter-title { font-size: 20pt; text-align: center; margin-bottom: 30px; }
    p { text-indent: 2em; margin: 0 0 0.5em 0; text-align: justify; }
  </style>
</head>
<body>
  <div class="cover">
    <h1>${projectTitle}</h1>
    <p>Compilação de Manuscrito</p>
  </div>
  ${manuscripts.map(m => `<div class="chapter"><h1 class="chapter-title">${m.title}</h1>${m.content}</div>`).join('')}
</body>
</html>`;
        return {
            filename: `${sanitizeTitle}.pdf.html`,
            mimeType: 'text/html;charset=utf-8',
            content: pdfHtml
        };
    }
    if (format === 'epub') {
        // Minimal ePub structural representation
        const epubXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="pt-BR">
<head>
  <title>${projectTitle}</title>
  <style type="text/css">
    body { font-family: serif; line-height: 1.4; padding: 5%; }
    h1 { text-align: center; page-break-before: always; }
    p { text-indent: 1.5em; margin: 0; }
  </style>
</head>
<body>
  <h1>${projectTitle}</h1>
  ${manuscripts.map(m => `<div class="chapter"><h1>${m.title}</h1>${m.content}</div>`).join('')}
</body>
</html>`;
        return {
            filename: `${sanitizeTitle}.epub`,
            mimeType: 'application/epub+zip',
            content: epubXhtml
        };
    }
    return {
        filename: `${sanitizeTitle}.txt`,
        mimeType: 'text/plain',
        content: ''
    };
}
