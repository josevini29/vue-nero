<template>
  <div class="container-fluid graficos">
    <div class="row">
      <div class="col-sm-12 barra">
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
    </div>
    <div class="row" v-if="!inProgress"> <!--v-if="!inProgress"-->
      <div class="col-xl-6 grafico">
        <div class="Chart">
          <h4 style="text-align:center;">Proventos X Despesas</h4>
          <GraficoPizza :dados="this.grafico01"/>
        </div>
      </div>
      <div class="col-xl-6 grafico">
        <div class="Chart">
          <h4 style="text-align:center;">Despesas por Grupo</h4>
          <GraficoBarra :dados="this.grafico02"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as firebase from 'firebase'
import GraficoPizza from './GraficoPizza'
import GraficoBarra from './GraficoBarra'
import { formatarDataFirestore, formatarDataHoraFirestore, obterMeses, obterUltimoDiaMes } from '../../Util/Data'
import { formatarReal } from '../../Util/Numero'

export default {
  name: 'Grupo',
  data () {
    return {
      db: firebase.firestore(),
      lancamentos: [],
      grafico01: [],
      grafico02: [],
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
            subgrupo: responseSubGrupo,
            ds_subgrupo: responseSubGrupo.data().ds_subgrupo,
            dt_transacao: formatarDataHoraFirestore(doc.data().dt_transacao.toDate()),
            vl_movto: doc.data().vl_movto,
            vl_real: formatarReal(doc.data().vl_movto)
          }
          arrayLanctos.push(lancto)
        }
        this.lancamentos = arrayLanctos
        this.gerarDadosGraf01()
        this.gerarDadosGraf02()
        this.inProgress = false
      } catch (error) {
        this.inProgress = false
        console.log(`${error.code}: ${error.message}`)
        alert(`${error.code}: ${error.message}`)
        this.$router.push('login')
      }
    },
    gerarDadosGraf01: function () {
      // Gera o grafico de Pizza com Proventos vs Despesas
      let vlTotalProvento = 0
      let vlTotalDespesa = 0
      this.lancamentos.forEach((lancto) => {
        if (lancto.subgrupo.data().tp_movto === 'E') {
          vlTotalProvento += lancto.vl_movto
        } else {
          vlTotalDespesa += lancto.vl_movto
        }
      })
      this.grafico01 = {label: ['Proventos', 'Despesas'], value: [vlTotalProvento.toFixed(2), vlTotalDespesa.toFixed(2)]}
    },
    gerarDadosGraf02: function () {
      // Gera o grafico de Barras de despesas por grupo
      let grupos = {}
      this.lancamentos.forEach((lancto) => {
        if (lancto.subgrupo.data().tp_movto === 'S') {
          let vlAtual = grupos[lancto.subgrupo.data().ds_subgrupo] || 0
          vlAtual += lancto.vl_movto
          grupos[lancto.subgrupo.data().ds_subgrupo] = vlAtual
        }
      })
      let gruposFinal = []
      for (let prop in grupos) {
        let grupo = {
          name: prop,
          values: [grupos[prop]]
        }
        gruposFinal.push(grupo)
      }
      this.grafico02 = {label: ['Gastos'], grupo: gruposFinal}
    }
  },
  beforeMount () {
    this.validarSessao()
    this.carregarLancamentos()
  },
  components: {
    GraficoPizza,
    GraficoBarra
  }
}
</script>

<style scoped>

  .fa:before {
    font-family: FontAwesome !important;
  }
  .graficos {
      padding: 10px;
  }
  .grafico {
      padding-top: 25px;
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 10px;
  }
  .Chart {
    padding: 20px;
    box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, .15);
    border-radius: 20px;
    padding-top: 15px;
    padding-left: 5px;
    padding-right: 5px;
    padding-bottom: 15px;
  }
</style>
