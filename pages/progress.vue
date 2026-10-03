<template>
  <div>
    <section class="pr-hero">
      <div class="page-wrap pr-hero__inner">
        <div>
          <div class="eyebrow pr-hero__eyebrow">ความคืบหน้า</div>
          <h1 class="pr-hero__title">ความคืบหน้าของฉัน 📈</h1>
          <p class="pr-hero__text">{{ message }}</p>
        </div>
        <v-progress-circular v-if="student && progress" :value="overallPercent" :size="120" :width="12" color="accent" class="ring">
          <span class="ring__num">{{ overallPercent }}%</span>
        </v-progress-circular>
      </div>
    </section>

    <div class="page-wrap pr">
      <div v-if="!student" class="guest">
        <div class="guest__icon">☕</div>
        <div class="guest__title">ยังไม่ได้เข้าสู่การเรียน</div>
        <p class="guest__text">ใส่ชื่อและอีเมลเพื่อเก็บความคืบหน้าการเรียนของคุณ (ไม่ต้องสมัครสมาชิก ไม่ต้องตั้งรหัสผ่าน)</p>
        <v-btn color="primary" large depressed nuxt to="/start">เริ่มเรียนเลย →</v-btn>
      </div>

      <template v-else-if="progress">
        <v-row>
          <v-col v-for="level in levels" :key="level.key" cols="12" md="4">
            <v-card outlined class="level-card">
              <div class="level-card__top">
                <span class="level-card__icon">{{ level.icon }}</span>
                <div>
                  <div class="level-card__name">ระดับ{{ level.name }}</div>
                  <div class="level-card__count">
                    แบบฝึกหัดที่ผ่าน {{ progress.completedByLevel[level.key] }}/{{ progress.totalByLevel[level.key] }}
                  </div>
                </div>
              </div>
              <v-progress-linear :value="percent(level.key)" :color="level.color" background-color="#efe2d1" height="10" rounded />
            </v-card>
          </v-col>
        </v-row>

        <div v-for="level in levels" :key="'list-' + level.key" class="checklist">
          <div class="checklist__title">{{ level.icon }} บทเรียนระดับ{{ level.name }}</div>
          <nuxt-link v-for="lesson in lessonsOf(level.key)" :key="lesson._id" :to="'/lessons/' + lesson.slug" class="check-item">
            <span class="check-item__mark" :class="{ 'check-item__mark--done': lesson.completed }">
              {{ lesson.completed ? '✓' : '' }}
            </span>
            <span class="check-item__icon">{{ lesson.icon || '📘' }}</span>
            <span class="check-item__title">{{ lesson.title }}</span>
            <span class="check-item__state">{{ lesson.completed ? 'เรียนจบแล้ว' : 'ยังไม่จบ' }}</span>
          </nuxt-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
const LEVELS = [
  { key: 'easy', icon: '🌱', name: 'ง่าย', color: '#4f7a3a' },
  { key: 'medium', icon: '⚡', name: 'กลาง', color: '#d98b00' },
  { key: 'hard', icon: '🔥', name: 'ยาก', color: '#b23a2b' }
]

