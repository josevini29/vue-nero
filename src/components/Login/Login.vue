<template>
<div class="container py-5">
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-6 mx-auto">
                    <div class="card rounded-0">
                        <div class="card-header">
                            <h3 class="mb-0">Login</h3>
                        </div>
                        <div class="card-body">
                            <form class="form">
                                <div class="form-group">
                                    <label for="uname1">E-mail</label>
                                    <input type="email" class="form-control form-control-lg rounded-0" v-model="email" required>
                                    <div class="invalid-feedback">Oops, you missed this one.</div>
                                </div>
                                <div class="form-group">
                                    <label>Senha</label>
                                    <input type="password" class="form-control form-control-lg rounded-0" autocomplete="new-password" v-model="senha" required>
                                    <div class="invalid-feedback">Enter your password too!</div>
                                </div>
                                <button type="submit" class="btn btn-success btn-lg float-right" v-bind:disabled="!isValid" @click="efetuarLogin">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
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

</style>
