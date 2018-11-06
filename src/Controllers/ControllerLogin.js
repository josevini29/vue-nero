import axios from 'axios'
import EndPoint from '../Api/EntPoint'
import Token from '../Api/Token'

export async function validarLogin (email, senha) {
  try {
    let response = await axios({
      method: 'post',
      url: `${EndPoint.url}${EndPoint.auth.authenticate}`,
      data: {
        email: email,
        password: senha
      }
    })
    Token.guardarToken(response.data.token)
    return response.data
  } catch (error) {
    Token.removerToken()
    throw new Exception(error.response.status, error.response.data)
  }
}

export async function obterUsuario () {
  try {
    let response = await axios({
      method: 'get',
      url: `${EndPoint.url}${EndPoint.auth.user}`,
      data: {},
      headers: Token.obterTokenHeader()
    })
    return response.data.user
  } catch (error) {
    Token.removerToken()
    throw new Exception(error.response.status, error.response.data)
  }
}

function Exception (code, message) {
  this.code = code
  this.message = message
}
