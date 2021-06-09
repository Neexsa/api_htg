<template>
  <div class="home">
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
                  <slot name="heading" />
                  <div class="text-h7 white--text pa-3 v-card--material__title"> Criar RDO </div>
                </v-theme-provider>
              </v-sheet>
            </v-card-title>
            <v-card class="card-home">
              <v-container class="py-0">
                <v-row class="px-5 d-flex justify-center">
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                    lg="2"
                    xs="2"
                    class="mt-7"
                  >
                    <v-text-field
                        v-model="dataRdoInicio"
                        readonly
                        label="Data Inicio"
                      >
                    </v-text-field>
                    <!-- <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                      readonly
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateFormatted"
                          label="Data Inicio"
                          prepend-icon="mdi-calendar"

                          readonly
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
                        readonly
                      >
                      </v-date-picker>
                    </v-menu> -->
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                    lg="2"
                    xs="2"
                    class="mt-7"
                  >
                    <v-text-field
                      v-model="diaSemana"
                      readonly
                      label="Dia da Semana"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                    lg="2"
                    xs="2"
                    class="mt-7"
                  >
                    <v-text-field
                      label="ID / RDO"
                      v-model="dataIDRDO"
                      readonly
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row class="px-5 py-2">
                  <v-col
                    cols="12"
                    md="12"
                    lg="12"
                    sm="12"
                    xs="12"
                  >
                    <v-card class="color-card">
                      <v-row class="px-5">
                        <v-col
                          cols="12"
                          sm="12"
                          md="12"
                          lg="12"
                          xs="12"
                          class="pt-5 pb-0"
                        >
                        <h4>Informações do Projeto:</h4>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="4"
                          xs="4"
                        >
                          <v-autocomplete
                            v-if="tipoRdo !== 'editar'"
                            v-model="nomeCliente"
                            :items="clientes"
                            label="Cliente"
                            clearable
                            solo

                            @change="getFiltroProjeto(nomeCliente)"
                          ></v-autocomplete>
                          <v-text-field
                            v-if="tipoRdo === 'editar'"
                            v-model="nomeCliente"
                            label="Cliente"
                            solo
                            disabled
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="4"
                          xs="4"
                        >
                          <v-autocomplete
                          v-if="tipoRdo !== 'editar'"
                            v-model="nomeProjetos"
                            :items="arrayProjetos"
                            label="Projetos"
                            clearable
                            solo

                            :disabled="nomeCliente ? false : true"
                          ></v-autocomplete>
                          <v-text-field
                            v-if="tipoRdo === 'editar'"
                            v-model="nomeProjetos"
                            label="Projetos"
                            solo
                            disabled
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="4"
                          xs="4"
                        >
                          <v-text-field
                            v-model="areaAtuacao"
                            label="Area de Atuação"
                            solo

                          >
                          </v-text-field>
                        </v-col>
                      </v-row >

                      <v-row class="px-5">
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="4"
                          xs="4"
                        >
                          <v-text-field
                            v-model="cartaChamada"
                            label="Carta Chamada"
                            solo

                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="4"
                          xs="4"
                        >
                          <v-autocomplete
                            v-model="nomeFiscal"
                            :items="arrayFiscal"
                            label="Fiscal"
                            clearable
                            solo

                          ></v-autocomplete>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="4"
                          xs="4"
                        >
                          <v-autocomplete
                            v-model="nomeEncarregado"
                            :items="arrayColaboradores"
                            label="Encarregado"
                            clearable
                            solo

                          ></v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-divider class="mx-5"></v-divider>
                      <v-row class="px-5 d-flex justify-center pt-5">
                        <v-col
                          cols="12"
                          sm="12"
                          md="12"
                          lg="12"
                          xs="12"
                          class="pb-0"
                        >
                        <h4>Informações do Projeto:</h4>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="2"
                          xs="2"
                        >
                          <span>Prazo Da Atividade</span>
                          <v-text-field
                            v-model="prazoAtividade"
                            label="Prazo Da Atividade"
                            solo
                            class="pt-2"
                          >
                          </v-text-field>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="2"
                          xs="2"
                        >
                          <span>Dias Decorridos</span>
                          <v-text-field
                            v-model="diasDecorridos"
                            label="Dias Decorridos"
                            solo
                            class="pt-2"
                          >
                          </v-text-field>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="2"
                          xs="2"
                        >
                          <span>Prorrogação</span>
                          <v-text-field
                            v-model="prorrogacao"
                            label="Prorrogação"
                            solo
                            class="pt-2"
                          >
                          </v-text-field>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="2"
                          xs="2"
                        >
                          <span>Dias Restantes</span>
                          <v-text-field
                            v-model="diasRestantes"
                            label="Dias Restantes"
                            solo
                            class="pt-2"
                          >
                          </v-text-field>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="2"
                          xs="2"
                        >
                          <span>Dias De Atrazo</span>
                          <v-text-field
                            v-model="diasDeAtrazos"
                            label="Dias De Atrazo"
                            solo
                            class="pt-2"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-divider class="mx-5"></v-divider>
                      <v-row class="px-5 d-flex justify-center pt-5">
                        <v-col
                          cols="12"
                          sm="12"
                          md="12"
                          lg="12"
                          xs="12"
                          class="pb-0"
                        >
                        <h4>Condição do Tempo:</h4>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                          md="3"
                          lg="2"
                          xs="2"
                          style="text-align:center"
                        >
                        <h4>Manhã</h4>
                        <v-select
                          v-model="condicaoManha"
                          label="Condição"
                          :items="condicao"

                          solo
                          clearable
                          class="pt-2"
                        >
                        </v-select>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="3"
                          md="3"
                          lg="2"
                          xs="2"
                          style="text-align:center"
                        >
                        <h4>Tarde</h4>
                        <v-select
                          v-model="condicaoTarde"
                          label="Condição"
                          :items="condicao"

                          solo
                          clearable
                          class="pt-2"
                        >
                        </v-select>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="3"
                          md="3"
                          lg="2"
                          xs="2"
                          style="text-align:center"
                        >
                        <h4>Noite</h4>
                        <v-select
                          v-model="condicaoNoite"
                          label="Condição"
                          :items="condicao"

                          solo
                          clearable
                          class="pt-2"
                        >
                        </v-select>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row class="px-5 py-2">
                  <v-col
                    cols="12"
                    md="12"
                    lg="12"
                    sm="12"
                    xs="12"
                  >
                    <v-card class="color-card">
                      <v-row>
                        <v-col
                          cols="12"
                          md="12"
                          lg="12"
                          sm="12"
                          xs="12"
                          class="text-center"
                        >
                          <h4>EFETIVOS</h4>
                        </v-col>
                      </v-row>
                      <v-row class="px-5">
                        <v-col
                          cols="12"
                          md="12"
                          lg="12"
                          sm="12"
                          xs="12"
                          class="text-center"
                        >
                        <v-data-table
                          :headers="headers"
                          :items="desserts"
                          sort-by="horaNormalInicio"
                          class="elevation-1"
                        >
                          <template v-slot:top>
                            <v-toolbar
                              flat
                            >
                              <v-toolbar-title>Mão de obra direta</v-toolbar-title>
                              <v-divider
                                class="mx-4"
                                inset
                                vertical
                              ></v-divider>
                              <v-spacer></v-spacer>
                              <v-dialog
                                v-model="dialog"
                                max-width="500px"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    color="primary"
                                    dark
                                    class="mb-2"
                                    v-bind="attrs"
                                    v-on="on"
                                  >
                                    Adicionar Efetivo
                                  </v-btn>
                                </template>
                                <v-card>
                                  <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                  </v-card-title>

                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col
                                          cols="12"
                                          sm="12"
                                          md="12"
                                        >
                                          <v-autocomplete
                                            v-model="editedItem.name"
                                            :items="arrayColaboradores"
                                            label="Encarregado"
                                            @change="ajusteNome()"
                                            clearable
                                          ></v-autocomplete>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="12"
                                          md="12"
                                        >
                                        <h4>Hora Normal</h4>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaNormalInicio"
                                            label="Início"
                                            @change="horaNormal()"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaNormalTermino"
                                            label="Término"
                                            @change="horaNormal()"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaNormalTotal"
                                            label="Total"
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="12"
                                          md="12"
                                        >
                                          <h4>Hora Extra Seg A Sáb</h4>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaNormalExtraInicio"
                                            label="Início"
                                            @change="horaNormalExtra()"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaNormalExtraTermino"
                                            label="Termino"
                                            @change="horaNormalExtra()"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaNormalExtraTotal"
                                            label="Total"
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="12"
                                          md="12"
                                        >
                                          <h4>Hora Normal Noturna</h4>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaNormalNoturnaInicio"
                                            label="Início"
                                            @change="horaNormalNoturna()"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaNormalNoturnaTermino"
                                            label="Termino"
                                            @change="horaNormalNoturna()"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaNormalNoturnaTotal"
                                            label="Total"
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="12"
                                          md="12"
                                        >
                                          <h4>Hora Extra Noturna</h4>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaExtraNoturnaInicio"
                                            label="Início"
                                            @change="horaExtraNoturna()"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaExtraNoturnaTermino"
                                            label="Termino"
                                            @change="horaExtraNoturna()"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaExtraNoturnaTotal"
                                            label="Total"
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="12"
                                          md="12"
                                        >
                                          <h4>Hora Extra Dom e Feriado</h4>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaExtraFdsInicio"
                                            label="Início"
                                            @change="horaExtraFds()"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaExtraFdsTermino"
                                            label="Termino"
                                            @change="horaExtraFds()"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItem.horaExtraFdsTotal"
                                            label="Total"
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>

                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      color="blue darken-1"
                                      text
                                      @click="close"
                                    >
                                      Cancel
                                    </v-btn>
                                    <v-btn
                                      color="green darken-1"
                                      text
                                      @click="save"
                                    >
                                      Salvar
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                              <v-dialog v-model="dialogDelete" max-width="500px">
                                <v-card>
                                  <v-card-title class="headline">Tem certeza que vai excluir?</v-card-title>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                    <v-spacer></v-spacer>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </v-toolbar>
                          </template>
                          <template v-slot:[`item.actions`]="{ item }">
                            <v-icon
                              small
                              class="mr-2"
                              @click="editItem(item)"
                            >
                              mdi-pencil
                            </v-icon>
                            <v-icon
                              small
                              @click="deleteItem(item)"
                            >
                              mdi-delete
                            </v-icon>
                          </template>
                        </v-data-table>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row class="px-5 py-2">
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    lg="12"
                    xs="12"
                  >
                  <v-card class="color-card px-5">
                      <v-row>
                        <v-col
                          cols="12"
                          md="12"
                          lg="12"
                          sm="12"
                          xs="12"
                        >
                          <h4>Observações</h4>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="8"
                          md="8"
                          lg="8"
                          xs="8"
                          class="py-0"
                        >
                          <v-text-field
                            label="Houve DDS neste dia?"
                            solo
                            disabled
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="4"
                          xs="4"
                          class="py-0"
                        >
                          <v-select
                          v-model="opcoesDDS"
                          label="Sim / Não"
                          :items="opcoes"
                          solo
                          clearable
                        >
                        </v-select>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="8"
                          md="8"
                          lg="8"
                          xs="8"
                          class="py-0"
                        >
                          <v-text-field
                            label="Houve algum prejuízo material ou de equipamento neste dia?"
                            solo
                            disabled
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="4"
                          xs="4"
                          class="py-0"
                        >
                          <v-select
                          v-model="opcoesPrejuizo"
                          label="Sim / Não"
                          :items="opcoes"
                          solo
                          clearable
                        >
                        </v-select>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="8"
                          md="8"
                          lg="8"
                          xs="8"
                          class="py-0"
                        >
                          <v-text-field
                            label="Houve violações de segurança neste dia?"
                            solo
                            disabled
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="4"
                          xs="4"
                          class="py-0"
                        >
                          <v-select
                          v-model="opcoesViolacao"
                          label="Sim / Não"
                          :items="opcoes"
                          solo
                          clearable
                        >
                        </v-select>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="8"
                          md="8"
                          lg="8"
                          xs="8"
                          class="py-0"
                        >
                          <v-text-field
                            label="Houve ociosidade ocorrida por acidentes neste dia?"
                            solo
                            disabled
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="4"
                          xs="4"
                          class="py-0"
                        >
                          <v-select
                          v-model="opcoesOciosidade"
                          label="Sim / Não"
                          :items="opcoes"
                          solo
                          clearable
                        >
                        </v-select>
                        </v-col>
                      </v-row>
                  </v-card>
                  </v-col>
                </v-row>

                <v-row class="px-5 py-2">
                  <v-col
                    cols="12"
                    md="12"
                    lg="12"
                    sm="12"
                    xs="12"
                  >
                    <v-card class="color-card">
                      <v-row class="px-5">
                        <v-col
                          cols="12"
                          md="12"
                          lg="12"
                          sm="12"
                          xs="12"
                          class="text-center"
                        >
                          <h4>ATIVIDADES EM EXECUÇÃO</h4>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="4"
                          xs="4"
                        >
                          <span class="pl-2">Serviço: </span>
                          <v-text-field
                            v-model="servico"
                            label="Serviço"
                            class="pt-2"
                            solo
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="2"
                          xs="2"
                        >
                        <span class="pl-2">Início Previsto: </span>
                        <v-menu
                          ref="menu"
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="inicioPrevisto"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              solo
                              v-model="inicioPrevisto"
                              class="pt-2"
                              label="0"
                              prepend-inner-icon="mdi-clock-time-four-outline"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menu2"
                            format="24hr"
                            v-model="inicioPrevisto"
                            full-width
                            @click:minute="$refs.menu.save(inicioPrevisto)"
                          ></v-time-picker>
                        </v-menu>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="2"
                          xs="2"
                        >
                        <span class="pl-2">Termino Previsto: </span>
                        <v-menu
                          ref="menu3"
                          v-model="menu4"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="terminoPrevisto"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              solo
                              v-model="terminoPrevisto"
                              label="0"
                              class="pt-2"
                              prepend-inner-icon="mdi-clock-time-four-outline"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menu4"
                            format="24hr"
                            v-model="terminoPrevisto"
                            full-width
                            @click:minute="$refs.menu3.save(terminoPrevisto)"
                          ></v-time-picker>
                        </v-menu>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="2"
                          xs="2"
                        >
                        <span class="pl-2">Início Real: </span>
                        <v-menu
                          ref="menu5"
                          v-model="menu6"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="inicioReal"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              solo
                              v-model="inicioReal"
                              label="0"
                              class="pt-2"
                              prepend-inner-icon="mdi-clock-time-four-outline"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menu6"
                            format="24hr"
                            v-model="inicioReal"
                            full-width
                            @click:minute="$refs.menu5.save(inicioReal)"
                          ></v-time-picker>
                        </v-menu>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          lg="2"
                          xs="2"
                        >
                        <span class="pl-2">Termino Real: </span>
                        <v-menu
                          ref="menu7"
                          v-model="menu8"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="terminoReal"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              solo
                              v-model="terminoReal"
                              label="0"
                              class="pt-2"
                              prepend-inner-icon="mdi-clock-time-four-outline"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menu8"
                            format="24hr"
                            v-model="terminoReal"
                            full-width
                            @click:minute="$refs.menu7.save(terminoReal)"
                          ></v-time-picker>
                        </v-menu>
                        </v-col>
                      </v-row>

                      <v-row class="px-5">
                        <v-col
                          cols="12"
                          sm="12"
                          md="12"
                          lg="12"
                          xs="12"
                          class="text-center"
                        >
                        <v-data-table
                          :headers="headersAtividade"
                          :items="dessertsAtividade"
                          sort-by="horaNormalInicio"
                          class="elevation-1"
                        >
                          <template v-slot:top>
                            <v-toolbar
                              flat
                            >
                              <v-toolbar-title>Mão de obra direta</v-toolbar-title>
                              <v-divider
                                class="mx-4"
                                inset
                                vertical
                              ></v-divider>
                              <v-spacer></v-spacer>
                              <v-dialog
                                v-model="dialogAtividade"
                                max-width="700px"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn
                                    color="primary"
                                    dark
                                    class="mb-2"
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="changeId()"
                                  >
                                    Adicionar Atividade
                                  </v-btn>
                                </template>
                                <v-card>
                                  <v-card-title>
                                    <span class="headline">{{ formTitleAtividade }}</span>
                                  </v-card-title>

                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col
                                          cols="12"
                                          sm="10"
                                          md="10"
                                        >
                                          <v-text-field
                                            v-model="editedItemAtividade.descricao"
                                            label="DESCRIÇÃO DO SERVIÇO"
                                            clearable
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="2"
                                          md="2"
                                        >
                                          <v-text-field
                                            v-model="editedItemAtividade.id "
                                            label="Id"
                                            readonly
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="4"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItemAtividade.quantCont"
                                            label="QUANT. CONT."
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="4"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItemAtividade.realAcum"
                                            label="REAL ACUM."
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="4"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItemAtividade.quantReal"
                                            label="QUANT. REAL"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItemAtividade.saldoCont"
                                            label="SALDO QUANT."
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItemAtividade.unidade"
                                            label="Unidade"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col
                                          cols="12"
                                          sm="6"
                                          md="4"
                                        >
                                          <v-text-field
                                            v-model="editedItemAtividade.referencia"
                                            label="Referência"
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>

                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      color="blue darken-1"
                                      text
                                      @click="closeAtividade"
                                    >
                                      Cancel
                                    </v-btn>
                                    <v-btn
                                      color="green darken-1"
                                      text
                                      @click="saveAtividade"
                                    >
                                      Salvar
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                              <v-dialog v-model="dialogDeleteAtividade" max-width="500px">
                                <v-card>
                                  <v-card-title class="headline">Tem certeza que vai excluir?</v-card-title>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDeleteAtividade">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteItemConfirmAtividade">OK</v-btn>
                                    <v-spacer></v-spacer>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </v-toolbar>
                          </template>
                          <template v-slot:[`item.actions`]="{ item }">
                            <v-icon
                              small
                              class="mr-2"
                              @click="editItemAtividade(item)"
                            >
                              mdi-pencil
                            </v-icon>
                            <v-icon
                              small
                              @click="deleteItemAtividade(item)"
                            >
                              mdi-delete
                            </v-icon>
                          </template>
                        </v-data-table>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row class="px-5 py-2">
                  <v-col
                    cols="12"
                    md="12"
                    lg="12"
                    sm="12"
                    xs="12"
                  >
                    <v-card class="color-card">
                      <v-row class="px-5">
                        <v-col
                          cols="12"
                          md="12"
                          lg="12"
                          sm="12"
                          xs="12"
                          class="text-center"
                        >
                        <h4>COMENTÁRIOS  CONTRATADA</h4>
                        </v-col>
                        <v-col
                          cols="12"
                          md="12"
                          lg="12"
                          sm="12"
                          xs="12"
                          class="text-center"
                        >
                          <v-textarea
                            solo
                            v-model="comentarios"
                            label="Comentários"
                            auto-grow
                            clearable
                            rows="4"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row class="px-5">
                  <v-col
                    cols="12"
                    md="12"
                    lg="12"
                    sm="12"
                    xs="12"
                    class="mt-7 text-right"
                  >
                  <v-btn @click="salvarRDO()" color="green" class="mr-3 white--text">Salvar</v-btn>
                  <v-btn @click="returnRDO()" color="primary">Voltar</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

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
  props: ['tipoRdo', 'rdoEdit'],
  mounted () {
    if (this.tipoRdo === 'editar') {
      this.dateFormatted = this.rdoEdit.dataIncioConfig

      this.nomeCliente = this.rdoEdit.rdo.cliente
      this.nomeProjetos = this.rdoEdit.rdo.projeto
      this.dataIDRDO = this.rdoEdit.rdo.id_rdo
      this.areaAtuacao = this.rdoEdit.rdo.areaAtuacao
      this.cartaChamada = this.rdoEdit.rdo.cartaChamada
      this.nomeFiscal = this.rdoEdit.rdo.nomeFiscal
      this.nomeEncarregado = this.rdoEdit.rdo.nomeEncarregado
      this.condicaoManha = this.rdoEdit.rdo.condicaoManha
      this.condicaoTarde = this.rdoEdit.rdo.condicaoTarde
      this.condicaoNoite = this.rdoEdit.rdo.condicaoNoite
      this.prazoAtividade = this.rdoEdit.rdo.prazoAtividade
      this.diasDecorridos = this.rdoEdit.rdo.diasDecorridos
      this.prorrogacao = this.rdoEdit.rdo.prorrogacao
      this.diasRestantes = this.rdoEdit.rdo.diasRestantes
      this.diasDeAtrazos = this.rdoEdit.rdo.diasDeAtrazos
      this.opcoesDDS = this.rdoEdit.rdo.opcoesDDS
      this.opcoesPrejuizo = this.rdoEdit.rdo.opcoesPrejuizo
      this.opcoesViolacao = this.rdoEdit.rdo.opcoesViolacao
      this.opcoesOciosidade = this.rdoEdit.rdo.opcoesOciosidade
      this.servico = this.rdoEdit.rdo.servico
      this.inicioReal = this.rdoEdit.rdo.inicioReal
      this.terminoReal = this.rdoEdit.rdo.terminoReal
      this.inicioPrevisto = this.rdoEdit.rdo.inicioPrevisto
      this.terminoPrevisto = this.rdoEdit.rdo.terminoPrevisto
      this.comentarios = this.rdoEdit.rdo.comentarios

      console.log(this.rdoEdit)
    }
  },
  data: vm => ({
    urlProd: 'https://htgneexsa.cf/api_htg/',
    // urlProd: 'http://localhost:4040/api_htg/',
    clientes: [],
    projetos: [],
    projetosCliente: [],
    arrayProjetos: [],
    date: new Date().toISOString().substr(0, 10),
    colaboradores: [],
    arrayFiscal: [],
    arrayColaboradores: [],
    menu: false,
    mensagem: '',
    snackbar: false,
    colorSnackbar: '',
    diaSemana: '',
    condicao: ['Bom', 'Chuva', 'Ruim'],
    opcoes: ['Sim', 'Não'],

    menu2: false,
    menu4: false,
    menu6: false,
    menu8: false,

    dialog: false,
    dialogDelete: false,
    dialogAtividade: false,
    dialogDeleteAtividade: false,
    headers: [
      {
        text: 'Id',
        align: 'start',
        sortable: false,
        value: 'idEfetivo'
      },
      { text: 'Nome', value: 'nomeEfetivo', align: 'center', sortable: true },
      { text: 'Funcao', value: 'funcaoEfetivo', align: 'center', sortable: true },
      { text: 'Horario Normal', value: 'horaNormalTotal', align: 'center', sortable: true },
      { text: 'Hora Extra Sag/Sáb', value: 'horaNormalExtraTotal', align: 'center', sortable: true },
      { text: 'Horario Normal Noturna', value: 'horaNormalNoturnaTotal', align: 'center', sortable: true },
      { text: 'Horario Extra Noturna', value: 'horaExtraNoturnaTotal', align: 'center', sortable: true },
      { text: 'Horario Extra Dom/Feri', value: 'horaExtraFdsTotal', align: 'center', sortable: true },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    headersAtividade: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'id'
      },
      { text: 'Descrição do Serviso', value: 'descricao', align: 'center', sortable: true },
      { text: 'QUANT. CONT.', value: 'quantCont', align: 'center', sortable: true },
      { text: 'REAL ACUM.', value: 'realAcum', align: 'center', sortable: true },
      { text: 'QUANT. REAL', value: 'quantReal', align: 'center', sortable: true },
      { text: 'SALDO CONT.', value: 'saldoCont', align: 'center', sortable: true },
      { text: 'UNIDADE', value: 'unidade', align: 'center', sortable: true },
      { text: 'REFERÊNCIA', value: 'referencia', align: 'center', sortable: true },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    desserts: [],
    dessertsAtividade: [],
    editedIndex: -1,
    editedIndexAtividade: -1,
    editedItem: {
      name: '',
      idEfetivo: '',
      nomeEfetivo: '',
      funcaoEfetivo: '',
      horaNormalInicio: 0,
      horaNormalTermino: 0,
      horaNormalTotal: 0,
      horaNormalExtraInicio: 0,
      horaNormalExtraTermino: 0,
      horaNormalExtraTotal: 0,
      horaNormalNoturnaInicio: 0,
      horaNormalNoturnaTermino: 0,
      horaNormalNoturnaTotal: 0,
      horaExtraNoturnaInicio: 0,
      horaExtraNoturnaTermino: 0,
      horaExtraNoturnaTotal: 0,
      horaExtraFdsInicio: 0,
      horaExtraFdsTermino: 0,
      horaExtraFdsTotal: 0
    },
    editedItemAtividade: {
      descricao: '',
      id: 0,
      quantCont: 0,
      realAcum: 0,
      quantReal: 0,
      saldoCont: 0,
      unidade: '',
      referencia: ''
    },
    defaultItem: {
      name: '',
      idEfetivo: '',
      nomeEfetivo: '',
      funcaoEfetivo: '',
      horaNormalInicio: 0,
      horaNormalTermino: 0,
      horaNormalTotal: 0,
      horaNormalExtraInicio: 0,
      horaNormalExtraTermino: 0,
      horaNormalExtraTotal: 0,
      horaNormalNoturnaInicio: 0,
      horaNormalNoturnaTermino: 0,
      horaNormalNoturnaTotal: 0,
      horaExtraNoturnaInicio: 0,
      horaExtraNoturnaTermino: 0,
      horaExtraNoturnaTotal: 0,
      horaExtraFdsInicio: 0,
      horaExtraFdsTermino: 0,
      horaExtraFdsTotal: 0
    },

    defaultItemAtividade: {
      descricao: '',
      id: 0,
      quantCont: 0,
      realAcum: 0,
      quantReal: 0,
      saldoCont: 0,
      unidade: '',
      referencia: ''
    },

    nomeCliente: '',
    nomeProjetos: '',
    dataIDRDO: moment(new Date()).valueOf(),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dataRdoInicio: moment(new Date()).format('L'),
    areaAtuacao: '',
    cartaChamada: '',
    nomeFiscal: '',
    nomeEncarregado: '',
    condicaoManha: '',
    condicaoTarde: '',
    condicaoNoite: '',
    prazoAtividade: 0,
    diasDecorridos: 0,
    prorrogacao: 0,
    diasRestantes: 0,
    diasDeAtrazos: 0,
    opcoesDDS: '',
    opcoesPrejuizo: '',
    opcoesViolacao: '',
    opcoesOciosidade: '',
    servico: '',
    inicioReal: 0,
    terminoReal: 0,
    inicioPrevisto: 0,
    terminoPrevisto: 0,
    comentarios: ''
  }),
  async created () {
    await this.getClientes()
    await this.getProjetos()
    await this.getColaboradores()
    await this.diaDaSemana()
    await this.initialize()
    await this.initializeAtividade()
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    },

    formTitle () {
      return this.editedIndex === -1 ? 'Adicionar Colaborador' : 'Editar Colaborador'
    },

    formTitleAtividade () {
      return this.editedIndexAtividade === -1 ? 'Adicionar Atividade' : 'Editar Atividade'
    }
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    },
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },

    dialogAtividade (valAtividade) {
      valAtividade || this.closeAtividade()
    },
    dialogDeleteAtividade (valAtividade) {
      valAtividade || this.closeDeleteAtividade()
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
    async getClientes () {
      const result = await axios({
        method: 'GET',
        url: `${this.urlProd}dominio/clientes-ativos`
      })
      this.clientes = result.data
    },
    async getProjetos () {
      const result = await axios({
        method: 'GET',
        url: `${this.urlProd}dominio/projetosClientes`
      })
      this.projetos = result.data
    },

    async getColaboradores () {
      const result = await axios({
        method: 'GET',
        url: `${this.urlProd}dominio/colaboradores`
      })
      this.colaboradores = result.data

      // Fiscal
      const fiscal = this.colaboradores.filter(item => { return item.funcao === 'Fiscal' })
      this.arrayFiscal = fiscal.map(x => {
        return x.reg + ' - ' + x.nome
      })

      this.arrayColaboradores = this.colaboradores.map(y => {
        return y.reg + ' - ' + y.nome + ' - ' + y.funcao
      })

      console.log(this.arrayColaboradores)
    },

    diaDaSemana () {
      const semana = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado']
      const d = new Date()
      this.diaSemana = semana[d.getDay()]
      console.log(this.diaSemana)
    },

    getFiltroProjeto (nome) {
      console.log(this.projetos)
      this.projetosCliente = this.projetos.filter(item => {
        return item.cliente.nome === nome && item.projeto.ativo === true && item.projeto.pausado === false
      })

      this.arrayProjetos = this.projetosCliente.map(x => { return x.projeto.nome })
    },

    async salvarRDO () {
      if (this.nomeCliente && this.nomeProjetos) {
        console.log(new Date(this.dataRdoInicio).valueOf())
        const params = {
          nomeCliente: this.nomeCliente ? this.nomeCliente : '',
          nomeProjetos: this.nomeProjetos ? this.nomeProjetos : '',
          dataRdo: this.dataRdoInicio ? this.dataRdoInicio : null,
          diaSemana: this.diaSemana ? this.diaSemana : '',
          dateFormatted: this.dataRdoInicio ? moment(this.dataRdoInicio).valueOf() : moment(new Date()).valueOf(),
          dataIDRDO: this.dataIDRDO ? this.dataIDRDO : moment(new Date()).valueOf(),
          areaAtuacao: this.areaAtuacao,
          cartaChamada: this.cartaChamada,
          nomeFiscal: this.nomeFiscal,
          nomeEncarregado: this.nomeEncarregado,
          condicaoManha: this.condicaoManha,
          condicaoTarde: this.condicaoTarde,
          condicaoNoite: this.condicaoNoite,
          prazoAtividade: parseInt(this.prazoAtividade),
          diasDecorridos: parseInt(this.diasDecorridos),
          prorrogacao: parseInt(this.prorrogacao),
          diasRestantes: parseInt(this.diasRestantes),
          diasDeAtrazos: parseInt(this.diasDeAtrazos),
          opcoesDDS: this.opcoesDDS,
          opcoesPrejuizo: this.opcoesPrejuizo,
          opcoesViolacao: this.opcoesViolacao,
          opcoesOciosidade: this.opcoesOciosidade,
          servico: this.servico,
          inicioReal: this.inicioReal,
          terminoReal: this.terminoReal,
          inicioPrevisto: this.inicioPrevisto,
          terminoPrevisto: this.terminoPrevisto,
          comentarios: this.comentarios,
          efetivos: this.desserts,
          atividades: this.dessertsAtividade
        }
        if (this.tipoRdo === 'editar') {
          console.log(this.tipoRdo, params)
          try {
            const result = await axios({
              method: 'POST',
              url: `${this.urlProd}editar-rdo`,
              data: params
            })
            this.snackbar = true
            this.mensagem = result.data.mensagem
            this.colorSnackbar = 'green'
            this.returnRDO()
          } catch (err) {
            console.log(err)
            this.snackbar = true
            this.mensagem = 'Erro ao salvar!!!'
            this.colorSnackbar = 'red'
          }
        } else {
          try {
            const result = await axios({
              method: 'POST',
              url: `${this.urlProd}novo-rdo`,
              data: params
            })
            this.snackbar = true
            this.mensagem = result.data.mensagem
            this.colorSnackbar = 'green'
            this.returnRDO()
          } catch (err) {
            console.log(err)
            this.snackbar = true
            this.mensagem = 'Erro ao salvar!!!'
            this.colorSnackbar = 'red'
          }
        }
      } else {
        this.snackbar = true
        this.mensagem = 'Preencha os Campo Obrigatórios!!!'
        this.colorSnackbar = 'red'
      }
    },

    returnRDO () {
      this.$emit('voltar')
    },

    initialize () {
      if (this.tipoRdo === 'editar') {
        const qtdEfeti = this.rdoEdit.efetivos.length
        for (let y = 0; y < qtdEfeti; y++) {
          this.desserts.push(this.rdoEdit.efetivos[y])
        }
      } else {
        this.desserts = []
      }
    },

    initializeAtividade () {
      if (this.tipoRdo === 'editar') {
        const qtdAtiv = this.rdoEdit.atividade.length
        for (let x = 0; x < qtdAtiv; x++) {
          this.rdoEdit.atividade[x].id = x + 1
          this.dessertsAtividade.push(this.rdoEdit.atividade[x])
        }
      } else {
        this.dessertsAtividade = []
      }
    },

    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    editItemAtividade (item) {
      this.editedIndexAtividade = this.dessertsAtividade.indexOf(item)
      this.editedItemAtividade = Object.assign({}, item)
      this.dialogAtividade = true
    },

    deleteItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemAtividade (item) {
      this.editedIndexAtividade = this.dessertsAtividade.indexOf(item)
      this.editedItemAtividade = Object.assign({}, item)
      this.dialogDeleteAtividade = true
    },

    deleteItemConfirm () {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    deleteItemConfirmAtividade () {
      this.dessertsAtividade.splice(this.editedIndexAtividade, 1)
      this.closeDeleteAtividade()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeAtividade () {
      console.log('Fechar')
      this.dialogDeleteAtividade = false
      this.$nextTick(() => {
        this.editedItemAtividade = Object.assign({}, this.defaultItemAtividade)
        this.editedIndexAtividade = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDeleteAtividade () {
      console.log('Close Delete')
      this.dialogDeleteAtividade = false
      this.$nextTick(() => {
        this.editedItemAtividade = Object.assign({}, this.defaultItemAtividade)
        this.editedIndexAtividade = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },

    saveAtividade () {
      if (this.editedIndexAtividade > -1) {
        Object.assign(this.dessertsAtividade[this.editedIndexAtividade], this.editedItemAtividade)
      } else {
        this.dessertsAtividade.push(this.editedItemAtividade)
      }
      this.closeAtividade()
    },

    ajusteNome () {
      const ajuste = this.editedItem.name.split('-')
      this.editedItem.idEfetivo = ajuste[0] * 1
      this.editedItem.nomeEfetivo = ajuste[1]
      this.editedItem.funcaoEfetivo = ajuste[2]
    },

    horaNormal () {
      this.editedItem.horaNormalInicio = this.editedItem.horaNormalInicio * 1
      this.editedItem.horaNormalTermino = this.editedItem.horaNormalTermino * 1
      this.editedItem.horaNormalTotal = this.editedItem.horaNormalTermino - this.editedItem.horaNormalInicio
    },

    horaNormalExtra () {
      this.editedItem.horaNormalExtraTermino = this.editedItem.horaNormalExtraTermino * 1
      this.editedItem.horaNormalExtraInicio = this.editedItem.horaNormalExtraInicio * 1
      this.editedItem.horaNormalExtraTotal = this.editedItem.horaNormalExtraTermino - this.editedItem.horaNormalExtraInicio
    },

    horaNormalNoturna () {
      this.editedItem.horaNormalNoturnaInicio = this.editedItem.horaNormalNoturnaInicio * 1
      this.editedItem.horaNormalNoturnaTermino = this.editedItem.horaNormalNoturnaTermino * 1
      this.editedItem.horaNormalNoturnaTotal = this.editedItem.horaNormalNoturnaTermino - this.editedItem.horaNormalNoturnaInicio
    },

    horaExtraNoturna () {
      this.editedItem.horaExtraNoturnaInicio = this.editedItem.horaExtraNoturnaInicio * 1
      this.editedItem.horaExtraNoturnaTermino = this.editedItem.horaExtraNoturnaTermino * 1
      this.editedItem.horaExtraNoturnaTotal = this.editedItem.horaExtraNoturnaTermino - this.editedItem.horaExtraNoturnaInicio
    },

    horaExtraFds () {
      this.editedItem.horaExtraFdsInicio = this.editedItem.horaExtraFdsInicio * 1
      this.editedItem.horaExtraFdsTermino = this.editedItem.horaExtraFdsTermino * 1
      this.editedItem.horaExtraFdsTotal = this.editedItem.horaExtraFdsTermino - this.editedItem.horaExtraFdsInicio
    },

    changeId () {
      this.editedItemAtividade.id = this.dessertsAtividade.length + 1
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

  .card-home{
    margin-top: -30px;
    z-index: 0;
  }

  .color-card {
    background-color: var(--light-gray)!important;
  }
</style>
