<template>
  <v-container>
    <v-card>
      <v-card-title class="page-title"><strong>บทเรียนทั้งหมด</strong></v-card-title>
      <div class="pa-md-6 pa-3">
        <div v-if="progress" class="mb-6">
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="font-weight-bold">ความคืบหน้าทั้งหมด</span>
            <span class="grey--text text--darken-1">{{ totalCompleted }}/{{ totalExercises }} แบบฝึกหัด</span>
          </div>
          <v-progress-linear :value="overallPercent" color="primary" height="10" rounded />
        </div>

        <v-tabs v-model="tab" class="mb-4" show-arrows>
          <v-tab v-for="level in levelTabs" :key="level.key">
            <span class="mr-1">{{ level.icon }}</span> {{ level.label }}
          </v-tab>
        </v-tabs>

        <v-row v-if="filteredLessons.length">
          <v-col v-for="lesson in filteredLessons" :key="lesson._id" cols="12" md="6" lg="4">
            <v-card
              outlined
              hover
              class="pa-4 fill-height d-flex flex-column lesson-card"
              :class="{ 'lesson-card--done': lesson.completed }"
              @click="$router.push('/lessons/' + lesson.slug)"
            >
              <div class="d-flex justify-space-between align-start mb-2">
                <v-chip small :class="'level-chip-' + lesson.level">
                  {{ levelIcon(lesson.level) }} {{ levelLabel(lesson.level) }}
                </v-chip>
                <span v-if="lesson.completed" class="lesson-card__done-badge" title="เรียนจบแล้ว">✅</span>
              </div>
              <div class="text-h6 font-weight-bold mb-2">{{ lesson.title }}</div>
              <div class="grey--text text--darken-1">{{ lesson.summary }}</div>
            </v-card>
          </v-col>
        </v-row>
        <div v-else class="text-center grey--text py-8">
          ไม่พบบทเรียนในระดับนี้
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
const LEVEL_TABS = [
  { key: '', label: 'ทั้งหมด', icon: '📚' },
  { key: 'easy', label: 'ง่าย', icon: '🌱' },
  { key: 'medium', label: 'กลาง', icon: '⚡' },
  { key: 'hard', label: 'ยาก', icon: '🔥' }
]
const LEVEL_LABEL = { easy: 'ง่าย', medium: 'กลาง', hard: 'ยาก' }
const LEVEL_ICON = { easy: '🌱', medium: '⚡', hard: '🔥' }

export default {
  name: 'LessonsPage',
  data () {
    return {
      tab: 0,
      lessons: [],
      progress: null,
      levelTabs: LEVEL_TABS
    }
  },
  computed: {
    student () {
      return this.$store.state.student
    },
    filteredLessons () {
      const level = LEVEL_TABS[this.tab].key
      if (!level) return this.lessons
      return this.lessons.filter((lesson) => lesson.level === level)
    },
    totalExercises () {
      if (!this.progress) return 0
      return Object.values(this.progress.totalByLevel).reduce((sum, n) => sum + n, 0)
    },
    totalCompleted () {
      if (!this.progress) return 0
      return Object.values(this.progress.completedByLevel).reduce((sum, n) => sum + n, 0)
    },
    overallPercent () {
      if (!this.totalExercises) return 0
      return Math.round((this.totalCompleted / this.totalExercises) * 100)
    }
  },
  mounted () {
    this.fetchLessons()
    if (this.student) this.fetchProgress()
  },
  methods: {
    levelLabel (level) {
      return LEVEL_LABEL[level] || level
    },
    levelIcon (level) {
      return LEVEL_ICON[level] || ''
    },
    async fetchLessons () {
      this.$Notiflix.loading()
      try {
        const params = this.student ? { email: this.student.email } : {}
        const response = await this.$axios.$get('/lesson', { params })
        this.lessons = response.result
      } catch (error) {
        await this.$swal({
          icon: 'error',
          title: 'ไม่สามารถดึงบทเรียนได้',
          text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#2e7d32'
        })
      }
      this.$Notiflix.remove()
    },
    async fetchProgress () {
      try {
        const response = await this.$axios.$get('/progress', { params: { email: this.student.email } })
        this.progress = response.result
      } catch (error) {
        // Non-critical: the lesson list still works without the progress bar
      }
    }
  }
}
</script>

<style scoped>
.lesson-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.lesson-card:hover {
  transform: translateY(-2px);
}
.lesson-card--done {
  border-color: #2e7d32 !important;
  background-color: #f1f8f2;
}
.lesson-card__done-badge {
  font-size: 20px;
  line-height: 1;
}
</style>
