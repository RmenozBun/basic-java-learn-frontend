<template>
  <div class="start">
    <div class="page-wrap start__inner">
      <div class="start__intro">
        <div class="start__cup">☕</div>
        <h1 class="start__title">ยินดีต้อนรับ!<br>แนะนำตัวหน่อยนะ</h1>
        <p class="start__text">
          ใส่ชื่อและอีเมลไว้ให้ระบบจดความคืบหน้าการเรียนของคุณ
          <strong>ไม่ต้องสมัครสมาชิก ไม่ต้องตั้งรหัสผ่าน</strong>
          ครั้งหน้ากลับมาใช้อีเมลเดิม ก็เรียนต่อจากที่ค้างไว้ได้เลย
        </p>
      </div>

      <v-card outlined class="start__card">
        <v-form @submit.prevent="submit">
          <label class="field-label">ชื่อของคุณ</label>
          <v-text-field
            v-model="name"
            placeholder="เช่น Ploy"
            outlined
            background-color="white"
            :error-messages="errors.name"
            autofocus
          />
          <label class="field-label">อีเมล</label>
          <v-text-field
            v-model="email"
            placeholder="you@example.com"
            outlined
            background-color="white"
            :error-messages="errors.email"
          />
          <v-btn color="primary" block x-large depressed type="submit">เริ่มเรียนเลย →</v-btn>
        </v-form>
        <p class="start__note">
          🔒 ข้อมูลนี้ใช้แค่จดความคืบหน้าในเว็บนี้ ไม่มีการยืนยันอีเมลหรือส่งอีเมลหาคุณ
        </p>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StartPage',
  data () {
    return {
      name: '',
      email: '',
      errors: {}
    }
  },
  methods: {
    validate () {
      const errors = {}
      if (!this.name.trim()) errors.name = 'กรุณากรอกชื่อ'
      if (!this.email.trim()) {
        errors.email = 'กรุณากรอกอีเมล'
      } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        errors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
      }
      this.errors = errors
      return !Object.keys(errors).length
    },
    submit () {
      if (!this.validate()) return
      const student = { name: this.name.trim(), email: this.email.trim() }
      this.$store.commit('setStudent', student)
      try {
        localStorage.setItem('javaLearnStudent', JSON.stringify(student))
      } catch (error) {
        // localStorage may be unavailable — session stays in-memory only
      }
      this.$router.push('/lessons')
    }
  }
}
</script>

<style scoped>
.start {
  padding: 56px 16px 0;
}

.start__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 44px;
  align-items: center;
  justify-content: center;
}

.start__intro {
  flex: 1 1 340px;
  max-width: 460px;
}

.start__cup {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin-bottom: 14px;
  font-size: 38px;
  background: #fdebd6;
  border-radius: 22px;
}

.start__title {
  margin: 0 0 12px;
  font-family: var(--font-head);
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.3;
  color: var(--c-espresso);
}

.start__text {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.85;
  color: var(--c-muted);
}

.start__card {
  flex: 1 1 360px;
  max-width: 440px;
  padding: 28px;
  box-shadow: var(--shadow-soft);
}

.field-label {
  display: block;
  margin-bottom: 4px;
  font-family: var(--font-head);
  font-weight: 600;
  color: var(--c-espresso);
}

.start__note {
  margin: 16px 0 0;
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--c-muted);
}
</style>
