<template>
  <div class="clientes">
      <v-container v-if="showClientes">
        <v-layout row wrap>
          <v-flex sm12 xs12 md12 lg12 class="mt-10">
              <v-card-title class="align-start">
                <v-sheet
                color="brown"
                width="100%"
                class="overflow-hidden mt-n9 transition-swing v-card--material__sheet"
                style="z-index: 2"
                elevation="6"
                max-width="100%"
                rounded
                >
                  <v-theme-provider dark>
                    <div class="text-h7 white--text pa-3 v-card--material__title"> Clientes </div>
                  </v-theme-provider>
                </v-sheet>
              </v-card-title>
              <v-card class="card-clientes">
                <v-container class="py-0">
                  <v-row class="pt-9 px-5">
                    <template>
                      <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        lg="5"
                        xs="5"
                      >
                        <v-text-field
                        v-model="nomePesquisa"
                          clearable
                          label="Pesquisar"
                          append-icon="mdi-magnify"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        lg="2"
                        xs="2"
                        style="text-align:right"
                      >
                        <v-btn color="blue-grey" class="white--text" @click="getCliente()">Pesquisar</v-btn>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        lg="5"
                        xs="5"
                        style="text-align:right"
                      >
                        <v-btn color="blue" class="white--text" @click="dialogCliente = true">Adicionar Cliente</v-btn>
                      </v-col>
                    </template>
                  </v-row>
                  <v-row>
                    <template>
                      <v-col
                        cols="12"
                        md="12"
                        lg="12"
                        sm="12"
                        xs="12"
                      >
                        <v-simple-table class="color-table">
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">
                                  Nome dos Clientes
                                </th>
                                <th class="text-center">
                                  Qtd. Projetos Ativos
                                </th>
                                <th class="text-center">
                                  Qtd. Projetos Pausados
                                </th>
                                <th class="text-center">
                                  Projetos
                                </th>
                                <th class="text-center">
                                  Desativar / Ativar Cliente
                                </th>
                                <th class="text-center">
                                  Excluir Cliente
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="item in desserts"
                                :key="item.cliente.nome"
                              >
                                <td>{{ item.cliente.nome }}</td>
                                <td class="text-center" style="width: 25%">{{ item.quantidadeProjetos }}</td>
                                <td class="text-center" style="width: 25%">{{ item.quantidadeProjetos }}</td>
                                <td class="text-center" style="width: 10%">
                                  <v-btn
                                    width="30px"
                                    height="30px"
                                    fab
                                    dark
                                    small
                                    color="primary"
                                    @click="showProjeto(item.cliente.nome)"
                                  >
                                    <v-icon dark small>
                                      mdi-dots-vertical
                                    </v-icon>
                                  </v-btn>
                                </td>
                                <td class="text-center" style="width: 12%">
                                  <v-btn
                                    width="30px"
                                    height="30px"
                                    fab
                                    dark
                                    small
                                    :color="item.cliente.ativo ? 'orange' : 'green'"
                                    @click="alterarStatusCliente(item.cliente.nome, item.cliente.ativo)"
                                  >
                                    <v-icon dark small v-if="item.cliente.ativo === false">mdi-play</v-icon>
                                    <v-icon dark small v-else>mdi-pause</v-icon>
                                  </v-btn>
                                </td>
                                <td class="text-center" style="width: 10%">
                                  <v-btn
                                    width="30px"
                                    height="30px"
                                    fab
                                    dark
                                    small
                                    color="red"
                                    @click="deleteCliente(item.cliente.nome)"
                                  >
                                    <v-icon dark small>
                                      mdi-close
                                    </v-icon>
                                  </v-btn>
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-col>
                      </template>
                  </v-row>
                </v-container>
              </v-card>
          </v-flex>
        </v-layout>

        <v-dialog
        v-model="dialogCliente"
          transition="dialog-top-transition"
          max-width="600"
        >
          <template>
            <v-card>
              <v-toolbar
                color="primary"
                dark
              >Adicionar Cliente</v-toolbar>
              <v-card-text>
                <v-form
                  ref="form"
                >
                    <v-container fluid>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="12"
                      >
                      <v-text-field
                        v-model="novoNomeCliente"
                        :rules="rules.name"
                        label="Nome do Cliente"
                        required
                        clearable
                      ></v-text-field>
                      </v-col>
                    </v-row>
                    </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                  text
                  @click="dialogCliente = false"
                >Close</v-btn>
                <v-btn
                  color="green"
                  text
                  @click="verificarFormulario()"
                >Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <v-snackbar
          v-model="snackbar"
          :color="colorSnackbar"
        >
          {{ mensagem }}

          <template v-slot:action="{ attrs }">
            <v-btn
              color="white"
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

      </v-container>
      <projetos
        v-if="showProjetos"
        v-on:voltar="returnClientes()"
        :nomeCliente="nomeCliente"
      />
    </div>
