import Token from '../../Api/Token'

export default {
  login (code = null) {
    if (code === '401' || code === null) {
      Token.removerToken()
      window.location.href = 'login'
    }
  },
  dashboard (contexto) {
    contexto.$router.push('dashboard')
  }
}
