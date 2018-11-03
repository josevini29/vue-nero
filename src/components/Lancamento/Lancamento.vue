<template>
  <div class="modal fade" id="modalLanc" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">Lançamento Financeiro</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row">
              <div class="col-sm-6">
                <label for="id_subgrupo" class="col-form-label">Grupo</label>
                <select class="form-control" id="id_grupo" v-model="idGrupo">
                  <option v-for="(grupo, index) in grupos" v-bind:key="index" :value="grupo.id_grupo">
                    {{grupo.ds_grupo}}
                  </option>
                </select>
              </div>
              <div class="col-sm-5">
                <label for="id_conta" class="col-form-label">Conta</label>
                <select class="form-control" id="id_conta" v-model="idConta">
                  <option v-for="(conta, index) in contas" v-bind:key="index" :value="conta.id_conta">
                    {{conta.cd_conta}} - {{conta.ds_tpconta}}
                  </option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-5">
                <label for="dt_movto" class="col-form-label">Data Movto</label>
                <input class="form-control" type="date" id="dt_movto" v-model="dtMovto">
              </div>
              <div class="col-sm-5">
                <label for="vl_movto" class="col-form-label">Valor R$</label>
                <input class="form-control" type="number" id="vl_movto" v-model="vlMovto">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="salvarLancto()">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as firebase from 'firebase'

export default {
  name: 'Lancamento',
  data () {
    return {
      db: firebase.firestore(),
      grupos: [],
      contas: [],
      idGrupo: '',
      idConta: '',
      dtMovto: this.dataAtual(),
      vlMovto: 0.00
    }
  },
  methods: {
    validarSessao: function () {
      var user = firebase.auth().currentUser
      if (!user) {
        this.$router.push('login')
      }
    },
    listaGrupos: function () {
      var arrayGrupo = []
      const settings = {timestampsInSnapshots: true}
      this.db.settings(settings)
      this.db.collection('grupo').get().then((snapshot) => {
        snapshot.forEach(doc => {
          const grupo = {
            id_grupo: doc.id,
            ds_grupo: doc.data().ds_grupo
          }
          arrayGrupo.push(grupo)
        })
        this.grupos = arrayGrupo
      }).catch((error) => {
        alert(`${error.code}: ${error.message}`)
        this.$router.push('login')
      })
    },
    listaContas: function () {
      var arrayConta = []
      const settings = {timestampsInSnapshots: true}
      this.db.settings(settings)
      this.db.collection('conta').get().then((snapshot) => {
        snapshot.forEach(doc => {
          const conta = {
            id_conta: doc.id,
            cd_conta: doc.data().cd_conta,
            ds_tpconta: doc.data().tp_conta === 'C' ? 'Conta Corrente' : 'Poupança'
          }
          arrayConta.push(conta)
        })
        this.contas = arrayConta
      }).catch((error) => {
        alert(`${error.code}: ${error.message}`)
        this.$router.push('login')
      })
    },
    salvarLancto: function () {
      if (this.idGrupo === '' || this.idConta === '' || this.dtMovto === '' || this.vlMovto === '') {
        alert('Informe os campos!')
        return
      }
      this.db.collection('lancamento').add({
        grupo: this.db.collection('grupo').doc(this.idGrupo),
        conta: this.db.collection('conta').doc(this.idConta),
        contadest: null,
        vl_movto: parseFloat(this.vlMovto),
        dt_movto: new Date(this.dtMovto + 'T00:00:00'),
        dt_transacao: new Date()
      }).then(() => {
        console.log('Registro salvo com sucesso!')
        this.idGrupo = ''
        this.idConta = ''
        this.vl_movto = 0
        this.dt_movto = this.dataAtual()
      }).catch((error) => {
        console.log(error)
        alert('Erro ao salvar registro!', error)
      })
    },
    dataAtual: function () {
      var data = new Date()
      let dia = data.getDate().toString()
      let diaF = (dia.length === 1) ? '0' + dia : dia
      let mes = (data.getMonth() + 1).toString()
      let mesF = (mes.length === 1) ? '0' + mes : mes
      let anoF = data.getFullYear()
      return anoF + '-' + mesF + '-' + diaF
    }
  },
  beforeMount () {
    this.validarSessao()
    this.listaGrupos()
    this.listaContas()
  }
}
</script>

<style scoped>

  .fa:before {
    font-family: FontAwesome !important;
  }

</style>
