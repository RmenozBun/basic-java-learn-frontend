import { marked } from 'marked'

// Lesson/exercise text is authored by us (backend/scripts/content/*.md), not by users.
// Conventions used in that markdown:
//   ```java                 runnable program: highlighted, with copy + "try it" buttons
//   ```java run=no          highlighted snippet without the "try it" button
//   ```java stdin=Ploy%0A5  same, and pre-fills Standard Input in the Playground (url-encoded, %0A = newline)
//   ```output / error / input / diagram   labelled plain blocks
//   > 💡 / ⚠️ / 🧪 / 📝 / ✅   blockquote callouts

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const escapeAttr = (text) => escapeHtml(text).replace(/\n/g, '&#10;')

const parseInfo = (infostring) => {
  const [lang = '', ...rest] = (infostring || '').trim().split(/\s+/)
  const meta = {}
  rest.forEach((part) => {
    const index = part.indexOf('=')
    if (index > 0) meta[part.slice(0, index)] = part.slice(index + 1)
  })
  return { lang, meta }
}

const BLOCK_LABELS = {
  output: 'ผลลัพธ์',
  error: 'ข้อความ error',
  input: 'Standard Input'
}

const renderer = {
  // wrapper lets wide tables scroll sideways on phones without breaking the page width
  table (header, body) {
    const tbody = body ? `<tbody>${body}</tbody>` : ''
    return `<div class="table-wrap"><table><thead>${header}</thead>${tbody}</table></div>`
  },
  code (code, infostring) {
    const { lang, meta } = parseInfo(infostring)
    const body = escapeHtml(code.replace(/\n$/, ''))

    if (lang === 'java') {
      let stdin = ''
      try {
        stdin = meta.stdin ? decodeURIComponent(meta.stdin) : ''
      } catch (error) {
        stdin = ''
      }
      const runButton = meta.run === 'no'
        ? ''
        : '<button type="button" data-action="run">▶ ลองรัน</button>'
      return (
        `<div class="code-block" data-stdin="${escapeAttr(stdin)}">` +
        '<div class="code-block__bar">' +
        '<span class="code-block__dots"><i></i><i></i><i></i></span>' +
        '<span class="code-block__title">Main.java</span>' +
        `<span class="code-block__actions"><button type="button" data-action="copy">คัดลอก</button>${runButton}</span>` +
        '</div>' +
        `<pre class="cm-s-coffee"><code class="language-java">${body}</code></pre>` +
        '</div>'
      )
    }

    const label = BLOCK_LABELS[lang]
    const modifier = ['output', 'error', 'input', 'diagram'].includes(lang) ? lang : 'plain'
    return (
      `<div class="output-block output-block--${modifier}">` +
      (label ? `<div class="output-block__label">${label}</div>` : '') +
      `<pre><code>${body}</code></pre>` +
      '</div>'
    )
  }
}

marked.use({ renderer })

const CALLOUT_TYPES = [
  ['💡', 'tip'],
  ['⚠', 'warn'],
  ['🧪', 'try'],
  ['📝', 'note'],
  ['✅', 'ok']
]

const addCalloutClasses = (html) =>
  html.replace(/<blockquote>(\s*<(?:p|ol|ul)>)(💡|⚠️?|🧪|📝|✅)/g, (match, open, emoji) => {
    const type = (CALLOUT_TYPES.find(([mark]) => emoji.startsWith(mark)) || [])[1] || 'note'
    return `<blockquote class="callout callout-${type}">${open}${emoji}`
  })

export const renderMarkdown = (markdown) => {
  if (!markdown) return ''
  return addCalloutClasses(marked.parse(markdown, { mangle: false, headerIds: false }))
}

// Colourises every runnable/viewable Java block inside `root` with the same
// CodeMirror tokenizer used by the editor (no extra dependency, no layout shift).
export const highlightCodeBlocks = async (root) => {
  if (!root) return
  const CodeMirror = (await import('codemirror')).default
  await import('codemirror/mode/clike/clike.js')
  await import('codemirror/addon/runmode/runmode.js')

  root.querySelectorAll('.code-block pre code.language-java').forEach((element) => {
    if (element.dataset.highlighted) return
    const source = element.textContent
    element.textContent = ''
    CodeMirror.runMode(source, 'text/x-java', element)
    element.dataset.highlighted = '1'
  })
}

// Click handler shared by anything that renders lesson markdown with v-html.
// `onRun({ code, stdin })` is called for the "▶ ลองรัน" button.
export const handleCodeBlockClick = (event, onRun) => {
  const button = event.target.closest('button[data-action]')
  if (!button) return
  const block = button.closest('.code-block')
  if (!block) return
  const code = block.querySelector('code').textContent

  if (button.dataset.action === 'copy') {
    const done = () => {
      const original = button.textContent
      button.textContent = 'คัดลอกแล้ว ✓'
      setTimeout(() => { button.textContent = original }, 1500)
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(done, () => {})
    }
  } else if (button.dataset.action === 'run') {
    onRun({ code, stdin: block.dataset.stdin || '' })
  }
}
