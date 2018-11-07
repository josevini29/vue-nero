import axios from 'axios'
import EndPoint from '../Api/EntPoint'
import Token from '../Api/Token'

export async function editarBanco (banco) {
  if (Token.obterToken() === '') {
    throw new Exception('401', 'Usuário não logado')
  }

  try {
    let response
    if (banco._id === undefined) {
      response = await axios({
        method: 'post',
        url: `${EndPoint.url}${EndPoint.bank.post}`,
        data: banco,
        headers: Token.obterTokenHeader()
      })
    } else {
      let idBanco = banco._id
      banco._id = undefined
      response = await axios({
        method: 'put',
        url: `${EndPoint.url}${EndPoint.bank.put}${idBanco}`,
        data: banco,
        headers: Token.obterTokenHeader()
      })
    }

    return response.data.bank
  } catch (error) {
    throw new Exception(error.response.status, error.response.data)
  }
}

export async function obterBancos () {
  if (Token.obterToken() === '') {
    throw new Exception('401', 'Usuário não logado')
  }

  try {
    let response = await axios({
      method: 'get',
      url: `${EndPoint.url}${EndPoint.bank.get}`,
      headers: Token.obterTokenHeader()
    })
    return response.data.banks
  } catch (error) {
    throw new Exception(error.response.status, error.response.data)
  }
}

export async function deletarBanco (banco) {
  if (Token.obterToken() === '') {
    throw new Exception('401', 'Usuário não logado')
  }

  try {
    let idBanco = banco._id
    let response = await axios({
      method: 'delete',
      url: `${EndPoint.url}${EndPoint.bank.delete}${idBanco}`,
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
