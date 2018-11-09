import axios from 'axios'
import Token from '../Api/Token'
import Route from '../Api/Route'

export async function editarContas (conta) {
  if (Token.obterToken() === '') {
    throw new Exception('401', 'Usuário não logado')
  }

  try {
    let response
    if (conta._id === undefined) {
      response = await axios({
        method: 'post',
        url: Route.account.post,
        data: conta,
        headers: Token.obterTokenHeader()
      })
    } else {
      let idConta = conta._id
      conta._id = undefined
      response = await axios({
        method: 'put',
        url: `${Route.account.put}${idConta}`,
        data: conta,
        headers: Token.obterTokenHeader()
      })
    }

    return response.data.account
  } catch (error) {
    throw new Exception(error.response.status, error.response.data)
  }
}

export async function obterContas () {
  if (Token.obterToken() === '') {
    throw new Exception('401', 'Usuário não logado')
  }

  try {
    let response = await axios({
      method: 'get',
      url: Route.account.get,
      headers: Token.obterTokenHeader()
    })
    return response.data.accounts
  } catch (error) {
    throw new Exception(error.response.status, error.response.data)
  }
}

export async function deletarConta (conta) {
  if (Token.obterToken() === '') {
    throw new Exception('401', 'Usuário não logado')
  }

  try {
    let idConta = conta._id
    let response = await axios({
      method: 'delete',
      url: `${Route.account.delete}${idConta}`,
      headers: Token.obterTokenHeader()
    })

    return response.data
  } catch (error) {
    throw new Exception(error.response.status, error.response.data)
  }
}

function Exception (code, message) {
  this.code = code
  this.message = message
}
