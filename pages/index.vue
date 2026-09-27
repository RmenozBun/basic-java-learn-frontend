<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <div class="text-h3 font-weight-bold mb-4">
          เรียน Java ด้วยการลงมือเขียนโค้ดจริง ☕
        </div>
        <div class="text-body-1 mb-8 grey--text text--darken-1">
          เนื้อหาแบ่ง 3 ระดับ ง่าย กลาง ยาก พร้อมพื้นที่เขียนโค้ดในเบราว์เซอร์
          กดรันแล้วเห็นผลลัพธ์ได้ทันที เหมาะสำหรับผู้เริ่มต้นสาย comsci ปี 1
        </div>
        <v-btn color="primary" x-large elevation="2" @click="start">
          เริ่มเรียนเลย
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  methods: {
    start () {
      if (this.$store.state.student) {
        this.$router.push('/lessons')
        return
      }
      this.$router.push('/start')
    }
  }
}
</script>
