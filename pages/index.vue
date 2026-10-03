<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="page-wrap hero__inner">
        <div class="hero__text">
          <div class="hero__eyebrow">เรียน Java ฟรี • ลงมือทำจริงในเบราว์เซอร์</div>
          <h1 class="hero__title">
            เรียน Java ให้สนุก<br>
            เหมือนจิบ<span class="hero__accent">กาแฟ</span>แก้วโปรด
          </h1>
          <p class="hero__lead">
            บทเรียนอธิบายละเอียดทีละขั้น พร้อมที่เขียนโค้ดและรันดูผลลัพธ์ได้ทันที
            ไม่ต้องติดตั้งอะไร เหมาะกับผู้เริ่มต้นที่ไม่เคยเขียนโปรแกรมมาก่อน
          </p>
          <div class="hero__cta">
            <v-btn x-large color="accent" light depressed class="hero__btn" @click="start">
              เริ่มเรียนเลย →
            </v-btn>
            <v-btn x-large outlined dark class="hero__btn" nuxt to="/playground">
              ลองเขียนโค้ดเลย
            </v-btn>
          </div>
          <div class="hero__stats">
            <span class="hero__stat"><strong>9</strong> บทเรียน</span>
            <span class="hero__stat"><strong>3</strong> ระดับ</span>
            <span class="hero__stat"><strong>รันได้</strong> ทันที</span>
          </div>
        </div>

        <div class="hero__visual" aria-hidden="true">
          <div class="hero-code code-window">
            <div class="code-window__bar">
              <span class="code-window__dots"><i /><i /><i /></span>
              <span class="code-window__title">Main.java</span>
            </div>
            <pre class="hero-code__pre cm-s-coffee"><code><span class="cm-keyword">public</span> <span class="cm-keyword">class</span> <span class="cm-def">Main</span> {
    <span class="cm-keyword">public</span> <span class="cm-keyword">static</span> <span class="cm-type">void</span> main(<span class="cm-type">String</span>[] args) {
        <span class="cm-type">String</span> drink = <span class="cm-string">"coffee"</span>;
        <span class="cm-keyword">for</span> (<span class="cm-type">int</span> i = <span class="cm-number">1</span>; i &lt;= <span class="cm-number">3</span>; i++) {
            System.out.println(i + <span class="cm-string">": "</span> + drink);
        }
    }
}</code></pre>
          </div>

          <div class="cup">
            <div class="cup__steam"><span /><span /><span /></div>
            <div class="cup__body"><span class="cup__label">JAVA</span></div>
            <div class="cup__handle" />
            <div class="cup__saucer" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="page-wrap section">
      <div class="section__head">
        <div class="eyebrow">ทำไมถึงเรียนง่าย</div>
        <h2 class="section__title">ออกแบบมาให้คนเริ่มต้นเรียนจบได้จริง</h2>
      </div>
      <v-row>
        <v-col v-for="feature in features" :key="feature.title" cols="12" sm="6" md="3">
          <v-card outlined class="feature hover-lift fill-height">
            <div class="feature__icon">{{ feature.icon }}</div>
            <div class="feature__title">{{ feature.title }}</div>
            <div class="feature__text">{{ feature.text }}</div>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- Roadmap -->
    <section class="page-wrap section">
      <div class="section__head">
        <div class="eyebrow">เส้นทางการเรียน</div>
        <h2 class="section__title">3 ระดับ ไล่จากพื้นฐานสู่การเขียนแบบมืออาชีพ</h2>
      </div>
      <v-row>
        <v-col v-for="(level, index) in levels" :key="level.key" cols="12" md="4">
          <v-card outlined class="level hover-lift fill-height" nuxt :to="'/lessons?level=' + level.key">
            <div class="level__top">
              <span class="level__icon">{{ level.icon }}</span>
              <span class="level__step">ระดับที่ {{ index + 1 }}</span>
            </div>
            <div class="level__name" :class="'level__name--' + level.key">{{ level.name }}</div>
            <p class="level__desc">{{ level.desc }}</p>
            <ul class="level__list">
              <li v-for="topic in level.topics" :key="topic">{{ topic }}</li>
            </ul>
            <div class="level__more">ดูบทเรียนระดับนี้ →</div>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- Final CTA -->
    <section class="page-wrap section">
      <div class="cta">
        <div>
          <div class="cta__title">พร้อมเริ่มแก้วแรกหรือยัง? ☕</div>
          <div class="cta__text">ใช้เวลาแค่ 15 นาทีก็เขียนโปรแกรม Java ตัวแรกของคุณได้แล้ว</div>
        </div>
        <v-btn x-large color="accent" light depressed class="hero__btn" @click="start">
          เริ่มเรียนบทแรก →
        </v-btn>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data () {
    return {
      features: [
        { icon: '📖', title: 'บทเรียนอธิบายละเอียด', text: 'ทุกเรื่องเริ่มจากพื้นฐาน มีตัวอย่าง ตาราง ภาพประกอบ และข้อผิดพลาดที่มือใหม่เจอบ่อย' },
        { icon: '▶️', title: 'รันโค้ดได้ในหน้าเว็บ', text: 'ทุกตัวอย่างมีปุ่ม "ลองรัน" กดแล้วแก้โค้ดเล่นได้เลย ไม่ต้องติดตั้งโปรแกรมใดๆ' },
        { icon: '✅', title: 'ตรวจคำตอบอัตโนมัติ', text: 'ส่งแบบฝึกหัดแล้วรู้ผลทันที มีคำใบ้ช่วยตอนติด และเฉลยพร้อมคำอธิบายหลังทำผ่าน' },
        { icon: '📈', title: 'ติดตามความคืบหน้า', text: 'เห็นชัดว่าเรียนถึงไหนแล้ว บทไหนเรียนจบ และควรไปต่อที่บทไหน' }
      ],
      levels: [
        {
          key: 'easy',
          icon: '🌱',
          name: 'ง่าย',
          desc: 'ทำความรู้จักภาษา Java และเขียนโปรแกรมแรกให้ได้',
          topics: ['โปรแกรมแรกและ println', 'ตัวแปร ชนิดข้อมูล Scanner', 'เงื่อนไข if / else / switch']
        },
        {
          key: 'medium',
          icon: '⚡',
          name: 'กลาง',
          desc: 'ให้โปรแกรมทำงานซ้ำและจัดการข้อมูลหลายตัวได้',
          topics: ['ลูป for / while', 'Array และอัลกอริทึมพื้นฐาน', 'เมธอดและการแบ่งโค้ด']
        },
        {
          key: 'hard',
          icon: '🔥',
          name: 'ยาก',
          desc: 'คิดแบบ OOP และใช้เครื่องมือที่ใช้จริงในงาน',
          topics: ['Class และ Object', 'การสืบทอดและ polymorphism', 'ArrayList และ HashMap']
        }
      ]
    }
  },
  methods: {
    start () {
      this.$router.push(this.$store.state.student ? '/lessons' : '/start')
    }
  }
}
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 72px 16px 88px;
  color: #fff4e4;
  background:
    radial-gradient(circle at 85% 20%, rgba(248, 152, 32, 0.22), transparent 45%),
    radial-gradient(circle at 10% 90%, rgba(184, 84, 0, 0.3), transparent 40%),
    linear-gradient(135deg, #2a1b13 0%, #3b2418 55%, #5a3320 100%);
}

