<template>
  <v-app>
    <v-app-bar app flat dark height="68" class="app-bar">
      <div class="page-wrap d-flex align-center fill-width">
        <nuxt-link to="/" class="brand">
          <span class="brand__cup">☕</span>
          <span class="brand__name">Java Learn</span>
        </nuxt-link>

        <v-spacer />

        <nav class="d-none d-sm-flex align-center">
          <v-btn
            v-for="link in links"
            :key="link.to"
            text
            nuxt
            :to="link.to"
            active-class="nav-active"
            class="nav-link"
          >
            {{ link.label }}
          </v-btn>
        </nav>

        <v-menu v-if="student" offset-y left>
          <template #activator="{ on, attrs }">
            <v-btn text class="user-btn ml-2" v-bind="attrs" v-on="on">
              <span class="user-btn__avatar">{{ initial }}</span>
              <span class="d-none d-md-inline ml-2">{{ student.name }}</span>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item disabled>
              <v-list-item-content>
                <v-list-item-title>{{ student.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ student.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item nuxt to="/progress">
              <v-list-item-title>ความคืบหน้าของฉัน</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>เปลี่ยนผู้ใช้ / ออกจากระบบ</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn v-else class="d-none d-sm-flex ml-2" color="accent" light depressed nuxt to="/start">
          เริ่มเรียน
        </v-btn>

        <v-menu offset-y left>
          <template #activator="{ on, attrs }">
            <v-btn icon class="d-flex d-sm-none ml-1" v-bind="attrs" v-on="on">
              <span class="burger">☰</span>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item v-for="link in links" :key="link.to" nuxt :to="link.to">
              <v-list-item-title>{{ link.label }}</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="!student" nuxt to="/start">
              <v-list-item-title>เริ่มเรียน</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>

    <footer class="site-footer">
      <div class="page-wrap site-footer__inner">
        <div>
          <div class="site-footer__brand">☕ Java Learn</div>
          <div class="site-footer__text">
            เรียน Java ทีละขั้น เขียนโค้ดจริงและรันได้ทันทีในเบราว์เซอร์ เหมาะกับผู้เริ่มต้น
          </div>
        </div>
        <div class="site-footer__links">
          <nuxt-link v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</nuxt-link>
        </div>
      </div>
      <div class="site-footer__copy">เนื้อหาทั้งหมดเขียนขึ้นเองเพื่อการเรียนรู้ • ทำด้วย Java และกาแฟ</div>
    </footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      links: [
        { to: '/lessons', label: 'บทเรียน' },
        { to: '/playground', label: 'Playground' },
        { to: '/progress', label: 'ความคืบหน้า' }
      ]
    }
  },
  computed: {
    student () {
      return this.$store.state.student
    },
    initial () {
      return this.student && this.student.name ? this.student.name.trim().charAt(0).toUpperCase() : '?'
    }
  },
  methods: {
    logout () {
      this.$store.commit('clearStudent')
      try {
        localStorage.removeItem('javaLearnStudent')
      } catch (error) {
        // localStorage may be unavailable — the in-memory session is already cleared
      }
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.app-bar {
  background: linear-gradient(90deg, #3b2418 0%, #4b2e1f 100%) !important;
  border-bottom: 3px solid var(--c-amber);
}

.fill-width {
  width: 100%;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brand__cup {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 22px;
  border-radius: 12px;
  background: rgba(248, 152, 32, 0.18);
}

.brand__name {
  font-family: var(--font-head);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #fff4e4;
}

.nav-link {
  margin-left: 4px;
  color: #f1dcc4 !important;
}

.nav-link.nav-active {
  color: #fff !important;
  background: rgba(248, 152, 32, 0.22);
}

.user-btn {
  color: #fff4e4 !important;
}

.user-btn__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-family: var(--font-head);
  font-weight: 700;
  color: var(--c-espresso);
  background: var(--c-amber);
}

.burger {
  font-size: 22px;
  color: #fff4e4;
}

.site-footer {
  margin-top: 56px;
  padding: 36px 16px 20px;
  color: #d9c4b0;
  background: var(--c-espresso);
  border-top: 3px solid var(--c-amber);
}

.site-footer__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
}

.site-footer__brand {
  font-family: var(--font-head);
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff4e4;
}

.site-footer__text {
  max-width: 420px;
  margin-top: 6px;
  font-size: 0.95rem;
  line-height: 1.7;
}

.site-footer__links a {
  margin-left: 18px;
  color: #f1dcc4;
  text-decoration: none;
}

.site-footer__links a:hover {
  color: var(--c-amber);
}

.site-footer__copy {
  margin-top: 24px;
  padding-top: 16px;
  text-align: center;
  font-size: 0.85rem;
  color: #a08a78;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
