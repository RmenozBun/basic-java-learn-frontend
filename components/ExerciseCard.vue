<template>
  <v-card outlined class="mb-6">
    <v-card-title>{{ exercise.title }}</v-card-title>
    <v-card-text>
      <p class="mb-4" style="white-space: pre-line;">{{ exercise.prompt }}</p>

      <CodeEditor v-model="code" height="260px" />

      <v-textarea
        v-model="stdin"
        class="mt-3"
        label="Standard Input (ถ้าโค้ดต้องอ่านค่าจาก Scanner ใส่ตรงนี้ก่อนกดรัน — ขึ้นบรรทัดใหม่ได้ถ้าต้องอ่านหลายค่า)"
        outlined
        dense
        rows="2"
        auto-grow
        hide-details
      />

      <v-row class="mt-2" no-gutters>
        <v-btn color="secondary" class="mr-2" :loading="running" @click="runCode">
          รัน
        </v-btn>
        <v-btn color="primary" :loading="submitting" @click="submitCode">
          ส่งคำตอบ
        </v-btn>
      </v-row>
      <div class="text-caption grey--text text--darken-1 mt-1">
        "รัน" ใช้ทดสอบเองด้วยค่า Standard Input ที่คุณพิมพ์ด้านบน (ไม่นับคะแนน) —
        "ส่งคำตอบ" จะรันโค้ดกับชุดทดสอบจริงของโจทย์นี้เสมอ (ไม่ใช้ค่าที่พิมพ์ในช่อง Standard Input)
      </div>

      <v-alert v-if="result" class="mt-4" :type="alertType" outlined dense>
        <div class="font-weight-bold">
          {{ resultSource === 'run' ? 'ผลจากการทดสอบเอง (ยังไม่ส่งคำตอบ)' : 'ผลจากการส่งคำตอบ (เทียบกับชุดทดสอบจริงของโจทย์)' }}
        </div>

        <template v-if="resultSource === 'submit'">
          <div class="mt-1">
            {{ result.passed ? 'ผ่านทุก test case!' : `ผ่าน ${result.passedCases}/${result.totalCases} test case` }}
          </div>
        </template>

        <template v-else>
          <div v-if="result.statusDescription" class="mt-1">{{ result.statusDescription }}</div>
          <pre v-if="outputText" class="mb-0 mt-2" style="white-space: pre-wrap;">{{ outputText }}</pre>
        </template>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
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
      resultSource: null
    }
  },
  computed: {
    outputText () {
      if (!this.result) return ''
      return this.result.compileOutput || this.result.stderr || this.result.stdout || ''
    },
    alertType () {
      if (!this.result) return 'info'
      if (this.result.passed === true) return 'success'
      if (this.result.passed === false) return 'warning'
      return this.result.statusId === 3 ? 'success' : 'error'
    }
  },
  methods: {
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
          confirmButtonColor: '#2e7d32'
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
        this.$emit('submitted', response.result)
      } catch (error) {
        await this.$swal({
          icon: 'error',
          title: 'ส่งคำตอบไม่สำเร็จ',
          text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#2e7d32'
        })
      }
      this.submitting = false
    }
  }
}
</script>
