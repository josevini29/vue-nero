export default {
  login () {
    window.location.href = 'login'
  },
  dashboard (contexto) {
    contexto.$router.push('dashboard')
  }
}
