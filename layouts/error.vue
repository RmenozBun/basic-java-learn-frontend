<template>
  <v-app>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <h1 class="text-h4 font-weight-bold mb-4">
            {{ error.statusCode === 404 ? 'ไม่พบหน้านี้ (404)' : 'เกิดข้อผิดพลาด' }}
          </h1>
          <NuxtLink to="/">กลับหน้าแรก</NuxtLink>
        </v-col>
      </v-row>
    </v-container>
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
