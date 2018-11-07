export default {
  guardarToken (token, lembrar) {
    this.removerToken()
    if (lembrar) {
      window.localStorage.setItem('token-nero', token)
    } else {
      window.sessionStorage.setItem('token-nero', token)
    }
  },
  removerToken () {
    console.log('Token removido')
    window.localStorage.removeItem('token-nero')
    window.sessionStorage.removeItem('token-nero')
  },
  obterToken () {
    let token = null
    let tokenLocal = window.localStorage.getItem('token-nero')
    let tokenSession = window.sessionStorage.getItem('token-nero')
    if (tokenLocal) {
      token = tokenLocal
    } else if (tokenSession) {
      token = tokenSession
    }
    return token || ''
  },
  obterTokenHeader () {
    return {'Authorization': 'bearer ' + this.obterToken()}
  }
}
