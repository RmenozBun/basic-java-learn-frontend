<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="2">
      <v-toolbar-title class="font-weight-bold" style="cursor: pointer" @click="$router.push('/')">
        ☕ Java Learn
      </v-toolbar-title>
      <v-spacer />
      <v-btn text nuxt to="/lessons">บทเรียน</v-btn>
      <v-btn text nuxt to="/playground">Playground</v-btn>
      <v-btn text nuxt to="/progress">ความคืบหน้า</v-btn>
      <v-chip v-if="student" class="ml-2" color="white" text-color="primary" small>
        {{ student.name }}
      </v-chip>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>

    <v-footer color="grey darken-3" dark padless>
      <v-col class="text-center py-3" cols="12">
        Java Learn — เว็บฝึกเขียน Java สำหรับผู้เริ่มต้น
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  computed: {
    student () {
      return this.$store.state.student
    }
  }
}
</script>
