<template>
  <div class="modal fade" id="modalCadGrupo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Cadastro de Grupos</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container novo_grupo breadcrumb">
            <div class="row centered">
              <div class="col-sm-5">
                <label for="ds_grupo">*Desc. Grupo</label>
                <input type="text" class="form-control" placeholder="Desc. Grupo" id="ds_grupo" v-model="dsGrupo"/>
              </div>
              <div class="col-sm-5">
                <label for="id_subgrupo">*Sub-Grupo</label>
                <select class="form-control" id="id_subgrupo" v-model="idSubGrupo">
                  <option v-for="(subgrupo, index) in subGrupos" v-bind:key="index" :value="subgrupo.id_subgrupo">
                    {{subgrupo.ds_subgrupo}}
                  </option>
                </select>
              </div>
              <div class="col-sm-1">
                <label for="bt_salvar"></label>
                <button class="btn btn-primary mb-2" id="bt_salvar" @click="salvarGrupo"><i class="fas fa-save"></i></button>
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
                  <th scope="col">Grupo</th>
                  <th scope="col">Sub-Grupo</th>
                  <th scope="col">Ações</th>
                </tr>
            </thead>
            <tr v-for="(grupo, index) in grupos" v-bind:key="index">
              <td class="lista">
                {{ grupo.ds_grupo }}
              </td>
              <td class="lista">
                {{ grupo.ds_subgrupo }}
              </td>
              <td class="lista">
                <button type="button" class="btn btn-warning botao" @click="alterarGrupo(grupo)"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger botao" @click="deletarGrupo(grupo)"><i class="fas fa-trash-alt"></i></button>
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
  name: 'Grupo',
  data () {
    return {
      db: firebase.firestore(),
      grupos: [],
      subGrupos: [],
      inEdicao: false,
      idGrupo: '',
      dsGrupo: '',
      idSubGrupo: ''
    }
  },
  methods: {
    validarSessao: function () {
      var user = firebase.auth().currentUser
      if (!user) {
        this.$router.push('login')
      }
    },
    carregarGrupos: async function () {
      try {
        var arrayGrupo = []
        const settings = {timestampsInSnapshots: true}
        this.db.settings(settings)
        let response = await this.db.collection('grupo').get()
        for (let i = 0; i < response.docs.length; i++) {
          let doc = response.docs[i]
          let responseSubGrupo = await this.db.collection('sub-grupo').doc(doc.data().subgrupo.id).get()
          const grupo = {
            id_grupo: doc.id,
            ds_grupo: doc.data().ds_grupo,
            subgrupo: doc.data().subgrupo,
            ds_subgrupo: responseSubGrupo.data().ds_subgrupo
          }
          arrayGrupo.push(grupo)
        }
        this.grupos = arrayGrupo
      } catch (error) {
        alert(`${error.code}: ${error.message}`)
        this.$router.push('login')
      }
    },
    listaSubGrupos: function () {
      var arraySubGrupo = []
      const settings = {timestampsInSnapshots: true}
      this.db.settings(settings)
      this.db.collection('sub-grupo').get().then((snapshot) => {
        snapshot.forEach(doc => {
          const subgrupo = {
            id_subgrupo: doc.id,
            ds_subgrupo: doc.data().ds_subgrupo
          }
          arraySubGrupo.push(subgrupo)
        })
        this.subGrupos = arraySubGrupo
      }).catch((error) => {
        alert(`${error.code}: ${error.message}`)
        this.$router.push('login')
      })
    },
    salvarGrupo: function (event) {
      if (event) {
        if (this.dsGrupo === '' || this.idSubGrupo === '') {
          alert('Informe os campos obrigatórios!')
        } else {
          if (this.idGrupo === '') {
            this.db.collection('grupo').add({
              ds_grupo: this.dsGrupo,
              subgrupo: this.db.collection('sub-grupo').doc(this.idSubGrupo)
            }).then(() => {
              console.log('Registro salvo com sucesso!')
              this.carregarGrupos()
            }).catch((error) => {
              alert('Erro ao salvar registro!', error)
            })
          } else {
            this.db.collection('grupo').doc(this.idGrupo).set({
              ds_grupo: this.dsGrupo,
              subgrupo: this.db.collection('sub-grupo').doc(this.idSubGrupo)
            }).then(() => {
              console.log('Registro alterado com sucesso!')
              this.carregarGrupos()
            }).catch((error) => {
              alert('Erro ao alterar registro!', error)
            })
          }
        }
        this.idGrupo = ''
        this.dsGrupo = ''
        this.idSubGrupo = ''
        this.inEdicao = false
      }
    },
    alterarGrupo: function (Grupo) {
      if (Grupo) {
        this.idGrupo = Grupo.id_grupo
        this.dsGrupo = Grupo.ds_grupo
        this.idSubGrupo = Grupo.subgrupo.id
        this.inEdicao = true
      }
    },
    deletarGrupo: function (Grupo) {
      if (!Grupo) {
        alert('Erro id do documento não foi repassado para deleção!')
        return
      }

      var result = confirm('Deseja realmente deletar "' + Grupo.ds_grupo + '"?')
      if (result === true) {
        this.db.collection('grupo').doc(Grupo.id_grupo).delete().then(() => {
          console.log('Registro deletado com sucesso!')
          this.carregarGrupos()
        }).catch((error) => {
          console.log(error)
          alert('Erro ao deletar registro!', error)
        })
      }
    },
    descartarAlteracao: function () {
      this.idGrupo = ''
      this.dsGrupo = ''
      this.idSubGrupo = ''
      this.inEdicao = false
    }
  },
  beforeMount () {
    this.validarSessao()
    this.carregarGrupos()
    this.listaSubGrupos()
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

</style>
