<template>
  <v-app>
    <div class="err">
      <div class="err__cup">☕</div>
      <h1 class="err__title">
        {{ error.statusCode === 404 ? 'ไม่พบหน้านี้ (404)' : 'เกิดข้อผิดพลาด' }}
      </h1>
      <p class="err__text">
        {{ error.statusCode === 404 ? 'แก้วนี้ว่างเปล่า ไม่มีหน้าที่คุณตามหาอยู่ที่นี่' : 'มีบางอย่างผิดพลาด ลองรีเฟรชหน้าหรือกลับไปหน้าแรกนะ' }}
      </p>
      <v-btn color="primary" large depressed nuxt to="/">กลับหน้าแรก</v-btn>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'ErrorLayout',
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  },
  head () {
    return {
      title: this.error.statusCode === 404 ? 'ไม่พบหน้านี้' : 'เกิดข้อผิดพลาด'
    }
  }
}
</script>

<style scoped>
.err {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  text-align: center;
}

.err__cup {
  font-size: 64px;
}

.err__title {
  margin: 8px 0;
  font-family: var(--font-head);
  font-size: 2rem;
  font-weight: 700;
  color: var(--c-espresso);
}

.err__text {
  margin-bottom: 22px;
  color: var(--c-muted);
}
</style>
