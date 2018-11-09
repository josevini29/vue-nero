<template>
  <div v-if="inShow">
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Cadastro de Contas</h5>
                <button type="button" class="close" @click="show" aria-label="Fechar">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="container novo_conta breadcrumb">
                  <div class="row centered">
                    <div class="col-sm-3">
                      <label for="cd_conta">Cód. Conta</label>
                      <input type="text" class="form-control" placeholder="Cód. Conta" id="cd_conta" v-model="cdConta"/>
                    </div>
                    <div class="col-sm-4">
                      <label for="id_banco">Banco</label>
                      <select class="form-control" id="id_banco" v-model="idBanco">
                        <option v-for="(banco, index) in bancos" v-bind:key="index" :value="banco._id">
                          {{banco.name}}
                        </option>
                      </select>
                    </div>
                    <div class="col-sm-4">
                      <label for="tp_conta">Tipo</label>
                      <select class="form-control" id="tp_conta" v-model="tpConta">
                        <option v-for="(tipo, index) in tipos" v-bind:key="index" :value="tipo.id_tipo">
                          {{tipo.ds_tipo}}
                        </option>
                      </select>
                    </div>
                    <div class="col-sm-1">
                      <label for="bt_salvar"></label>
                      <button class="btn btn-primary mb-2" id="bt_salvar" @click="salvarConta"><i class="fas fa-save"></i></button>
                      <label for="bt_cancelar"></label>
                      <button class="btn btn-secondary mb-2" id="bt_cancelar" v-if="inEdicao" @click="limparAlteracao"><i class="fas fa-times"></i></button>
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
                      {{ conta.code }}
                    </td>
                    <td class="lista">
                      {{ conta.bank.name }}
                    </td>
                    <td class="lista">
                      {{ conta.type === 'C' ? 'Conta Corrente' : 'Conta Poupança'}}
                    </td>
                    <td class="lista">
                      <button type="button" class="btn btn-warning botao" @click="alterarConta(conta)"><i class="fas fa-edit"></i></button>
                      <button type="button" class="btn btn-danger botao" @click="deletarConta(conta)"><i class="fas fa-trash-alt"></i></button>
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
import { obterContas, editarContas, deletarConta } from '../../Controllers/ControllerConta'
import { obterBancos } from '../../Controllers/ControllerBanco'

export default {
  name: 'Conta',
  data () {
    return {
      contas: [],
      bancos: [],
      tipos: [{id_tipo: 'C', ds_tipo: 'Conta Corrente'}, {id_tipo: 'P', ds_tipo: 'Poupança'}],
      idConta: '',
      cdConta: '',
      tpConta: '',
      idBanco: '',
      inShow: false,
      inEdicao: false
    }
  },
  methods: {
    show: function () {
      this.inShow = !this.inShow
      if (this.inShow) {
        this.carregarContas()
        this.listaBancos()
      }
    },
    carregarContas: async function () {
      try {
        this.contas = await obterContas()
      } catch (error) {
        this.$toasted.show(`${error.code} - ${error.message}`)
        Redirecionar.login(error.code)
      }
    },
    listaBancos: async function () {
      try {
        this.bancos = await obterBancos()
      } catch (error) {
        this.$toasted.show(`${error.code} - ${error.message}`)
        Redirecionar.login(error.code)
      }
    },
    salvarConta: async function (event) {
      if (event) {
        if (this.cdConta === '') {
          this.$toasted.show('Informe o código da conta!')
          return
        }

        if (this.idBanco === '') {
          this.$toasted.show('Informe o banco!')
          return
        }

        if (this.tpConta === '') {
          this.$toasted.show('Informe o tipo de conta!')
          return
        }

        try {
          let conta = {
            code: this.cdConta, bank: this.idBanco, type: this.tpConta
          }
          if (this.idConta !== '') {
            conta = { ...conta, _id: this.idConta }
          }
          await editarContas(conta)
          this.limparAlteracao()
          this.carregarContas()
        } catch (error) {
          this.$toasted.show(`${error.code} - ${error.message}`)
          Redirecionar.login(error.code)
        }
      }
    },
    alterarConta: function (Conta) {
      if (Conta) {
        this.idConta = Conta._id
        this.cdConta = Conta.code
        this.tpConta = Conta.type
        this.idBanco = Conta.bank._id
        this.inEdicao = true
      }
    },
    limparAlteracao: function () {
      this.idConta = ''
      this.cdConta = ''
      this.tpConta = ''
      this.idBanco = ''
      this.inEdicao = false
    },
    deletarConta: async function (conta) {
      if (!conta._id) {
        this.$toasted.show('Erro id do documento não foi repassado para deleção!')
        return
      }

      var result = confirm(`Deseja realmente deletar "${conta.code} - ${conta.bank.name}"?`)
      if (result === true) {
        try {
          await deletarConta(conta)
          this.carregarContas()
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
  .novo_conta {
    margin: auto;
    padding-left: 5px;
    padding-right: 5px;
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
