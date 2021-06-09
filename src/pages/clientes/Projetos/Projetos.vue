<template>
  <div class="projetos">
      <v-container>
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
                    <div class="text-h7 white--text pa-3 v-card--material__title"> {{nomeCliente}}</div>
                  </v-theme-provider>
                </v-sheet>
              </v-card-title>
              <v-card class="card-projetos">
                <v-container class="py-0">
                  <v-row class="pt-9 px-5">
                    <template>
                      <v-col
                        cols="12"
                        sm="4"
                        md="4"
                        lg="3"
                        xs="3"
                      >
                        <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="dateFormatted"
                              label="Data Inicio"
                              prepend-icon="mdi-calendar"
                              readonly
                              clearable
                              v-bind="attrs"
                              @blur="date = parseDate(dateFormatted)"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date"
                            :first-day-of-week="0"
                            locale="pt-bt"
                            no-title
                            scrollable
                            @input="menu = false"
                          >
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                        lg="4"
                        xs="4"
                        >
                          <v-text-field
                            v-model="textoPesquisar"
                            clearable
                            label="Pesquisar"
                            append-icon="mdi-magnify"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="12"
                          md="2"
                          lg="2"
                          xs="2"
                          style="text-align:right"
                        >
                          <v-btn color="blue-grey" class="white--text" @click="getProjetos()">Pesquisar</v-btn>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="12"
                          md="3"
                          lg="3"
                          xs="3"
                          style="text-align:right"
                        >
                          <v-btn color="blue" class="white--text" @click="dialogCliente = true">Adicionar Projeto</v-btn>
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
                                  Nome dos Projetos
                                </th>
                                <th class="text-left">
                                  Data Inicio
                                </th>
                                <th class="text-left">
                                  Status
                                </th>
                                <th class="text-center">
                                  Pausar / Ativar
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="item in desserts"
                                :key="item.nome"

                              >
                                <td>{{ item.nome }}</td>
                                <td>{{ item.dataIncioConfig }}</td>
                                <td>{{ item.ativo == true ? 'Ativo' : 'Desativo' }}</td>
                                <td class="click-projetos text-center">
                                  <v-btn
                                    width="30px"
                                    height="30px"
                                    fab
                                    dark
                                    small
                                    :color="item.pausado ? 'green' : 'red' "
                                    @click="alterarStatusProjeto(item.nome, item.pausado)"
                                  >
                                    <v-icon dark small v-if="item.pausado">mdi-play</v-icon>
                                    <v-icon dark small v-else>mdi-pause</v-icon>
                                  </v-btn>
                                </td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-col>
                      </template>
                      <template>
                        <v-col
                          cols="12"
                          md="12"
                          lg="12"
                          sm="12"
                          xs="12"
                          class="text-right"
                        >
                          <v-btn
                            depressed
                            color="primary"
                            @click="voltar() "
                          >
                            Voltar
                          </v-btn>
                        </v-col>
                      </template>
                    </v-row>
                </v-container>
              </v-card>
          </v-flex>
        </v-layout>
      </v-container>
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
                      sm="6"
                    >
                    <v-text-field
                      v-model="novoNomeProjeto"
                      :rules="rules.name"
                      label="Nome do Projeto"
                      required
                      clearable
                    ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                    >
                      <v-menu
                          ref="menuModal"
                          v-model="menuModal"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="dateModal"
                              label="Escolha a Data"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="dateModal"
                            :first-day-of-week="0"
                            locale="pt-bt"
                            no-title
                            scrollable
                            @input="menuModal = false"
                          >
                          </v-date-picker>
                        </v-menu>
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

    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  props: ['nomeCliente'],
  data: vm => ({
    date: '',
    dateModal: new Date().toISOString().substr(0, 10),
    dateFormatted: '',
    menu: false,
    menuModal: false,
    projetos: [],
    desserts: [],
    dataInicio: '',
    showRdoProjeto: false,
    dialogCliente: false,
    mensagem: '',
    colorSnackbar: '',
    novoNomeProjeto: '',
    snackbar: false,
    textoPesquisar: '',
    urlProd: 'https://htgneexsa.cf/api_htg/',
    // urlProd: 'http://localhost:4040/api_htg/',
    rules: {
      name: [val => (val || '').length > 0 || 'Preencher o Nome do Cliente']
    }
  }),
  created () {
    this.$root.$emit('Sppinner::show')
    this.getProjetos()
    this.$root.$emit('Sppinner::hide')
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    }
  },
  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    async getProjetos () {
      const params = {
        nomeCliente: this.nomeCliente,
        dataInicio: this.dateFormatted ? moment(this.dateFormatted).valueOf() : null,
        textoPesquisar: this.textoPesquisar ? this.textoPesquisar : ''
      }
      try {
        const result = await axios({
          method: 'POST',
          url: `${this.urlProd}projetos`,
          data: params
        })
        this.desserts = result.data.map(item => {
          return {
            ...item,
            dataIncioConfig: moment(item.dataInicioInter).format('DD/MM/YYYY')
          }
        })
      } catch (err) {
        console.log(err)
        this.snackbar = true
        this.mensagem = 'Erro ao carregar Projetos'
        this.colorSnackbar = 'red'
      }
    },

    voltar () {
      this.$emit('voltar')
    },

    async verificarFormulario () {
      const dataInicio = moment(this.dateModal).valueOf()
      console.log(this.novoNomeProjeto, dataInicio)
      if (this.novoNomeProjeto && dataInicio) {
        const params = {
          nomeCliente: this.nomeCliente,
          novoNomeProjeto: this.novoNomeProjeto,
          dataInicio: dataInicio
        }
        const result = await axios({
          method: 'POST',
          url: `${this.urlProd}novo-projeto`,
          data: params
        })
        this.snackbar = true
        this.mensagem = result.data.mensagem
        this.colorSnackbar = 'green'
        this.dialogCliente = false
        this.getProjetos()
      } else {
        this.snackbar = true
        this.mensagem = 'Preencha o Campo Nome do Cliente e a Data'
        this.colorSnackbar = 'red'
      }
    },

    async alterarStatusProjeto (nome, status) {
      const statusAgora = !status
      const params = {
        nomeCliente: this.nomeCliente,
        nomeProjeto: nome,
        status: statusAgora
      }
      try {
        const result = await axios({
          method: 'POST',
          url: `${this.urlProd}alterar-status-projeto`,
          data: params
        })
        console.log(result)
        if (result.data.cliente && result.data.cliente.length > 0) {
          this.snackbar = true
          this.mensagem = result.data.mensagem + ': ' + result.data.cliente
          this.colorSnackbar = 'red'
          this.dialogCliente = false
        } else {
          this.snackbar = true
          this.mensagem = result.data.mensagem
          this.colorSnackbar = 'green'
          this.getProjetos()
        }
      } catch (err) {
        console.log(err)
        this.snackbar = true
        this.mensagem = 'Não foi possivel alterar o statis do projeto'
        this.colorSnackbar = 'red'
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

  .card-projetos{
    margin-top: -30px;
    z-index: 0;
  }

  .color-row{
    background-color: var(--light-gray)!important;
  }

  .color-table {
    background-color: var(--light-gray)!important;
  }
</style>
