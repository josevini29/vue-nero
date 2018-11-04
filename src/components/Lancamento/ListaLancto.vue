<template>
  <div>
    <div class="barra">
      <div class="progress barra-progresso" v-if="inProgress">
        <div class="progress-bar bg-info" role="progressbar" :style="'width: ' + vlPercentual + '%;'" :aria-valuenow="vlPercentual" aria-valuemin="0" aria-valuemax="100">{{vlPercentual}}%</div>
      </div>
      <div class="container-fluid botao-refresh" v-else>
        <div class="row">
          <div class="col-sm-1">
            <select class="form-control" v-model="cdMes">
              <option v-for="(mes, index) in meses" v-bind:key="index" :value="mes.cdMes">{{mes.dsMes}}</option>
            </select>
          </div>
          <div class="input-ano col-sm-1">
            <input type="number" class="form-control" placeholder="Ano" v-model="nrAno"/>
          </div>
          <div class="col-sm-1">
            <button type="button" class="btn btn-info" @click="carregarLancamentos()">Atualizar <i class="fas fa-sync-alt"></i></button>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Data Movto</th>
          <th scope="col">Conta</th>
          <th scope="col">Conta Destino</th>
          <th scope="col">Grupo</th>
          <th scope="col">Sub-Grupo</th>
          <th scope="col">Data/Hora Lançamento</th>
          <th scope="col">Valor Movto</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(lancto, index) in lancamentos" v-bind:key="index">
          <td>{{lancto.dt_movto}}</td>
          <td>{{lancto.ds_conta}}</td>
          <td>{{lancto.ds_contadest}}</td>
          <td>{{lancto.ds_grupo}}</td>
          <td>{{lancto.ds_subgrupo}}</td>
          <td>{{lancto.dt_transacao}}</td>
          <td>{{lancto.vl_movto}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import * as firebase from 'firebase'
import { formatarDataFirestore, formatarDataHoraFirestore, obterMeses, obterUltimoDiaMes } from '../Util/Data'
import { formatarReal } from '../Util/Numero'

export default {
  name: 'ListaLancto',
  data () {
    return {
      db: firebase.firestore(),
      lancamentos: [],
      meses: obterMeses(),
      cdMes: ((new Date().getMonth() + 1).toString().length === 1 ? '0' + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString()),
      nrAno: new Date().getFullYear().toString(),
      vlPercentual: 0,
      inProgress: true
    }
  },
  methods: {
    validarSessao: function () {
      var user = firebase.auth().currentUser
      if (!user) {
        this.$router.push('login')
      }
    },
    carregarLancamentos: async function () {
      try {
        let dtInicio = new Date(`${this.nrAno}-${this.cdMes}-01T00:00:00`)
        let dtFim = new Date(`${this.nrAno}-${this.cdMes}-01T23:59:59`)
        dtFim = obterUltimoDiaMes(dtFim)

        var arrayLanctos = []
        this.inProgress = true
        this.vlPercentual = 0
        const settings = {timestampsInSnapshots: true}
        this.db.settings(settings)
        let response = await this.db.collection('lancamento').where('dt_movto', '>=', dtInicio).where('dt_movto', '<=', dtFim)
          .orderBy('dt_movto', 'desc').orderBy('dt_transacao', 'desc').get()
        for (let i = 0; i < response.docs.length; i++) {
          this.vlPercentual = Math.round(((i + 1) / response.docs.length) * 100)
          let doc = response.docs[i]
          let responseConta = await this.db.collection('conta').doc(doc.data().conta.id).get()
          let responseContaDest = null
          if (doc.data().contadest !== null) {
            responseContaDest = await this.db.collection('conta').doc(doc.data().contadest.id).get()
          }
          let responseGrupo = await this.db.collection('grupo').doc(doc.data().grupo.id).get()
          let responseSubGrupo = await this.db.collection('sub-grupo').doc(responseGrupo.data().subgrupo.id).get()
          const lancto = {
            id_lancamento: doc.id,
            dt_movto: formatarDataFirestore(doc.data().dt_movto.toDate()),
            conta: doc.data().conta,
            ds_conta: (responseConta.data().tp_conta === 'C' ? 'Conta Corrente' : 'Poupança') + ' / ' + responseConta.data().cd_conta,
            ds_contadest: responseContaDest !== null ? (responseContaDest.data().tp_conta === 'C' ? 'Conta Corrente' : 'Poupança') + ' / ' + responseContaDest.data().cd_conta : '',
            grupo: doc.data().grupo,
            ds_grupo: responseGrupo.data().ds_grupo,
            ds_subgrupo: responseSubGrupo.data().ds_subgrupo,
            dt_transacao: formatarDataHoraFirestore(doc.data().dt_transacao.toDate()),
            vl_movto: formatarReal(doc.data().vl_movto)
          }
          arrayLanctos.push(lancto)
        }
        this.lancamentos = arrayLanctos
        this.inProgress = false
      } catch (error) {
        this.inProgress = false
        console.log(`${error.code}: ${error.message}`)
        alert(`${error.code}: ${error.message}`)
        this.$router.push('login')
      }
    }
  },
  beforeMount () {
    this.validarSessao()
    this.carregarLancamentos()
  }
}
</script>

<style scoped>

  .fa:before {
    font-family: FontAwesome !important;
  }
  .lista {
    margin: 50px;
    padding: 5px;
  }
  .tabela {
    margin:auto;
    margin-top: 15px;
  }
  .botao {
    height: 35px;
  }
  .novo_grupo {
    margin: auto;
    padding-left: 5px;
    padding-right: 5px;
  }
  .centered {
    margin: 0 auto !important;
    float: none !important;
  }
  .barra {
    margin-bottom: 10px;
  }
  .botao-refresh {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .barra-progresso {
    margin-top: 10px;
  }
  .input-ano {
    width: 10px;
  }

</style>
