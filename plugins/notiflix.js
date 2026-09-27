import Vue from 'vue'
import Notiflix from 'notiflix'

Notiflix.Loading.init({ svgColor: '#2e7d32' })

// Notiflix v3 renamed Loading.loading()/remove() to Loading.standard()/remove().
// Keep the familiar $Notiflix.loading()/remove() call sites working.
Notiflix.loading = (message) => Notiflix.Loading.standard(message)
Notiflix.remove = () => Notiflix.Loading.remove()

Vue.prototype.$Notiflix = Notiflix
