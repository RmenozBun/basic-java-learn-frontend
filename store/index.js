export const state = () => ({
  student: null
})

export const mutations = {
  setStudent (state, data) {
    state.student = data
  },
  clearStudent (state) {
    state.student = null
  }
}
