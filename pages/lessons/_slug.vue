<template>
  <v-container v-if="lesson">
    <v-btn text small class="mb-3" nuxt to="/lessons">
      ← กลับไปหน้าบทเรียนทั้งหมด
    </v-btn>

    <v-card class="mb-6">
      <v-card-title class="page-title">
        <strong>{{ lesson.title }}</strong>
      </v-card-title>
      <div class="pa-md-6 pa-3">
        <v-chip small class="mb-4" :class="'level-chip-' + lesson.level">
          {{ levelIcon(lesson.level) }} {{ levelLabel(lesson.level) }}
        </v-chip>
        <div class="lesson-content" v-html="renderedContent" />
      </div>
    </v-card>

    <div v-if="lesson.exercises && lesson.exercises.length">
      <div class="text-h6 font-weight-bold mb-4">แบบฝึกหัด</div>
      <ExerciseCard
        v-for="exercise in exerciseDetails"
        :key="exercise._id"
        :exercise="exercise"
        @submitted="onExerciseSubmitted(exercise._id, $event)"
      />
    </div>

    <v-alert v-if="lessonCompleted" type="success" outlined prominent class="mt-2">
      <div class="text-h6 mb-1">🎉 เก่งมาก! ผ่านบทนี้แล้ว</div>
      <div class="mb-4">พร้อมไปบทถัดไปหรือกลับไปเลือกบทอื่นก็ได้</div>
      <v-row no-gutters>
        <v-btn v-if="lesson.nextLesson" color="success" class="mr-2" nuxt :to="'/lessons/' + lesson.nextLesson.slug">
          บทถัดไป: {{ lesson.nextLesson.title }} →
        </v-btn>
        <v-btn outlined color="success" nuxt to="/lessons">
          กลับไปหน้าบทเรียนทั้งหมด
        </v-btn>
      </v-row>
    </v-alert>

    <v-row class="mt-6" no-gutters>
      <v-col cols="6">
        <v-btn v-if="lesson.prevLesson" text nuxt :to="'/lessons/' + lesson.prevLesson.slug">
          ← {{ lesson.prevLesson.title }}
        </v-btn>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn v-if="lesson.nextLesson" text nuxt :to="'/lessons/' + lesson.nextLesson.slug">
          {{ lesson.nextLesson.title }} →
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { marked } from 'marked'

const LEVEL_LABEL = { easy: 'ง่าย', medium: 'กลาง', hard: 'ยาก' }
const LEVEL_ICON = { easy: '🌱', medium: '⚡', hard: '🔥' }

export default {
  name: 'LessonDetailPage',
  data () {
    return {
      lesson: null,
      exerciseDetails: [],
      passedExerciseIds: []
    }
  },
  computed: {
    renderedContent () {
      return this.lesson ? marked.parse(this.lesson.contentMarkdown) : ''
    },
    lessonCompleted () {
      if (!this.exerciseDetails.length) return false
      return this.exerciseDetails.every((exercise) => this.passedExerciseIds.includes(exercise._id))
    }
  },
  watch: {
    '$route.params.slug': 'fetchLesson'
  },
  mounted () {
    this.fetchLesson()
  },
  methods: {
    levelLabel (level) {
      return LEVEL_LABEL[level] || level
    },
    levelIcon (level) {
      return LEVEL_ICON[level] || ''
    },
    onExerciseSubmitted (exerciseId, result) {
      if (result.passed && !this.passedExerciseIds.includes(exerciseId)) {
        this.passedExerciseIds.push(exerciseId)
      }
    },
    async fetchLesson () {
      this.$Notiflix.loading()
      this.passedExerciseIds = []
      try {
        const student = this.$store.state.student
        const params = student ? { email: student.email } : {}
        const response = await this.$axios.$get('/lesson/' + this.$route.params.slug, { params })
        this.lesson = response.result
        this.exerciseDetails = response.result.exercises || []
        this.passedExerciseIds = this.exerciseDetails.filter((exercise) => exercise.passed).map((exercise) => exercise._id)
      } catch (error) {
        this.$Notiflix.remove()
        await this.$swal({
          icon: 'error',
          title: 'ไม่พบบทเรียนนี้',
          text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#2e7d32'
        })
        await this.$router.replace('/lessons')
        return
      }
      this.$Notiflix.remove()
    }
  }
}
</script>

<style scoped>
.lesson-content >>> pre {
  background: #282a36;
  color: #f8f8f2;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
}
.lesson-content >>> code {
  font-family: 'Courier New', monospace;
}
</style>
