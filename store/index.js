export const state = () => ({
  student: null,
  // code (+ optional stdin) handed from a lesson's "ลองรัน" button to the Playground
  playgroundDraft: null
})

export const mutations = {
  setStudent (state, data) {
    state.student = data
  },
  clearStudent (state) {
    state.student = null
  },
  setPlaygroundDraft (state, draft) {
    state.playgroundDraft = draft
  },
  clearPlaygroundDraft (state) {
    state.playgroundDraft = null
  }
}