.hero__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
  align-items: center;
  justify-content: space-between;
}

.hero__text {
  flex: 1 1 420px;
  max-width: 560px;
}

.hero__eyebrow {
  display: inline-block;
  margin-bottom: 18px;
  padding: 5px 14px;
  font-family: var(--font-head);
  font-size: 0.85rem;
  color: var(--c-amber);
  background: rgba(248, 152, 32, 0.14);
  border: 1px solid rgba(248, 152, 32, 0.35);
  border-radius: 999px;
}

.hero__title {
  font-family: var(--font-head);
  font-size: clamp(2rem, 4.6vw, 3.1rem);
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 18px;
}

.hero__accent {
  color: var(--c-amber);
}

.hero__lead {
  font-size: 1.1rem;
  line-height: 1.85;
  color: #e8d3bc;
  margin: 0 0 28px;
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.hero__btn {
  font-weight: 700;
}

.hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  margin-top: 30px;
  color: #d9c4b0;
}

.hero__stat strong {
  font-family: var(--font-head);
  font-size: 1.2rem;
  color: #fff;
  margin-right: 4px;
}

.hero__visual {
  position: relative;
  flex: 1 1 360px;
  max-width: 520px;
  padding-bottom: 36px;
}

.hero-code {
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.4);
  transform: rotate(-1.5deg);
}

