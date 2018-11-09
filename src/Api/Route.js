
let api = process.env.ROOT_API

export default {
  api,
  auth: {
    register: `${api}/auth/register`,
    authenticate: `${api}/auth/authenticate`
  },
  user: {
    get: `${api}/user`
  },
  bank: {
    get: `${api}/bank`,
    post: `${api}/bank`,
    put: `${api}/bank/`,
    delete: `${api}/bank/`
  },
  account: {
    get: `${api}/account`,
    post: `${api}/account`,
    put: `${api}/account/`,
    delete: `${api}/account/`
  }
}
