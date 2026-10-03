<template>
  <div v-if="lesson">
    <section class="lesson-hero">
      <div class="page-wrap">
        <nav class="crumbs">
          <nuxt-link to="/lessons">บทเรียน</nuxt-link>
          <span>›</span>
          <nuxt-link :to="'/lessons?level=' + lesson.level">ระดับ{{ levelLabel(lesson.level) }}</nuxt-link>
          <span>›</span>
          <span class="crumbs__current">{{ lesson.title }}</span>
        </nav>

        <div class="lesson-hero__row">
          <span class="lesson-hero__icon">{{ lesson.icon || '📘' }}</span>
          <div>
            <div class="lesson-hero__meta">
              <v-chip small :class="'level-chip-' + lesson.level">
                {{ levelIcon(lesson.level) }} {{ levelLabel(lesson.level) }}
              </v-chip>
              <span v-if="lessonNumber">บทที่ {{ lessonNumber }}</span>
              <span v-if="lesson.minutes">⏱ ประมาณ {{ lesson.minutes }} นาที</span>
            </div>
            <h1 class="lesson-hero__title">{{ lesson.title }}</h1>
            <p class="lesson-hero__summary">{{ lesson.summary }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="page-wrap lesson-layout">
      <aside class="lesson-side">
        <div class="side-card">
          <div class="side-card__title">สารบัญบทเรียน</div>
          <div v-for="group in sideGroups" :key="group.key" class="side-group">
            <div class="side-group__name">{{ group.icon }} ระดับ{{ group.name }}</div>
            <nuxt-link
              v-for="item in group.items"
              :key="item.slug"
              :to="'/lessons/' + item.slug"
              class="side-item"
              :class="{ 'side-item--active': item.slug === lesson.slug }"
            >
              <span class="side-item__num">{{ item.number }}</span>
              <span class="side-item__title">{{ item.title }}</span>
              <span v-if="item.completed" class="side-item__done">✓</span>
            </nuxt-link>
          </div>
        </div>
      </aside>

      <main class="lesson-main">
        <article ref="content" class="lesson-content" @click="onContentClick" v-html="renderedContent" />

        <section v-if="exerciseDetails.length" class="exercises">
          <h2 class="exercises__title">✍️ ลงมือทำแบบฝึกหัด</h2>
          <ExerciseCard
            v-for="exercise in exerciseDetails"
            :key="exercise._id"
            :exercise="exercise"
            @submitted="onExerciseSubmitted(exercise._id, $event)"
          />
        </section>

        <div v-if="lessonCompleted" class="complete pop-in">
          <div class="complete__title">🎉 เก่งมาก! คุณเรียนจบบทนี้แล้ว</div>
          <div class="complete__text">พร้อมไปบทถัดไป หรือกลับไปทบทวน/เลือกบทอื่นก็ได้</div>
          <div class="complete__actions">
            <v-btn v-if="lesson.nextLesson" color="primary" depressed large nuxt :to="'/lessons/' + lesson.nextLesson.slug">
              บทถัดไป: {{ lesson.nextLesson.title }} →
            </v-btn>
            <v-btn v-else color="primary" depressed large nuxt to="/progress">ดูความคืบหน้าทั้งหมด →</v-btn>
            <v-btn outlined color="primary" large nuxt to="/lessons">กลับไปหน้าบทเรียน</v-btn>
          </div>
        </div>

        <div class="pager">
          <nuxt-link v-if="lesson.prevLesson" :to="'/lessons/' + lesson.prevLesson.slug" class="pager__item">
            <span class="pager__hint">← บทก่อนหน้า</span>
            <span class="pager__title">{{ lesson.prevLesson.icon }} {{ lesson.prevLesson.title }}</span>
          </nuxt-link>
          <span v-else />
          <nuxt-link v-if="lesson.nextLesson" :to="'/lessons/' + lesson.nextLesson.slug" class="pager__item pager__item--next">
            <span class="pager__hint">บทถัดไป →</span>
            <span class="pager__title">{{ lesson.nextLesson.icon }} {{ lesson.nextLesson.title }}</span>
          </nuxt-link>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { renderMarkdown, highlightCodeBlocks, handleCodeBlockClick } from '~/utils/markdown'

const LEVELS = [
  { key: 'easy', icon: '🌱', name: 'ง่าย' },
  { key: 'medium', icon: '⚡', name: 'กลาง' },
  { key: 'hard', icon: '🔥', name: 'ยาก' }
]

export default {
  name: 'LessonDetailPage',
  data () {
    return {
      lesson: null,
      exerciseDetails: [],
      passedExerciseIds: [],
      allLessons: []
    }
  },
  computed: {
    student () {
      return this.$store.state.student
    },
    renderedContent () {
      return this.lesson ? renderMarkdown(this.lesson.contentMarkdown) : ''
    },
    lessonCompleted () {
      if (!this.exerciseDetails.length) return false
      return this.exerciseDetails.every((exercise) => this.passedExerciseIds.includes(exercise._id))
    },
    numberedLessons () {
      return this.allLessons.map((item, index) => ({ ...item, number: index + 1 }))
    },
    lessonNumber () {
      const current = this.numberedLessons.find((item) => this.lesson && item.slug === this.lesson.slug)
      return current ? current.number : 0
    },
    sideGroups () {
      return LEVELS
        .map((level) => ({ ...level, items: this.numberedLessons.filter((item) => item.level === level.key) }))
        .filter((group) => group.items.length)
    }
  },
  watch: {
    '$route.params.slug' () {
      this.fetchLesson()
      if (process.client) window.scrollTo({ top: 0 })
    },
    lessonCompleted (value) {
      if (!value || !this.lesson) return
      const entry = this.allLessons.find((item) => item.slug === this.lesson.slug)
      if (entry) this.$set(entry, 'completed', true)
    }
  },
  mounted () {
    this.fetchLesson()
    this.fetchLessonList()
  },
  updated () {
    this.$nextTick(() => highlightCodeBlocks(this.$refs.content))
  },
  methods: {
    levelLabel (level) {
      return (LEVELS.find((item) => item.key === level) || {}).name || level
    },
    levelIcon (level) {
      return (LEVELS.find((item) => item.key === level) || {}).icon || ''
    },
    onContentClick (event) {
      handleCodeBlockClick(event, (draft) => {
        this.$store.commit('setPlaygroundDraft', draft)
        this.$router.push('/playground')
      })
    },
    onExerciseSubmitted (exerciseId, result) {
      if (result.passed && !this.passedExerciseIds.includes(exerciseId)) {
        this.passedExerciseIds.push(exerciseId)
      }
    },
    async fetchLessonList () {
      try {
        const params = this.student ? { email: this.student.email } : {}
        const response = await this.$axios.$get('/lesson', { params })
        this.allLessons = response.result
      } catch (error) {
        // The sidebar is a convenience; the lesson itself still works without it
      }
    },
    async fetchLesson () {
      this.$Notiflix.loading()
      this.passedExerciseIds = []
      try {
        const params = this.student ? { email: this.student.email } : {}
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
          confirmButtonColor: '#B85400'
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
.lesson-hero {
  padding: 28px 16px 34px;
  color: #fff4e4;
  background:
    radial-gradient(circle at 92% 0%, rgba(248, 152, 32, 0.2), transparent 45%),
    linear-gradient(135deg, #2a1b13 0%, #3b2418 65%, #5a3320 100%);
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
  font-size: 0.88rem;
  color: #cdb8a5;
}

.crumbs a {
  color: #f1dcc4;
  text-decoration: none;
}

.crumbs a:hover {
  color: var(--c-amber);
}

.crumbs__current {
  color: #fff;
}

.lesson-hero__row {
  display: flex;
  gap: 20px;
  align-items: center;
}

.lesson-hero__icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  font-size: 38px;
  background: rgba(255, 244, 228, 0.1);
  border: 1px solid rgba(255, 244, 228, 0.2);
  border-radius: 20px;
}

.lesson-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #e8d3bc;
}

.lesson-hero__title {
  margin: 0 0 6px;
  font-family: var(--font-head);
  font-size: clamp(1.5rem, 3.4vw, 2.2rem);
  font-weight: 700;
  line-height: 1.3;
}

.lesson-hero__summary {
  max-width: 720px;
  margin: 0;
  line-height: 1.75;
  color: #e8d3bc;
}

.lesson-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  padding: 32px 16px 0;
}

.lesson-side {
  position: sticky;
  top: 84px;
  flex: 0 0 270px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.side-card {
  padding: 16px;
  background: var(--c-paper);
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
}

.side-card__title {
  margin-bottom: 8px;
  font-family: var(--font-head);
  font-weight: 700;
  color: var(--c-espresso);
}

.side-group__name {
  margin: 14px 0 6px;
  font-family: var(--font-head);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--c-muted);
}

.side-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 7px 8px;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--c-text);
  text-decoration: none;
  border-radius: 10px;
  transition: background 0.15s ease;
}

.side-item:hover {
  background: var(--c-foam);
}

.side-item--active {
  font-weight: 600;
  color: var(--c-orange);
  background: #fdebd6;
}

.side-item__num {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-family: var(--font-head);
  font-size: 0.72rem;
  font-weight: 700;
  color: #fff;
  background: var(--c-coffee);
  border-radius: 50%;
}

.side-item--active .side-item__num {
  background: var(--c-orange);
}

.side-item__title {
  flex: 1;
}

.side-item__done {
  font-weight: 700;
  color: #3b7d3f;
}

.lesson-main {
  flex: 1 1 0;
  min-width: 0;
  max-width: 840px;
}

.exercises {
  margin-top: 48px;
}

.exercises__title {
  margin: 0 0 18px;
  font-family: var(--font-head);
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--c-espresso);
}

