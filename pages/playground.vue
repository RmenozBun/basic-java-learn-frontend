<template>
  <v-container>
    <v-card>
      <v-card-title class="page-title"><strong>Playground — เขียนโค้ด Java อิสระ</strong></v-card-title>
      <div class="pa-md-6 pa-3">
        <v-alert
          type="info"
          outlined
          dense
          class="mb-4"
        >
          <div class="font-weight-bold mb-1">ข้อจำกัดของระบบรันโค้ด</div>
          <ul class="pl-4 mb-0">
            <li>รองรับเฉพาะ<strong>ภาษาอังกฤษ</strong>ในโค้ดและ input เท่านั้น (ยังไม่รองรับภาษาไทยหรืออักขระพิเศษ)</li>
            <li>ถ้าโค้ดมี <code>Scanner</code> อ่านค่า ต้องใส่ค่าใน "Standard Input" ก่อนกดรัน ไม่งั้นจะ error</li>
            <li>เขียนได้ไฟล์เดียว ใช้ได้เฉพาะ Java SE มาตรฐาน (import library ภายนอกไม่ได้)</li>
            <li>เป็นบริการฟรีสาธารณะ ไม่มี SLA — โค้ดที่หนักหรือวนลูปไม่จบจะถูกตัดการทำงาน</li>
          </ul>
        </v-alert>

        <v-row>
          <v-col cols="12" md="7">
            <div class="mb-2 font-weight-bold">โค้ด</div>
            <CodeEditor v-model="code" height="420px" />
          </v-col>
          <v-col cols="12" md="5">
            <div class="mb-2 font-weight-bold">Standard Input (ถ้ามี)</div>
            <v-textarea v-model="stdin" outlined rows="4" placeholder="ค่าที่จะป้อนให้โปรแกรมผ่าน Scanner" />

            <v-btn color="primary" block :loading="running" class="mt-2" @click="run">
              รัน
            </v-btn>

            <div class="mt-4">
              <div class="font-weight-bold mb-1">ผลลัพธ์</div>
              <v-alert v-if="result" :type="alertType" outlined dense class="mb-0">
                <div class="mb-1">{{ result.statusDescription }}</div>
                <pre style="white-space: pre-wrap;" class="mb-0">{{ outputText }}</pre>
              </v-alert>
              <div v-else class="grey--text">ยังไม่มีผลลัพธ์ — กด "รัน" เพื่อดูผลลัพธ์</div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>

<script>
const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`

export default {
  name: 'PlaygroundPage',
  data () {
    return {
      code: DEFAULT_CODE,
      stdin: '',
      running: false,
      result: null
    }
  },
  computed: {
    outputText () {
      if (!this.result) return ''
      return this.result.compileOutput || this.result.stderr || this.result.stdout || '(ไม่มีผลลัพธ์ทางหน้าจอ)'
    },
    alertType () {
      if (!this.result) return 'info'
      return this.result.statusId === 3 ? 'success' : 'error'
    }
  },
  methods: {
    async run () {
      this.running = true
      this.result = null
      try {
        const response = await this.$axios.$post('/execute', { code: this.code, stdin: this.stdin })
        this.result = response.result
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
    }
  }
}
</script>
