<template>
  <client-only>
    <textarea ref="textarea" />
  </client-only>
</template>

<script>
export default {
  name: 'CodeEditor',
  props: {
    value: { type: String, default: '' },
    height: { type: String, default: '320px' }
  },
  data () {
    return {
      editor: null
    }
  },
  watch: {
    value (newValue) {
      if (this.editor && newValue !== this.editor.getValue()) {
        this.editor.setValue(newValue)
      }
    }
  },
  mounted () {
    this.initEditor()
  },
  beforeDestroy () {
    if (this.editor) {
      this.editor.toTextArea()
      this.editor = null
    }
  },
  methods: {
    async initEditor () {
      const CodeMirror = (await import('codemirror')).default
      await import('codemirror/mode/clike/clike.js')

      this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
        mode: 'text/x-java',
        theme: 'coffee',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        matchBrackets: true,
        extraKeys: {
          Tab: (cm) => cm.execCommand('insertSoftTab'),
          'Shift-Tab': (cm) => cm.execCommand('indentLess')
        }
      })
      this.editor.setValue(this.value || '')
      this.editor.setSize('100%', this.height)
      this.editor.on('change', (instance) => {
        this.$emit('input', instance.getValue())
      })
    },
    getValue () {
      return this.editor ? this.editor.getValue() : this.value
    }
  }
}
</script>