.complete {
  margin-top: 8px;
  padding: 26px 28px;
  color: #fff4e4;
  background: linear-gradient(120deg, #3b2418 0%, #5a3320 100%);
  border-radius: 18px;
  box-shadow: var(--shadow-soft);
}

.complete__title {
  font-family: var(--font-head);
  font-size: 1.4rem;
  font-weight: 700;
}

.complete__text {
  margin: 4px 0 16px;
  color: #e8d3bc;
}

.complete__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.complete__actions .v-btn.v-btn--outlined {
  color: #fff4e4 !important;
  border-color: rgba(255, 244, 228, 0.5);
}

.pager {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: space-between;
  margin-top: 36px;
}

.pager__item {
  display: flex;
  flex: 1 1 260px;
  flex-direction: column;
  gap: 2px;
  padding: 14px 18px;
  text-decoration: none;
  background: var(--c-paper);
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
  transition: all 0.18s ease;
}

.pager__item:hover {
  border-color: var(--c-orange);
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.pager__item--next {
  text-align: right;
}

.pager__hint {
  font-size: 0.82rem;
  color: var(--c-muted);
}

.pager__title {
  font-family: var(--font-head);
  font-weight: 600;
  color: var(--c-espresso);
}

@media (max-width: 960px) {
  .lesson-side {
    display: none;
  }

  .lesson-layout {
    padding-top: 24px;
  }
}

@media (max-width: 600px) {
  .lesson-hero__icon {
    width: 56px;
    height: 56px;
    font-size: 28px;
    border-radius: 16px;
  }

  .lesson-hero__row {
    gap: 14px;
  }
}
</style>
