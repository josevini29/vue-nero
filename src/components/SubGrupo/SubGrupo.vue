<template>
  <div class="modal fade" id="modalCadSubGrupo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Cadastro de Sub-Grupo</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container novo_subgrupo breadcrumb">
            <div class="row centered">
              <div class="col-sm-5">
                <label for="cd_subgrupo">Desc. Sub-Grupo</label>
                <input type="text" class="form-control" placeholder="Sub-Grupo" id="cd_subgrupo" v-model="dsSubGrupo"/>
              </div>
              <div class="col-sm-4">
                <label for="tp_movto">*Tipo Movto</label>
                <select class="form-control" id="tp_movto" v-model="tpMovto">
                  <option v-for="(tipo, index) in tipos" v-bind:key="index" :value="tipo.id_tipo">
                    {{tipo.ds_tipo}}
                  </option>
                </select>
              </div>
              <div class="col-sm-1">
                <label for="bt_salvar"></label>
                <button class="btn btn-primary mb-2" id="bt_salvar" @click="salvarSubGrupo"><i class="fas fa-save"></i></button>
              </div>
              <div class="col-sm-1" v-if="inEdicao">
                <label for="bt_cancelar"></label>
                <button class="btn btn-secondary mb-2" id="bt_cancelar" @click="descartarAlteracao"><i class="fas fa-times"></i></button>
              </div>
            </div>
          </div>
          <table class="table tabela">
            <thead>
                <tr>
                  <th scope="col">Sub-Grupo</th>
                  <th scope="col">Tipo Movto</th>
                  <th scope="col">Ações</th>
                </tr>
            </thead>
            <tr v-for="(subgrupo, index) in subGrupos" v-bind:key="index">
              <td class="lista">
                {{ subgrupo.ds_subgrupo }}
              </td>
              <td class="lista">
                {{ subgrupo.ds_tpmovto }}
              </td>
              <td class="lista">
                <button type="button" class="btn btn-warning botao" @click="alterarSubGrupo(subgrupo)"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger botao" @click="deletarSubGrupo(subgrupo)"><i class="fas fa-trash-alt"></i></button>
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
  name: 'SubGrupo',
  data () {
    return {
      db: firebase.firestore(),
      idSubGrupo: '',
      dsSubGrupo: '',
      tpMovto: '',
      subGrupos: [],
      inEdicao: false,
      tipos: [{id_tipo: 'E', ds_tipo: 'Entrada'}, {id_tipo: 'S', ds_tipo: 'Saída'}]
    }
  },
  methods: {
    validarSessao: function () {
      var user = firebase.auth().currentUser
      if (!user) {
        this.$router.push('login')
      }
    },
    carregarSubGrupos: async function () {
      try {
        var arraySubGrupo = []
        const settings = {timestampsInSnapshots: true}
        this.db.settings(settings)
        let response = await this.db.collection('sub-grupo').get()
        for (let i = 0; i < response.docs.length; i++) {
          let doc = response.docs[i]
          const subgrupo = {
            id_subgrupo: doc.id,
            ds_subgrupo: doc.data().ds_subgrupo,
            tp_movto: doc.data().tp_movto,
            ds_tpmovto: doc.data().tp_movto === 'S' ? 'Saída' : 'Entrada'
          }
          arraySubGrupo.push(subgrupo)
        }
        this.subGrupos = arraySubGrupo
      } catch (error) {
        alert(`${error.code}: ${error.message}`)
        this.$router.push('login')
      }
    },
    salvarSubGrupo: function (event) {
      if (event) {
        if (this.dsSubGrupo === '' || this.tpMovto === '') {
          alert('Informe os campos obrigatórios!')
        } else {
          if (this.idSubGrupo === '') {
            this.db.collection('sub-grupo').add({
              ds_subgrupo: this.dsSubGrupo,
              tp_movto: this.tpMovto
            }).then(() => {
              console.log('Registro salvo com sucesso!')
              this.carregarSubGrupos()
            }).catch((error) => {
              alert('Erro ao salvar registro!', error)
            })
          } else {
            this.db.collection('sub-grupo').doc(this.idSubGrupo).set({
              ds_subgrupo: this.dsSubGrupo,
              tp_movto: this.tpMovto
            }).then(() => {
              console.log('Registro alterado com sucesso!')
              this.carregarSubGrupos()
            }).catch((error) => {
              alert('Erro ao alterar registro!', error)
            })
          }
        }
        this.idSubGrupo = ''
        this.dsSubGrupo = ''
        this.tpMovto = ''
        this.inEdicao = false
      }
    },
    alterarSubGrupo: function (SubGrupo) {
      if (SubGrupo) {
        this.idSubGrupo = SubGrupo.id_subgrupo
        this.dsSubGrupo = SubGrupo.ds_subgrupo
        this.tpMovto = SubGrupo.tp_movto
        this.inEdicao = true
      }
    },
    deletarSubGrupo: function (SubGrupo) {
      if (!SubGrupo) {
        alert('Erro id do documento não foi repassado para deleção!')
        return
      }

      var result = confirm('Deseja realmente deletar "' + SubGrupo.ds_subgrupo + '"?')
      if (result === true) {
        this.db.collection('sub-grupo').doc(SubGrupo.id_subgrupo).delete().then(() => {
          console.log('Registro deletado com sucesso!')
          this.carregarSubGrupos()
        }).catch((error) => {
          console.log(error)
          alert('Erro ao deletar registro!', error)
        })
      }
    },
    descartarAlteracao: function () {
      this.idSubGrupo = ''
      this.dsSubGrupo = ''
      this.tpMovto = ''
      this.inEdicao = false
    }
  },
  beforeMount () {
    this.validarSessao()
    this.carregarSubGrupos()
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
  .novo_subgrupo {
    margin: auto;
    padding-left: 5px;
    padding-right: 5px;
  }
  .centered {
    margin: 0 auto !important;
    float: none !important;
  }

</style>
