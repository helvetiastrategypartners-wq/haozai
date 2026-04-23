const DEFAULT_MARKDOWN = `# Projet produit
## Produit
- Vision
  - Problème
  - Solution
- Roadmap
  - MVP
  - V1
## Équipe
- Tech
- Design
- Marketing`;

const DEFAULT_MERMAID = `mindmap
  root((Projet produit))
    Produit
      Vision
        Problème
        Solution
      Roadmap
        MVP
        V1
    Équipe
      Tech
      Design
      Marketing`;

const sourceInput = document.getElementById('sourceInput');
const inputMode = document.getElementById('inputMode');
const renderBtn = document.getElementById('renderBtn');
const templateBtn = document.getElementById('templateBtn');
const copyBtn = document.getElementById('copyBtn');
const preview = document.getElementById('preview');
const errorBox = document.getElementById('errorBox');

const mermaidApi = globalThis.mermaid;
mermaidApi.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'default',
  fontFamily: 'Inter, sans-serif'
});

function normalize(line) {
  return line.replace(/\t/g, '  ').replace(/\s+$/g, '');
}

function stripMarkdownPrefix(text) {
  return text
    .replace(/^#+\s+/, '')
    .replace(/^[-*+]\s+/, '')
    .trim();
}

function markdownToMindmap(mdText) {
  const lines = mdText
    .split('\n')
    .map((line) => normalize(line))
    .filter((line) => line.trim().length > 0);

  if (!lines.length) {
    throw new Error('Le contenu Markdown est vide.');
  }

  const nodes = [];

  for (const rawLine of lines) {
    const headingMatch = rawLine.match(/^(#+)\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      nodes.push({ level, text: stripMarkdownPrefix(rawLine) });
      continue;
    }

    const listMatch = rawLine.match(/^(\s*)[-*+]\s+(.+)/);
    if (listMatch) {
      const spaces = listMatch[1].length;
      const level = Math.floor(spaces / 2) + 1;
      nodes.push({ level, text: stripMarkdownPrefix(rawLine) });
      continue;
    }

    nodes.push({ level: 1, text: stripMarkdownPrefix(rawLine) });
  }

  const firstNode = nodes[0]?.text || 'Mindmap';
  const escapedRoot = firstNode.replace(/"/g, "'");

  const out = ['mindmap', `  root(("${escapedRoot}"))`];

  for (let i = 1; i < nodes.length; i += 1) {
    const node = nodes[i];
    const safeLevel = Math.max(node.level, 1);
    const indent = '  '.repeat(safeLevel + 1);
    const text = node.text.replace(/"/g, "'");
    out.push(`${indent}${text}`);
  }

  return out.join('\n');
}

async function renderMindmap() {
  errorBox.hidden = true;
  errorBox.textContent = '';

  const text = sourceInput.value.trim();
  if (!text) {
    preview.innerHTML = '';
    errorBox.hidden = false;
    errorBox.textContent = 'Veuillez saisir du contenu Markdown ou Mermaid.';
    return;
  }

  let mermaidText = text;
  if (inputMode.value === 'markdown') {
    mermaidText = markdownToMindmap(text);
  }

  try {
    const id = `mindmap-${Date.now()}`;
    const { svg } = await mermaidApi.render(id, mermaidText);
    preview.innerHTML = svg;
  } catch (error) {
    preview.innerHTML = '';
    errorBox.hidden = false;
    errorBox.textContent = `Erreur Mermaid : ${error.message}`;
  }
}

function loadTemplate() {
  sourceInput.value = inputMode.value === 'markdown' ? DEFAULT_MARKDOWN : DEFAULT_MERMAID;
  renderMindmap();
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(sourceInput.value);
    copyBtn.textContent = 'Copié ✓';
    setTimeout(() => {
      copyBtn.textContent = 'Copier le texte';
    }, 1200);
  } catch {
    errorBox.hidden = false;
    errorBox.textContent = "Impossible de copier automatiquement. Utilisez Ctrl/Cmd + C.";
  }
}

renderBtn.addEventListener('click', renderMindmap);
templateBtn.addEventListener('click', loadTemplate);
copyBtn.addEventListener('click', copyContent);
inputMode.addEventListener('change', loadTemplate);

loadTemplate();
