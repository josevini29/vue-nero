<template>
  <div class="bloco text-center">
    <form class="form-signin">
      <img class="mb-4" src="../../assets/bootstrap-solid.svg" alt="" width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal">Login</h1>
      <label for="inputEmail" class="sr-only">E-mail</label>
      <input type="email" id="inputEmail" class="form-control" placeholder="Email" v-model="email" required autofocus>
      <label for="inputPassword" class="sr-only">Senha</label>
      <input type="password" id="inputPassword" class="form-control" placeholder="Senha" v-model="senha" required>
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> Lembrar-me
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit" v-bind:disabled="!isValid" @click="efetuarLogin">Entrar</button>
      <p class="mt-5 mb-3 text-muted">&copy; 2018</p>
    </form>
  </div>
</template>

<script>

import { validarLogin } from '../../Controllers/ControllerLogin'
import Redirecionar from '../Util/Redirecionar'

export default {

  name: 'Login',
  data () {
    return {
      email: '',
      senha: ''
    }
  },
  computed: {
    isValid: function () {
      return this.email !== '' && this.senha !== ''
    }
  },
  methods: {
    efetuarLogin: async function (event) {
      if (event) {
        try {
          event.preventDefault()
          console.log('Solicitando login...')
          await validarLogin(this.email, this.senha)
          console.log('Login aceito...')
          Redirecionar.dashboard(this)
        } catch (error) {
          this.$toasted.show(`${error.code} - ${error.message}`)
        }
      }
    }
  }
}

</script>

<style scoped>

    html,.bloco {
    height: 100%;
    }

    .bloco {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
    }

    .form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
    }
    .form-signin .checkbox {
    font-weight: 400;
    }
    .form-signin .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
    }
    .form-signin .form-control:focus {
    z-index: 2;
    }
    .form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    }
    .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    }

</style>
