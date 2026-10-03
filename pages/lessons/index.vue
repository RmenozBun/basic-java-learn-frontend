<template>
  <div>
    <section class="banner">
      <div class="page-wrap banner__inner">
        <div class="banner__text-wrap">
          <div class="eyebrow banner__eyebrow">บทเรียนทั้งหมด</div>
          <h1 class="banner__title">{{ greeting }}</h1>
          <p class="banner__text">{{ bannerText }}</p>
          <v-btn color="accent" light depressed large class="banner__btn" @click="goNext">
            {{ nextLabel }}
          </v-btn>
        </div>

        <div v-if="student && total" class="banner__ring">
          <v-progress-circular :value="percent" :size="124" :width="12" color="accent" class="ring">
            <span class="ring__num">{{ percent }}%</span>
          </v-progress-circular>
          <div class="ring__label">เรียนจบแล้ว {{ completedCount }}/{{ total }} บท</div>
        </div>
      </div>
    </section>

    <section class="page-wrap list">
      <div class="filters">
        <button
          v-for="option in filterOptions"
          :key="option.key"
          type="button"
          class="filter"
          :class="{ 'filter--active': filter === option.key }"
          @click="setFilter(option.key)"
        >
          <span>{{ option.icon }}</span> {{ option.label }}
        </button>
      </div>

      <div v-if="loading" class="empty">กำลังโหลดบทเรียน...</div>

      <template v-else>
        <div v-for="group in groups" :key="group.key" class="level-group">
          <div class="level-group__head">
            <div class="level-group__title">
              <span class="level-group__icon">{{ group.icon }}</span>
              <div>
                <div class="level-group__name">ระดับ{{ group.name }}</div>
                <div class="level-group__desc">{{ group.desc }}</div>
              </div>
            </div>
            <v-chip v-if="student" small :class="'level-chip-' + group.key">
              เรียนจบ {{ group.done }}/{{ group.lessons.length }}
            </v-chip>
          </div>

          <v-row>
            <v-col v-for="lesson in group.lessons" :key="lesson._id" cols="12" md="6" lg="4">
              <v-card
                outlined
                nuxt
                :to="'/lessons/' + lesson.slug"
                class="lesson-card hover-lift fill-height"
                :class="{ 'lesson-card--done': lesson.completed }"
              >
                <div class="lesson-card__head">
                  <span class="lesson-card__num">{{ lesson.number }}</span>
                  <span class="lesson-card__icon">{{ lesson.icon }}</span>
                  <span v-if="lesson.completed" class="lesson-card__done">✓ เรียนจบแล้ว</span>
                </div>
                <div class="lesson-card__title">{{ lesson.title }}</div>
                <div class="lesson-card__summary">{{ lesson.summary }}</div>
                <div class="lesson-card__meta">
                  <span v-if="lesson.minutes">⏱ ประมาณ {{ lesson.minutes }} นาที</span>
                  <span v-else />
                  <span class="lesson-card__go">{{ lesson.completed ? 'ทบทวน' : 'เริ่มเรียน' }} →</span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div v-if="!groups.length" class="empty">ไม่พบบทเรียนในระดับนี้</div>
      </template>
    </section>
  </div>
</template>

<script>
const LEVELS = [
  { key: 'easy', icon: '🌱', name: 'ง่าย', desc: 'พื้นฐานที่ต้องรู้ก่อนเขียนโปรแกรมทุกชนิด' },
  { key: 'medium', icon: '⚡', name: 'กลาง', desc: 'ทำซ้ำ จัดการข้อมูลหลายตัว และแบ่งโค้ดเป็นส่วนๆ' },
  { key: 'hard', icon: '🔥', name: 'ยาก', desc: 'แนวคิด OOP และเครื่องมือที่ใช้จริงในงาน' }
]

