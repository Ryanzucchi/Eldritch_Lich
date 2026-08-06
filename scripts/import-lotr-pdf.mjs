import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const [textFile, manuscriptsFile, projectId, mode] = process.argv.slice(2);
if (!textFile || !manuscriptsFile || !projectId) throw new Error('Uso: node scripts/import-lotr-pdf.mjs TEXTO ARQUIVO_JSON PROJECT_ID [--apply]');
const text = readFileSync(textFile, 'utf8').replace(/\r/g, '').replace(/\f/g, '\n');
const start = text.indexOf('A SOCIEDADE DO ANEL');
if (start < 0) throw new Error('Não foi possível localizar o início de A Sociedade do Anel.');
const source = text.slice(start);
const pattern = /^\s*CAP[IÍ]TULO\s+([IVXLCDM]+|\d+)\s*:?\s*([^\n]{3,100})\s*$/gim;
const headings = [...source.matchAll(pattern)];
if (headings.length !== 62) throw new Error(`Estrutura inválida: esperados 62 capítulos, encontrados ${headings.length}.`);
const books = ['A Sociedade do Anel — Livro I', 'A Sociedade do Anel — Livro II', 'As Duas Torres — Livro III', 'As Duas Torres — Livro IV', 'O Retorno do Rei — Livro V', 'O Retorno do Rei — Livro VI'];
const limits = [12, 22, 33, 43, 53, 62];
const toHtml = value => value.split(/\n\s*\n/).map(part => part.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean).map(part => `<p>${part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('');
let bookIndex = 0;
const now = new Date().toISOString();
const chapters = headings.map((match, index) => {
  while (index >= limits[bookIndex]) bookIndex++;
  const from = (match.index ?? 0) + match[0].length;
  const to = headings[index + 1]?.index ?? source.length;
  const title = match[2].replace(/\s+/g, ' ').trim();
  return { id: randomUUID(), projectId, title: `${books[bookIndex]} — Capítulo ${match[1]}: ${title}`, content: toHtml(source.slice(from, to)), status: 'RASCUNHO', isLocked: false, createdAt: now, updatedAt: now };
});
const all = JSON.parse(readFileSync(manuscriptsFile, 'utf8'));
const existing = all.filter(item => item.projectId === projectId);
if (mode !== '--apply') { console.log(JSON.stringify({ chapters: chapters.length, existing: existing.length, first: chapters[0].title, last: chapters.at(-1).title })); process.exit(0); }
const allowedPartial = existing.length === 3 && existing.some(item => item.title.toLocaleLowerCase() === 'prefacio') && existing.some(item => item.title.toLocaleLowerCase() === 'prologo') && existing.some(item => /^cap[ií]tulo 1$/i.test(item.title));
if (existing.length && !allowedPartial) throw new Error(`O projeto já contém ${existing.length} manuscrito(s); importe abortado para não sobrescrever conteúdo.`);
const chapterOne = existing.find(item => /^cap[ií]tulo 1$/i.test(item.title));
const normalized = allowedPartial ? all.map(item => item.id === chapterOne.id ? { ...item, title: chapters[0].title, content: chapters[0].content, updatedAt: now } : item) : all;
const additions = allowedPartial ? chapters.slice(1) : chapters;
writeFileSync(manuscriptsFile, JSON.stringify([...normalized, ...additions], null, 2));
console.log(`Importados ${additions.length} capítulos e organizado o primeiro capítulo existente.`);
