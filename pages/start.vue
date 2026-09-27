<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-title class="page-title">แนะนำตัวก่อนเริ่มเรียน</v-card-title>
          <v-card-text class="pa-6">
            <p class="grey--text text--darken-1 mb-4">
              ใส่ชื่อและอีเมลไว้เก็บความคืบหน้าการเรียนของคุณ (ไม่ต้องสมัครสมาชิก ไม่ต้องตั้งรหัสผ่าน)
            </p>
            <v-form @submit.prevent="submit">
              <v-text-field
                v-model="name"
                label="ชื่อ"
                outlined
                dense
                :error-messages="errors.name"
              />
              <v-text-field
                v-model="email"
                label="อีเมล"
                outlined
                dense
                :error-messages="errors.email"
              />
              <v-btn color="primary" block large type="submit">
                เริ่มเรียน
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
