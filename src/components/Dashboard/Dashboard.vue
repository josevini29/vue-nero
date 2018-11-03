<template>
  <div>
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">Dashboard</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#corNavbar01" aria-controls="corNavbar01" aria-expanded="false" aria-label="Alterna navegação">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="corNavbar01">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <a class="nav-link" href="#">Lançamentos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="modal" data-target="#modalCadBanco">Bancos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="modal" data-target="#modalCadConta">Contas</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="modal" data-target="#modalCadSubGrupo">Sub-Grupo</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="modal" data-target="#modalCadGrupo">Grupo</a>
            </li>
          </ul>
          <button class="btn btn-outline-info my-2 my-sm-0" @click="encerrarSessao">Sair</button>
        </div>
      </nav>
    </div>
    <div class="quadro">
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalLanc">Novo Lançamento</button>
    </div>
    <CadastroBanco />
    <CadastroConta />
    <CadastroSubGrupo />
    <CadastroGrupo />
    <Lancamento />
  </div>
</template>

<script>

import * as firebase from 'firebase'
import Banco from '../Banco/Banco'
import Conta from '../Conta/Conta'
import SubGrupo from '../SubGrupo/SubGrupo'
import Grupo from '../Grupo/Grupo'
import Lancamento from '../Lancamento/Lancamento'

export default {
  name: 'Dashboard',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    validarSessao: function () {
      var user = firebase.auth().currentUser
      if (!user) {
        this.$router.push('login')
      }
    },
    encerrarSessao: function (event) {
      if (event) {
        firebase.auth().signOut().then(() => {
          console.log('Sessão encerrada!')
          this.$router.push('login')
        }).catch(() => {
          console.log('Erro ao encerrar sessão!')
        })
      }
    }
  },
  beforeMount () {
    this.validarSessao()
  },
  components: {
    CadastroBanco: Banco,
    CadastroConta: Conta,
    CadastroSubGrupo: SubGrupo,
    CadastroGrupo: Grupo,
    Lancamento: Lancamento
  }
}
</script>

<style scoped>

.quadro {
  margin: 5px
}
</style>
