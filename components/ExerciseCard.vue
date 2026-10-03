<template>
  <v-card outlined class="exercise" @click.native="onCardClick">
    <div class="exercise__head">
      <div>
        <div class="eyebrow">แบบฝึกหัด</div>
        <div class="exercise__title">{{ exercise.title }}</div>
      </div>
      <v-chip v-if="passed" small color="success" dark class="exercise__badge">✓ ผ่านแล้ว</v-chip>
    </div>

    <div class="lesson-content exercise__prompt" v-html="promptHtml" />

    <div v-if="exercise.hint" class="exercise__hint">
      <button v-if="!showHint" type="button" class="hint-btn" @click="showHint = true">
        💡 ติดอยู่ใช่ไหม? กดขอคำใบ้
      </button>
      <div v-else class="lesson-content hint-box">
        <blockquote class="callout callout-tip">
          <p>💡 <strong>คำใบ้</strong></p>
          <div v-html="hintHtml" />
        </blockquote>
      </div>
    </div>

    <div class="code-window exercise__editor">
      <div class="code-window__bar">
        <span class="code-window__dots"><i /><i /><i /></span>
        <span class="code-window__title">Main.java</span>
        <button type="button" class="code-window__btn" @click="resetCode">↺ คืนค่าเริ่มต้น</button>
      </div>
      <CodeEditor v-model="code" height="300px" />
    </div>

    <v-textarea
      v-model="stdin"
      class="exercise__stdin"
      label="Standard Input สำหรับปุ่ม &quot;รันทดสอบ&quot; (ถ้าโค้ดใช้ Scanner ใส่ค่าที่นี่ บรรทัดละค่า)"
      outlined
      dense
      rows="2"
      auto-grow
      hide-details
      background-color="white"
    />

    <div class="exercise__actions">
      <v-btn color="secondary" depressed :loading="running" @click="runCode">▶ รันทดสอบ</v-btn>
      <v-btn color="primary" depressed :loading="submitting" @click="submitCode">✔ ส่งตรวจ</v-btn>
    </div>
    <div class="exercise__caption">
      <strong>รันทดสอบ</strong> ใช้ค่าในช่อง Standard Input ที่คุณพิมพ์เอง (ไม่นับคะแนน) •
      <strong>ส่งตรวจ</strong> จะรันกับชุดทดสอบของโจทย์เสมอ ไม่ใช้ค่าในช่อง Standard Input
    </div>

    <!-- result of "รันทดสอบ" -->
    <div v-if="resultSource === 'run' && result" class="exercise__result pop-in">
      <div class="result-title">ผลจากการรันทดสอบ (ยังไม่ส่งตรวจ)</div>
      <div class="console">
        <span class="console__status" :class="runOk ? 'console__status--ok' : 'console__status--bad'">{{ runStatusText }}</span>
        <div v-if="runOutput">{{ runOutput }}</div>
        <div v-else class="console__muted">(ไม่มีข้อความแสดงผลทางหน้าจอ)</div>
      </div>
    </div>

    <!-- result of "ส่งตรวจ" -->
    <div v-if="resultSource === 'submit' && result" class="exercise__result pop-in">
      <div v-if="result.passed" class="verdict verdict--pass">
        <div class="verdict__title">🎉 ผ่านทุกชุดทดสอบ!</div>
        <div>ผ่าน {{ result.passedCases }}/{{ result.totalCases }} ชุดทดสอบ ดูเฉลยและคำอธิบายด้านล่างเพื่อเทียบกับวิธีของคุณได้เลย</div>
      </div>
      <div v-else class="verdict verdict--fail">
        <div class="verdict__title">ยังไม่ผ่าน ลองอีกครั้งนะ</div>
        <div>ผ่าน {{ result.passedCases }}/{{ result.totalCases }} ชุดทดสอบ</div>
        <div class="verdict__reason">{{ failReason }}</div>
        <div v-if="failOutput" class="console verdict__console">{{ failOutput }}</div>
      </div>
    </div>

    <!-- model solution: only exists after the student has passed -->
    <div v-if="solutionHtml" class="solution">
      <div class="solution__title">📘 เฉลยและคำอธิบาย</div>
      <div class="lesson-content" v-html="solutionHtml" />
    </div>
  </v-card>
</template>

<script>
import { renderMarkdown, highlightCodeBlocks, handleCodeBlockClick } from '~/utils/markdown'

