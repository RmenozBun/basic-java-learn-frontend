// Runs during Nuxt bootstrap, before any page/layout component mounts —
// unlike a component's mounted() hook, this guarantees store.state.student
// is already set by the time page components check it in their own mounted().
export default ({ store }) => {
  try {
    const raw = localStorage.getItem('javaLearnStudent')
    if (raw) store.commit('setStudent', JSON.parse(raw))
  } catch (error) {
    // localStorage may be unavailable — continue as guest
  }
}
