<template>
  <div class="modal fade" id="modalCadBanco" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Cadastro de Bancos</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-inline novo_banco breadcrumb">
            <div class="row centered">
              <div class="form-group mx-sm-3 mb-2">
                <label for="desc_banco" class="sr-only">Nome Banco</label>
                <input type="hidden" v-model="idBanco"/>
                <input type="text" class="form-control" id="desc_banco" placeholder="Informe o Banco" v-model="dsBanco"/>
              </div>
              <button class="btn btn-primary mb-2" @click="salvarBanco">Salvar</button>
            </div>
          </div>
          <table class="tabela">
            <tr v-for="(banco, index) in bancos" v-bind:key="index">
              <td class="lista">
                {{ banco.ds_banco }}
              </td>
              <td class="lista">
                <button type="button" class="btn btn-warning botao" @click="alterarBanco(banco.id_banco, banco.ds_banco)"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger botao" @click="deletarBanco(banco.id_banco, banco.ds_banco)"><i class="fas fa-trash-alt"></i></button>
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
  name: 'Banco',
  data () {
    return {
      db: firebase.firestore(),
      bancos: [],
      idBanco: '',
      dsBanco: ''
    }
  },
  methods: {
    validarSessao: function () {
      var user = firebase.auth().currentUser
      if (!user) {
        this.$router.push('login')
      }
    },
    carregarBancos: function () {
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
    salvarBanco: function (event) {
      if (event) {
        if (this.dsBanco === '') {
          alert('Informe o nome do banco!')
        } else {
          if (this.idBanco === '') {
            this.db.collection('banco').add({
              ds_banco: this.dsBanco
            }).then(() => {
              console.log('Registro salvo com sucesso!')
              this.carregarBancos()
            }).catch((error) => {
              alert('Erro ao salvar registro!', error)
            })
          } else {
            this.db.collection('banco').doc(this.idBanco).set({
              ds_banco: this.dsBanco
            }).then(() => {
              console.log('Registro alterado com sucesso!')
              this.carregarBancos()
            }).catch((error) => {
              alert('Erro ao alterar registro!', error)
            })
          }
        }
        this.idBanco = ''
        this.dsBanco = ''
      }
    },
    alterarBanco: function (idBanco, dsBanco) {
      if (idBanco) {
        this.idBanco = idBanco
        this.dsBanco = dsBanco
      }
    },
    deletarBanco: function (idBanco, dsBanco) {
      if (!idBanco) {
        alert('Erro id do documento não foi repassado para deleção!')
        return
      }

      var result = confirm('Deseja realmente deletar "' + dsBanco + '"?')
      if (result === true) {
        this.db.collection('banco').doc(idBanco).delete().then(() => {
          console.log('Registro deletado com sucesso!')
          this.carregarBancos()
        }).catch((error) => {
          console.log(error)
          alert('Erro ao deletar registro!', error)
        })
      }
    }
  },
  beforeMount () {
    this.validarSessao()
    this.carregarBancos()
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
  .novo_banco {
    margin: auto;
    padding: 20px;
  }
  .centered {
    margin: 0 auto !important;
    float: none !important;
  }

</style>