export default {
  name: 'LessonsPage',
  data () {
    const queryLevel = this.$route.query.level
    return {
      loading: true,
      lessons: [],
      filter: LEVELS.some((level) => level.key === queryLevel) ? queryLevel : '',
      filterOptions: [{ key: '', icon: '📚', label: 'ทั้งหมด' }].concat(
        LEVELS.map((level) => ({ key: level.key, icon: level.icon, label: level.name }))
      )
    }
  },
  computed: {
    student () {
      return this.$store.state.student
    },
    numbered () {
      // icon/minutes may be missing on lessons seeded before they existed
      return this.lessons.map((lesson, index) => ({ ...lesson, icon: lesson.icon || '📘', number: index + 1 }))
    },
    groups () {
      return LEVELS
        .filter((level) => !this.filter || level.key === this.filter)
        .map((level) => {
          const lessons = this.numbered.filter((lesson) => lesson.level === level.key)
          return { ...level, lessons, done: lessons.filter((lesson) => lesson.completed).length }
        })
        .filter((group) => group.lessons.length)
    },
    total () {
      return this.lessons.length
    },
    completedCount () {
      return this.lessons.filter((lesson) => lesson.completed).length
    },
    percent () {
      return this.total ? Math.round((this.completedCount / this.total) * 100) : 0
    },
    allDone () {
      return this.total > 0 && this.completedCount === this.total
    },
    nextLesson () {
      return this.numbered.find((lesson) => !lesson.completed)
    },
    greeting () {
      return this.student ? `สวัสดี ${this.student.name} ☕` : 'ยินดีต้อนรับสู่ห้องเรียน Java ☕'
    },
    bannerText () {
      if (!this.student) return 'ใส่ชื่อและอีเมลเพื่อเก็บความคืบหน้าการเรียนของคุณ แล้วเริ่มเรียนบทแรกได้เลย'
      if (this.allDone) return 'เก่งมาก! คุณเรียนจบครบทุกบทแล้ว ลองไปเขียนโปรแกรมที่คุณสนใจใน Playground ต่อได้เลย'
      if (this.completedCount === 0) return 'เริ่มจากบทแรกได้เลย ใช้เวลาไม่นานก็เขียนโปรแกรม Java ตัวแรกของคุณได้แล้ว'
      return `ไปต่อที่บท "${this.nextLesson.title}" ได้เลย`
    },
    nextLabel () {
      if (!this.student) return 'เริ่มเรียน →'
      if (this.allDone) return 'ไปที่ Playground →'
      if (this.completedCount === 0) return 'เริ่มบทแรก →'
      return 'เรียนต่อบทถัดไป →'
    }
  },
  mounted () {
    this.fetchLessons()
  },
  methods: {
    setFilter (key) {
      this.filter = key
      this.$router.replace({ query: key ? { level: key } : {} })
    },
    goNext () {
      if (!this.student) return this.$router.push('/start')
      if (this.allDone || !this.nextLesson) return this.$router.push('/playground')
      return this.$router.push('/lessons/' + this.nextLesson.slug)
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
          confirmButtonColor: '#B85400'
        })
      }
      this.loading = false
      this.$Notiflix.remove()
    }
  }
}
</script>

<style scoped>
.banner {
  padding: 44px 16px;
  color: #fff4e4;
  background:
    radial-gradient(circle at 90% 10%, rgba(248, 152, 32, 0.22), transparent 45%),
    linear-gradient(135deg, #2a1b13 0%, #3b2418 60%, #5a3320 100%);
}

.banner__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  align-items: center;
  justify-content: space-between;
}

.banner__text-wrap {
  flex: 1 1 380px;
  max-width: 640px;
}

.banner__eyebrow {
  color: var(--c-amber);
}

.banner__title {
  margin: 6px 0 10px;
  font-family: var(--font-head);
  font-size: clamp(1.7rem, 3.6vw, 2.4rem);
  font-weight: 700;
}

.banner__text {
  margin: 0 0 20px;
  font-size: 1.05rem;
  line-height: 1.8;
  color: #e8d3bc;
}

.banner__btn {
  font-weight: 700;
}

.banner__ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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

.ring__label {
  font-size: 0.95rem;
  color: #e8d3bc;
}

.list {
  padding: 28px 16px 0;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 26px;
}

.filter {
  padding: 8px 18px;
  font-family: var(--font-head);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--c-roast);
  background: var(--c-paper);
  border: 1px solid var(--c-line);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter:hover {
  border-color: var(--c-orange);
}

.filter--active {
  color: #fff;
  background: var(--c-orange);
  border-color: var(--c-orange);
}

.level-group {
  margin-bottom: 34px;
}

.level-group__head {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--c-latte);
}

.level-group__title {
  display: flex;
  gap: 12px;
  align-items: center;
}

.level-group__icon {
  font-size: 32px;
}

.level-group__name {
  font-family: var(--font-head);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--c-espresso);
}

.level-group__desc {
  font-size: 0.92rem;
  color: var(--c-muted);
}

.lesson-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  text-decoration: none;
}

.lesson-card--done {
  background: #f7faf1 !important;
  border-color: #b9d3a3 !important;
}

.lesson-card__head {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}

.lesson-card__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-family: var(--font-head);
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  background: var(--c-espresso);
  border-radius: 50%;
}

.lesson-card__icon {
  font-size: 26px;
}

.lesson-card__done {
  margin-left: auto;
  padding: 2px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #2f6b2a;
  background: #dff0d6;
  border-radius: 999px;
}

.lesson-card__title {
  margin-bottom: 6px;
  font-family: var(--font-head);
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--c-espresso);
}

.lesson-card__summary {
  flex: 1;
  margin-bottom: 14px;
  font-size: 0.93rem;
  line-height: 1.7;
  color: var(--c-muted);
}

.lesson-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--c-muted);
}

.lesson-card__go {
  font-family: var(--font-head);
  font-weight: 600;
  color: var(--c-orange);
}

.empty {
  padding: 40px 0;
  text-align: center;
  color: var(--c-muted);
}
</style>