.hero-code__pre {
  margin: 0;
  padding: 18px 20px 28px;
  overflow-x: auto;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre;
}

.hero-code__pre code {
  background: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
  box-shadow: none;
}

/* the steaming cup */
.cup {
  position: absolute;
  right: -6px;
  bottom: -18px;
  width: 112px;
  height: 118px;
}

.cup__body {
  position: absolute;
  left: 0;
  bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86px;
  height: 70px;
  background: linear-gradient(180deg, #fff7ea 0%, #ecd9bf 100%);
  border-radius: 6px 6px 40px 40px;
  box-shadow: inset 0 -6px 0 rgba(139, 90, 60, 0.18);
}

.cup__label {
  font-family: var(--font-head);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--c-orange);
}

.cup__handle {
  position: absolute;
  left: 78px;
  bottom: 30px;
  width: 30px;
  height: 36px;
  border: 8px solid #ecd9bf;
  border-left: none;
  border-radius: 0 22px 22px 0;
}

.cup__saucer {
  position: absolute;
  left: -10px;
  bottom: 6px;
  width: 112px;
  height: 12px;
  background: #d9c0a0;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.cup__steam {
  position: absolute;
  left: 18px;
  bottom: 84px;
  display: flex;
  gap: 10px;
}

.cup__steam span {
  display: block;
  width: 8px;
  height: 34px;
  border-radius: 8px;
  background: rgba(255, 244, 228, 0.55);
  filter: blur(3px);
  opacity: 0;
  animation: steam 3s ease-in-out infinite;
}

.cup__steam span:nth-child(2) {
  animation-delay: 0.7s;
  height: 42px;
}

.cup__steam span:nth-child(3) {
  animation-delay: 1.4s;
}

@keyframes steam {
  0% {
    opacity: 0;
    transform: translateY(8px) scaleX(1);
  }

  35% {
    opacity: 0.8;
  }

  100% {
    opacity: 0;
    transform: translateY(-28px) scaleX(1.8);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cup__steam span {
    animation: none;
    opacity: 0.4;
  }
}

/* sections */
.section {
  padding: 56px 16px 0;
}

.section__head {
  margin-bottom: 26px;
}

.section__title {
  margin: 6px 0 0;
  font-family: var(--font-head);
  font-size: clamp(1.4rem, 2.8vw, 1.9rem);
  font-weight: 700;
  color: var(--c-espresso);
}

.feature {
  padding: 24px;
}

.feature__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 14px;
  font-size: 26px;
  background: var(--c-foam);
  border-radius: 14px;
}

.feature__title {
  margin-bottom: 6px;
  font-family: var(--font-head);
  font-size: 1.08rem;
  font-weight: 600;
  color: var(--c-espresso);
}

.feature__text {
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--c-muted);
}

.level {
  display: flex;
  flex-direction: column;
  padding: 26px;
  text-decoration: none;
}

.level__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.level__icon {
  font-size: 34px;
}

.level__step {
  font-size: 0.82rem;
  color: var(--c-muted);
}

.level__name {
  font-family: var(--font-head);
  font-size: 1.6rem;
  font-weight: 700;
}

.level__name--easy {
  color: var(--c-easy);
}

.level__name--medium {
  color: var(--c-medium);
}

.level__name--hard {
  color: var(--c-hard);
}

.level__desc {
  margin: 4px 0 12px;
  color: var(--c-muted);
}

.level__list {
  margin: 0 0 16px;
  padding-left: 1.2rem;
  color: var(--c-text);
  line-height: 1.9;
}

.level__more {
  margin-top: auto;
  font-family: var(--font-head);
  font-weight: 600;
  color: var(--c-orange);
}

.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 32px 36px;
  color: #fff4e4;
  background: linear-gradient(120deg, #3b2418 0%, #5a3320 100%);
  border-radius: 20px;
  box-shadow: var(--shadow-soft);
}

.cta__title {
  font-family: var(--font-head);
  font-size: 1.5rem;
  font-weight: 700;
}

.cta__text {
  margin-top: 4px;
  color: #e8d3bc;
}

@media (max-width: 600px) {
  .hero {
    padding: 44px 16px 64px;
  }

  .hero__visual {
    padding-bottom: 44px;
  }
}
</style>
