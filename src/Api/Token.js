export default {
  guardarToken (token) {
    console.log('Token gerado')
    window.localStorage.setItem('token_nero', token)
  },
  removerToken () {
    console.log('Token removido')
    window.localStorage.removeItem('token_nero')
  },
  obterToken () {
    return window.localStorage.getItem('token_nero') || ''
  },
  obterTokenHeader () {
    return {'Authorization': 'bearer ' + this.obterToken()}
  }
}