export default {
  name: 'ProgressPage',
  data () {
    return {
      levels: LEVELS,
      progress: null,
      lessons: []
    }
  },
  computed: {
    student () {
      return this.$store.state.student
    },
    totalExercises () {
      if (!this.progress) return 0
      return Object.values(this.progress.totalByLevel).reduce((sum, n) => sum + n, 0)
    },
    doneExercises () {
      if (!this.progress) return 0
      return Object.values(this.progress.completedByLevel).reduce((sum, n) => sum + n, 0)
    },
    overallPercent () {
      return this.totalExercises ? Math.round((this.doneExercises / this.totalExercises) * 100) : 0
    },
    message () {
      if (!this.student) return 'เข้าสู่การเรียนก่อน แล้วเราจะช่วยจดความคืบหน้าให้'
      if (!this.progress) return 'กำลังโหลดความคืบหน้า...'
      if (this.overallPercent === 0) return 'ยังไม่ได้เริ่ม เริ่มจากบทแรกได้เลย ทุกคนเริ่มจากศูนย์ทั้งนั้น'
      if (this.overallPercent < 50) return 'เริ่มต้นได้ดีมาก! ไปต่ออีกนิดก็จะถึงครึ่งทาง'
      if (this.overallPercent < 100) return 'เกินครึ่งทางแล้ว สู้ๆ อีกไม่กี่บทก็จบคอร์ส'
      return '🎉 เรียนจบทุกบทแล้ว! ลองเขียนโปรแกรมที่คุณสนใจใน Playground ต่อได้เลย'
    }
  },
  mounted () {
    if (this.student) this.fetchAll()
  },
  methods: {
    percent (level) {
      const total = this.progress.totalByLevel[level]
      if (!total) return 0
      return Math.round((this.progress.completedByLevel[level] / total) * 100)
    },
    lessonsOf (level) {
      return this.lessons.filter((lesson) => lesson.level === level)
    },
    async fetchAll () {
      this.$Notiflix.loading()
      try {
        const params = { email: this.student.email }
        const [progress, lessons] = await Promise.all([
          this.$axios.$get('/progress', { params }),
          this.$axios.$get('/lesson', { params })
        ])
        this.progress = progress.result
        this.lessons = lessons.result
      } catch (error) {
        await this.$swal({
          icon: 'error',
          title: 'ไม่สามารถดึงความคืบหน้าได้',
          text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#B85400'
        })
      }
      this.$Notiflix.remove()
    }
  }
}
</script>

<style scoped>
.pr-hero {
  padding: 36px 16px;
  color: #fff4e4;
  background:
    radial-gradient(circle at 90% 0%, rgba(248, 152, 32, 0.2), transparent 45%),
    linear-gradient(135deg, #2a1b13 0%, #3b2418 65%, #5a3320 100%);
}

.pr-hero__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
}

.pr-hero__eyebrow {
  color: var(--c-amber);
}

.pr-hero__title {
  margin: 4px 0 8px;
  font-family: var(--font-head);
  font-size: clamp(1.6rem, 3.4vw, 2.2rem);
  font-weight: 700;
}

.pr-hero__text {
  max-width: 560px;
  margin: 0;
  line-height: 1.75;
  color: #e8d3bc;
}

.ring {
  background: transparent;
}

.ring >>> .v-progress-circular__underlay {
  stroke: rgba(255, 255, 255, 0.14);
}

.ring__num {
  font-family: var(--font-head);
  font-size: 1.7rem;
  font-weight: 700;
  color: #fff;
}

.pr {
  padding: 28px 16px 0;
}

.guest {
  max-width: 520px;
  margin: 24px auto;
  padding: 36px 28px;
  text-align: center;
  background: var(--c-paper);
  border: 1px solid var(--c-line);
  border-radius: 20px;
}

.guest__icon {
  font-size: 44px;
}

.guest__title {
  margin: 6px 0;
  font-family: var(--font-head);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--c-espresso);
}

.guest__text {
  margin-bottom: 20px;
  line-height: 1.75;
  color: var(--c-muted);
}

.level-card {
  padding: 20px;
}

.level-card__top {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}

.level-card__icon {
  font-size: 32px;
}

.level-card__name {
  font-family: var(--font-head);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--c-espresso);
}

.level-card__count {
  font-size: 0.9rem;
  color: var(--c-muted);
}

.checklist {
  margin-top: 26px;
}

.checklist__title {
  margin-bottom: 10px;
  font-family: var(--font-head);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-espresso);
}

.check-item {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
  padding: 12px 16px;
  color: var(--c-text);
  text-decoration: none;
  background: var(--c-paper);
  border: 1px solid var(--c-line);
  border-radius: 12px;
  transition: all 0.15s ease;
}

.check-item:hover {
  border-color: var(--c-orange);
  box-shadow: var(--shadow-soft);
}

.check-item__mark {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-weight: 700;
  color: #fff;
  border: 2px solid var(--c-latte);
  border-radius: 50%;
}

.check-item__mark--done {
  background: #3b7d3f;
  border-color: #3b7d3f;
}

.check-item__icon {
  font-size: 22px;
}

.check-item__title {
  flex: 1;
  font-family: var(--font-head);
  font-weight: 500;
}

.check-item__state {
  font-size: 0.85rem;
  color: var(--c-muted);
}
</style>