export default {
  name: 'ExerciseCard',
  props: {
    exercise: { type: Object, required: true }
  },
  data () {
    return {
      code: this.exercise.starterCode,
      stdin: '',
      running: false,
      submitting: false,
      result: null,
      resultSource: null,
      showHint: false,
      passed: Boolean(this.exercise.passed),
      solution: this.exercise.passed && this.exercise.solutionCode
        ? { code: this.exercise.solutionCode, explanation: this.exercise.solutionExplanation }
        : null
    }
  },
  computed: {
    promptHtml () {
      return renderMarkdown(this.exercise.prompt)
    },
    hintHtml () {
      return renderMarkdown(this.exercise.hint)
    },
    solutionHtml () {
      if (!this.solution) return ''
      const firstStdin = (this.exercise.testCases && this.exercise.testCases[0] && this.exercise.testCases[0].stdin) || ''
      const fence = '```java' + (firstStdin ? ' stdin=' + encodeURIComponent(firstStdin) : '')
      return renderMarkdown(fence + '\n' + this.solution.code.trimEnd() + '\n```\n\n' + (this.solution.explanation || ''))
    },
    runOk () {
      return this.result && this.result.statusId === 3
    },
    runStatusText () {
      if (!this.result) return ''
      if (this.result.statusId === 3) return 'รันสำเร็จ ✓'
      if (this.result.statusId === 7) return 'เกิดข้อผิดพลาดตอนรัน (Runtime Error)'
      return this.result.statusDescription
    },
    runOutput () {
      if (!this.result) return ''
      return this.result.compileOutput || this.result.stderr || this.result.stdout || ''
    },
    failedCase () {
      if (!this.result || !this.result.caseResults) return null
      return this.result.caseResults.find((item) => item.statusDescription !== 'Accepted') || null
    },
    failReason () {
      if (this.failedCase) return `โปรแกรมของคุณมีปัญหา: ${this.failedCase.statusDescription}`
      return 'โปรแกรมรันได้ แต่ผลลัพธ์ยังไม่ตรงกับที่โจทย์ต้องการในบางชุดทดสอบ ลองกด "รันทดสอบ" ด้วย input ตัวอย่างจากโจทย์ แล้วเทียบผลลัพธ์อีกครั้ง'
    },
    failOutput () {
      return this.failedCase ? this.failedCase.actualOutput : ''
    }
  },
  mounted () {
    this.highlight()
  },
  updated () {
    this.highlight()
  },
  methods: {
    highlight () {
      this.$nextTick(() => highlightCodeBlocks(this.$el))
    },
    onCardClick (event) {
      handleCodeBlockClick(event, (draft) => {
        this.$store.commit('setPlaygroundDraft', draft)
        this.$router.push('/playground')
      })
    },
    async resetCode () {
      const confirm = await this.$swal({
        icon: 'question',
        title: 'คืนค่าโค้ดเริ่มต้น?',
        text: 'โค้ดที่คุณเขียนไว้ในแบบฝึกหัดนี้จะหายไป',
        showCancelButton: true,
        confirmButtonText: 'คืนค่า',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#B85400'
      })
      if (confirm.isConfirmed) this.code = this.exercise.starterCode
    },
    async runCode () {
      this.running = true
      this.result = null
      try {
        const response = await this.$axios.$post('/execute', { code: this.code, stdin: this.stdin })
        this.result = response.result
        this.resultSource = 'run'
      } catch (error) {
        await this.$swal({
          icon: 'error',
          title: 'รันโค้ดไม่สำเร็จ',
          text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#B85400'
        })
      }
      this.running = false
    },
    async submitCode () {
      const student = this.$store.state.student
      if (!student) {
        await this.$router.push('/start')
        return
      }
      this.submitting = true
      this.result = null
      try {
        const response = await this.$axios.$post('/submission', {
          studentName: student.name,
          studentEmail: student.email,
          exerciseId: this.exercise._id,
          code: this.code
        })
        this.result = response.result
        this.resultSource = 'submit'
        if (response.result.passed) {
          this.passed = true
          await this.fetchSolution(student.email)
        }
        this.$emit('submitted', response.result)
      } catch (error) {
        await this.$swal({
          icon: 'error',
          title: 'ส่งคำตอบไม่สำเร็จ',
          text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#B85400'
        })
      }
      this.submitting = false
    },
    async fetchSolution (email) {
      try {
        const response = await this.$axios.$get('/lesson/exercise/' + this.exercise._id, { params: { email } })
        if (response.result.solutionCode) {
          this.solution = {
            code: response.result.solutionCode,
            explanation: response.result.solutionExplanation
          }
        }
      } catch (error) {
        // The solution is a bonus; failing to load it must not hide the pass result
      }
    }
  }
}
</script>

<style scoped>
.exercise {
  padding: 24px;
  margin-bottom: 28px;
  border-color: var(--c-latte) !important;
  box-shadow: var(--shadow-soft);
}

.exercise__head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.exercise__title {
  font-family: var(--font-head);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--c-espresso);
}

.exercise__prompt {
  margin-bottom: 14px;
  font-size: 16px;
}

.exercise__hint {
  margin-bottom: 14px;
}

.hint-btn {
  padding: 8px 16px;
  font-family: var(--font-head);
  font-size: 0.92rem;
  font-weight: 500;
  color: #8a5a00;
  background: #fff6df;
  border: 1px dashed #f2a516;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.hint-btn:hover {
  background: #ffeec2;
}

.hint-box blockquote {
  margin: 0;
}

.exercise__editor {
  margin-bottom: 14px;
}

.exercise__stdin {
  margin-bottom: 14px;
}

.exercise__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.exercise__caption {
  margin-top: 10px;
  font-size: 0.83rem;
  line-height: 1.7;
  color: var(--c-muted);
}

.exercise__result {
  margin-top: 18px;
}

.result-title {
  margin-bottom: 8px;
  font-family: var(--font-head);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--c-roast);
}

.verdict {
  padding: 16px 18px;
  line-height: 1.75;
  border-radius: 12px;
}

.verdict__title {
  margin-bottom: 4px;
  font-family: var(--font-head);
  font-size: 1.1rem;
  font-weight: 700;
}

.verdict--pass {
  color: #24502a;
  background: #eaf4ea;
  border: 1px solid #b9d9bb;
}

.verdict--fail {
  color: #6b3b00;
  background: #fff3e0;
  border: 1px solid #f2c27a;
}

.verdict__reason {
  margin-top: 6px;
}

.verdict__console {
  margin-top: 10px;
  min-height: 0;
}

.solution {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 2px dashed var(--c-latte);
}

.solution__title {
  margin-bottom: 10px;
  font-family: var(--font-head);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--c-espresso);
}
</style>
