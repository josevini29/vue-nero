<template>
  <div v-if="inShow">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Cadastro de Bancos</h5>
                <button type="button" class="close" aria-label="Fechar" @click="show">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="form-inline novo_banco breadcrumb">
                  <div class="row centered">
                    <div class="form-group mx-sm-3 mb-2">
                      <label for="cod_banco" class="sr-only">Cód. Banco</label>
                      <input type="text" class="form-control" id="cod_banco" placeholder="Cód. Banco" v-model="codBanco" autofocus/>
                    </div>
                    <div class="form-group mx-sm-3 mb-2">
                      <label for="desc_banco" class="sr-only">Nome Banco</label>
                      <input type="text" class="form-control" id="desc_banco" placeholder="Nome Banco" v-model="nmBanco"/>
                    </div>
                    <button class="btn btn-primary mb-2" @click="salvarBanco"><i class="fas fa-save"></i></button>
                    <button class="btn btn-secondary mb-2" id="bt_cancelar" v-if="inEdicao" @click="limparAlteracao"><i class="fas fa-times"></i></button>
                  </div>
                </div>
                <table class="tabela">
                  <tr v-for="(banco, index) in bancos" v-bind:key="index">
                    <td class="lista">
                    {{ banco.code }} - {{ banco.name }}
                    </td>
                    <td class="lista">
                      <button type="button" class="btn btn-warning botao" @click="alterarBanco(banco)"><i class="fas fa-edit"></i></button>
                      <button type="button" class="btn btn-danger botao" @click="deletarBanco(banco)"><i class="fas fa-trash-alt"></i></button>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="show">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

import Redirecionar from '../Util/Redirecionar'
import { obterBancos, editarBanco, deletarBanco } from '../../Controllers/ControllerBanco'

export default {
  name: 'Banco',
  data () {
    return {
      bancos: [],
      idBanco: '',
      codBanco: '',
      nmBanco: '',
      inEdicao: false,
      inShow: false
    }
  },
  methods: {
    show: function () {
      this.inShow = !this.inShow
      if (this.inShow) {
        this.carregarBancos()
      }
    },
    carregarBancos: async function () {
      try {
        this.bancos = await obterBancos()
      } catch (error) {
        this.$toasted.show(`${error.code} - ${error.message}`)
        Redirecionar.login(error.code)
      }
    },
    salvarBanco: async function (event) {
      if (event) {
        if (this.codBanco === '') {
          this.$toasted.show('Informe o código do banco!')
          return
        }

        if (this.nmBanco === '') {
          this.$toasted.show('Informe o nome do banco!')
          return
        }

        try {
          let banco = {
            code: this.codBanco, name: this.nmBanco
          }
          if (this.idBanco !== '') {
            banco = { ...banco, _id: this.idBanco }
          }
          await editarBanco(banco)
          this.limparAlteracao()
          this.carregarBancos()
        } catch (error) {
          this.$toasted.show(`${error.code} - ${error.message}`)
          Redirecionar.login(error.code)
        }
      }
    },
    alterarBanco: function (banco) {
      if (banco) {
        this.idBanco = banco._id
        this.codBanco = banco.code
        this.nmBanco = banco.name
        this.inEdicao = true
      }
    },
    limparAlteracao: function () {
      this.idBanco = ''
      this.codBanco = ''
      this.nmBanco = ''
      this.inEdicao = false
    },
    deletarBanco: async function (banco) {
      if (!banco._id) {
        this.$toasted.show('Erro id do documento não foi repassado para deleção!')
        return
      }

      var result = confirm(`Deseja realmente deletar "${banco.code} - ${banco.name}"?`)
      if (result === true) {
        try {
          await deletarBanco(banco)
          this.carregarBancos()
        } catch (error) {
          this.$toasted.show(`${error.code} - ${error.message}`)
          Redirecionar.login(error.code)
        }
      }
    }
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

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

</style>
