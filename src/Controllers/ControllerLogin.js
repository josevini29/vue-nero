import axios from 'axios'
import Route from '../Api/Route'
import Token from '../Api/Token'

export async function validarLogin (email, senha, lembrar = false) {
  try {
    let response = await axios({
      method: 'post',
      url: `${Route.auth.authenticate}`,
      data: {
        email: email,
        password: senha
      }
    })
    Token.guardarToken(response.data.token, lembrar)
    return response.data
  } catch (error) {
    throw new Exception(error.response.status, error.response.data)
  }
}

function Exception (code, message) {
  this.code = code
  this.message = message
}
