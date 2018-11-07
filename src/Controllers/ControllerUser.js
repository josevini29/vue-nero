import axios from 'axios'
import EndPoint from '../Api/EntPoint'
import Token from '../Api/Token'

export async function obterUsuario () {
  if (Token.obterToken() === '') {
    throw new Exception('401', 'Usuário não logado')
  }

  try {
    let response = await axios({
      method: 'get',
      url: `${EndPoint.url}${EndPoint.user.get}`,
      headers: Token.obterTokenHeader()
    })
    return response.data.user
  } catch (error) {
    throw new Exception(error.response.status, error.response.data)
  }
}

function Exception (code, message) {
  this.code = code
  this.message = message
}
