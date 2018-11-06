<template>
  <div>
    <div class="progress" v-if="usuario._id === undefined">
      <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">Carregando...</div>
    </div>
    <div v-else>
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="">Dashboard</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#corNavbar01" aria-controls="corNavbar01" aria-expanded="false" aria-label="Alterna navegação">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="corNavbar01">
          <ul class="navbar-nav mr-auto">
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
          <div class="btn-group">
            <button type="button" class="btn btn-success btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
             {{this.usuario.name}}
            </button>
            <div class="dropdown-menu dropdown-menu-right">
              <button  class="dropdown-item" type="button">Alterar Senha</button >
              <div class="dropdown-divider"></div>
              <button  class="dropdown-item" type="button" @click="encerrarSessao">Sair</button >
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm quadro">
          <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalLanc">Novo Lançamento</button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link active" id="pills_conta_corrente_tab" data-toggle="pill" href="#pills_conta_corrente" role="tab" aria-controls="pills_conta_corrente" aria-selected="true">Conta Corrente</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="pills_conta_poupanca_tab" data-toggle="pill" href="#pills_conta_poupanca" role="tab" aria-controls="pills_conta_poupanca" aria-selected="false">Poupança</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="pills_lancamento_tab" data-toggle="pill" href="#pills_lancamento" role="tab" aria-controls="pills_lancamento" aria-selected="false">Lançamentos</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-sm">
          <div class="tab-content" id="pills-tabContent">
            <div class="tab-pane fade show active" id="pills_conta_corrente" role="tabpanel" aria-labelledby="pills_conta_corrente_tab">
              <!-- <GrafContaCorrente /> -->
            </div>
            <div class="tab-pane fade" id="pills_conta_poupanca" role="tabpanel" aria-labelledby="pills_conta_poupanca_tab">
              teste 02
            </div>
            <div class="tab-pane fade" id="pills_lancamento" role="tabpanel" aria-labelledby="pills_lancamento_tab">
               <!-- <ListaLancto /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>

import { obterUsuario } from '../../Controllers/ControllerUser'
import Redirecionar from '../Util/Redirecionar'
import Token from '../../Api/Token'

export default {
  name: 'Dashboard',
  data () {
    return {
      usuario: {}
    }
  },
  methods: {
    encerrarSessao: function () {
      console.log('Encerrando sessão...')
      this.usuario = {}
      Token.removerToken()
      Redirecionar.login()
    },
    iniciarSessao: async function () {
      try {
        console.log('Obtendo usuário...')
        this.usuario = await obterUsuario()
        console.log('Usuário obtido...')
      } catch (error) {
        this.$toasted.show(`${error.code} - ${error.message}`)
        Redirecionar.login()
      }
    }
  },
  beforeMount () {
    console.log('Dashboard')
    this.iniciarSessao()
  }
}
</script>

<style scoped>

.quadro {
  margin: 5px
}

.abas {
  padding: 20px;
}

</style>
