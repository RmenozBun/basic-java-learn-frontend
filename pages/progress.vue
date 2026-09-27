<template>
  <v-container>
    <v-card>
      <v-card-title class="page-title"><strong>ความคืบหน้าของฉัน</strong></v-card-title>
      <div class="pa-md-6 pa-3">
        <div v-if="!student" class="text-center py-8">
          <p class="grey--text mb-4">กรุณากรอกชื่อและอีเมลก่อนดูความคืบหน้า</p>
          <v-btn color="primary" nuxt to="/start">ไปหน้ากรอกข้อมูล</v-btn>
        </div>

        <div v-else-if="progress">
          <v-row>
            <v-col v-for="level in levels" :key="level.key" cols="12" md="4">
              <v-card outlined class="pa-4 text-center">
                <v-chip small class="mb-3" :class="'level-chip-' + level.key">{{ level.label }}</v-chip>
                <div class="text-h4 font-weight-bold">
                  {{ progress.completedByLevel[level.key] }} / {{ progress.totalByLevel[level.key] }}
                </div>
                <div class="grey--text">แบบฝึกหัดที่ผ่านแล้ว</div>
                <v-progress-linear
                  class="mt-3"
                  :value="percent(level.key)"
                  color="primary"
                  height="10"
                  rounded
                />
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
const LEVELS = [
  { key: 'easy', label: 'ง่าย' },
  { key: 'medium', label: 'กลาง' },
  { key: 'hard', label: 'ยาก' }
]

export default {
  name: 'ProgressPage',
  data () {
    return {
      levels: LEVELS,
      progress: null
    }
  },
  computed: {
    student () {
      return this.$store.state.student
    }
  },
  mounted () {
    if (this.student) this.fetchProgress()
  },
  methods: {
    percent (level) {
      const total = this.progress.totalByLevel[level]
      if (!total) return 0
      return Math.round((this.progress.completedByLevel[level] / total) * 100)
    },
    async fetchProgress () {
      this.$Notiflix.loading()
      try {
        const response = await this.$axios.$get('/progress', { params: { email: this.student.email } })
        this.progress = response.result
      } catch (error) {
        await this.$swal({
          icon: 'error',
          title: 'ไม่สามารถดึงความคืบหน้าได้',
          text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#2e7d32'
        })
      }
      this.$Notiflix.remove()
    }
  }
}
</script>
