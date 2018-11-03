<template>
  <div class="modal fade" id="modalCadConta" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Cadastro de Contas</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container novo_conta breadcrumb">
            <div class="row centered">
              <div class="col-sm-3">
                <label for="cd_conta">*Cód. Conta</label>
                <input type="text" class="form-control" placeholder="Cód. Conta" id="cd_conta" v-model="cdConta"/>
              </div>
              <div class="col-sm-4">
                <label for="id_banco">*Banco</label>
                <select class="form-control" id="id_banco" v-model="idBanco">
                  <option v-for="(banco, index) in bancos" v-bind:key="index" :value="banco.id_banco">
                    {{banco.ds_banco}}
                  </option>
                </select>
              </div>
              <div class="col-sm-4">
                <label for="tp_conta">*Tipo</label>
                <select class="form-control" id="tp_conta" v-model="tpConta">
                  <option v-for="(tipo, index) in tipos" v-bind:key="index" :value="tipo.id_tipo">
                    {{tipo.ds_tipo}}
                  </option>
                </select>
              </div>
              <div class="col-sm-1">
                <label for="bt_salvar"></label>
                <button class="btn btn-primary mb-2" id="bt_salvar" @click="salvarConta"><i class="fas fa-save"></i></button>
              </div>
            </div>
          </div>
          <table class="table tabela">
            <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Banco</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Ações</th>
                </tr>
            </thead>
            <tr v-for="(conta, index) in contas" v-bind:key="index">
              <td class="lista">
                {{ conta.cd_conta }}
              </td>
              <td class="lista">
                {{ conta.ds_banco }}
              </td>
              <td class="lista">
                {{ conta.ds_tpconta }}
              </td>
              <td class="lista">
                <button type="button" class="btn btn-warning botao" @click="alterarConta(conta)"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger botao" @click="deletarConta(conta)"><i class="fas fa-trash-alt"></i></button>
              </td>
            </tr>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import * as firebase from 'firebase'

export default {
  name: 'Conta',
  data () {
    return {
      db: firebase.firestore(),
      contas: [],
      bancos: [],
      tipos: [{id_tipo: 'C', ds_tipo: 'Conta Corrente'}, {id_tipo: 'P', ds_tipo: 'Poupança'}],
      idConta: '',
      cdConta: '',
      tpConta: '',
      idBanco: ''
    }
  },
  methods: {
    validarSessao: function () {
      var user = firebase.auth().currentUser
      if (!user) {
        this.$router.push('login')
      }
    },
    carregarContas: async function () {
      try {
        var arrayConta = []
        const settings = {timestampsInSnapshots: true}
        this.db.settings(settings)
        let response = await this.db.collection('conta').get()
        for (let i = 0; i < response.docs.length; i++) {
          let doc = response.docs[i]
          let responseBanco = await this.db.collection('banco').doc(doc.data().banco.id).get()
          const conta = {
            id_conta: doc.id,
            cd_conta: doc.data().cd_conta,
            ds_tpconta: doc.data().tp_conta === 'C' ? 'Conta Corrente' : 'Poupança',
            tp_conta: doc.data().tp_conta,
            banco: doc.data().banco,
            ds_banco: responseBanco.data().ds_banco
          }
          arrayConta.push(conta)
        }
        this.contas = arrayConta
      } catch (error) {
        alert(`${error.code}: ${error.message}`)
        this.$router.push('login')
      }
    },
    listaBancos: function () {
      var arrayBanco = []
      const settings = {timestampsInSnapshots: true}
      this.db.settings(settings)
      this.db.collection('banco').get().then((snapshot) => {
        snapshot.forEach(doc => {
          const banco = {
            id_banco: doc.id,
            ds_banco: doc.data().ds_banco
          }
          arrayBanco.push(banco)
        })
        this.bancos = arrayBanco
      }).catch((error) => {
        alert(`${error.code}: ${error.message}`)
        this.$router.push('login')
      })
    },
    salvarConta: function (event) {
      if (event) {
        if (this.cdConta === '' || this.idBanco === '' || this.tpConta === '') {
          alert('Informe os campos obrigatórios!')
        } else {
          if (this.idConta === '') {
            this.db.collection('conta').add({
              banco: this.db.collection('banco').doc(this.idBanco),
              cd_conta: this.cdConta,
              tp_conta: this.tpConta
            }).then(() => {
              console.log('Registro salvo com sucesso!')
              this.carregarContas()
            }).catch((error) => {
              alert('Erro ao salvar registro!', error)
            })
          } else {
            this.db.collection('conta').doc(this.idConta).set({
              banco: this.db.collection('banco').doc(this.idBanco),
              cd_conta: this.cdConta,
              tp_conta: this.tpConta
            }).then(() => {
              console.log('Registro alterado com sucesso!')
              this.carregarContas()
            }).catch((error) => {
              alert('Erro ao alterar registro!', error)
            })
          }
        }
        this.idConta = ''
        this.cdConta = ''
        this.tpConta = ''
        this.idBanco = ''
      }
    },
    alterarConta: function (Conta) {
      if (Conta) {
        this.idConta = Conta.id_conta
        this.cdConta = Conta.cd_conta
        this.tpConta = Conta.tp_conta
        this.idBanco = Conta.banco.id
      }
    },
    deletarConta: function (Conta) {
      if (!Conta) {
        alert('Erro id do documento não foi repassado para deleção!')
        return
      }

      var result = confirm('Deseja realmente deletar "' + Conta.cd_conta + '"?')
      if (result === true) {
        this.db.collection('conta').doc(Conta.id_conta).delete().then(() => {
          console.log('Registro deletado com sucesso!')
          this.carregarContas()
        }).catch((error) => {
          console.log(error)
          alert('Erro ao deletar registro!', error)
        })
      }
    }
  },
  beforeMount () {
    this.validarSessao()
    this.carregarContas()
    this.listaBancos()
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
  .novo_conta {
    margin: auto;
    padding-left: 5px;
    padding-right: 5px;
  }
  .centered {
    margin: 0 auto !important;
    float: none !important;
  }

</style>