</template>

<script>
import axios from 'axios'
import Projetos from './Projetos/Projetos.vue'
export default {
  components: { Projetos },
  name: 'Clientes',
  data: () => ({
    clientes: [],
    desserts: [],
    showClientes: true,
    showProjetos: false,
    nomeCliente: '',
    showRdo: false,
    novoNomeCliente: '',
    snackbar: false,
    dialogCliente: false,
    mensagem: '',
    colorSnackbar: '',
    nomePesquisa: '',
    urlProd: 'https://htgneexsa.cf/api_htg/',
    // urlProd: 'http://localhost:4040/api_htg/',
    rules: {
      name: [val => (val || '').length > 0 || 'Preencher o Nome do Cliente']
    }
  }),
  created () {
    this.getCliente()
  },
  methods: {
    async getCliente () {
      const params = {
        nomePesquisa: this.nomePesquisa ? this.nomePesquisa : ''
      }
      const result = await axios({
        method: 'POST',
        url: `${this.urlProd}clientes`,
        data: params
      })
      this.desserts = result.data
      console.log(this.desserts)
    },

    showProjeto (nome) {
      this.showProjetos = true
      this.showClientes = false
      this.nomeCliente = nome
    },

    returnClientes () {
      this.showProjetos = false
      this.showClientes = true
      // Atualizar a tabela
    },

    async verificarFormulario () {
      if (this.novoNomeCliente) {
        const params = {
          novoNomeCliente: this.novoNomeCliente
        }
        const result = await axios({
          method: 'POST',
          url: `${this.urlProd}novo-clientes`,
          data: params
        })
        this.snackbar = true
        this.mensagem = result.data.mensagem
        this.colorSnackbar = 'green'
        this.dialogCliente = false
        this.getCliente()
        // Atualizar so a tabela
      } else {
        this.snackbar = true
        this.mensagem = 'Preencha o Campo Nome do Cliente'
        this.colorSnackbar = 'red'
      }
    },

    async deleteCliente (nome) {
      const params = {
        nomeCliente: nome
      }
      const result = await axios({
        method: 'POST',
        url: `${this.urlProd}delete-clientes`,
        data: params
      })
      console.log(result)
      if (result.data.projeto && result.data.projeto.length > 0) {
        this.snackbar = true
        this.mensagem = result.data.mensagem + ': ' + result.data.projeto
        this.colorSnackbar = 'red'
        this.dialogCliente = false
      } else {
        console.log(result.data.mensagem)
        this.snackbar = true
        this.mensagem = result.data.mensagem
        this.colorSnackbar = 'green'
        this.dialogCliente = false
        this.getCliente()
        // Atualizar so a tabela
      }
    },

    async alterarStatusCliente (nome, status) {
      const statusAgora = !status
      console.log(nome, statusAgora)

      const params = {
        nomeCliente: nome,
        status: statusAgora
      }
      const result = await axios({
        method: 'POST',
        url: `${this.urlProd}alterar-status-clientes`,
        data: params
      })
      console.log(result)
      if (result.data.projeto && result.data.projeto.length > 0) {
        this.snackbar = true
        this.mensagem = result.data.mensagem + ': ' + result.data.projeto
        this.colorSnackbar = 'red'
        this.dialogCliente = false
      } else {
        console.log(result.data.mensagem)
        this.snackbar = true
        this.mensagem = result.data.mensagem
        this.colorSnackbar = 'green'
        this.dialogCliente = false
        this.getCliente()
        // Atualizar so a Tabela
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .color-icon {
    color: var(--dark);
  }

.icon-alien {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .ajuste-sheet{
    margin-top: -54px;
  }

  .card-clientes{
    margin-top: -30px;
    z-index: 0;
  }

  .color-row{
    background-color: var(--light-gray)!important;
  }

  .click-projetos {
    cursor: pointer;
  }

  .color-table {
    background-color: var(--light-gray)!important;
  }
</style>
