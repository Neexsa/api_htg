<template>
  <div class="cadastro">
      <v-container>
        <!-- <h1 class="pb-10">Cadastro</h1> -->
        <v-layout row wrap>
          <v-flex sm12 xs12 md12 lg12 class="mt-10">
            <app-card class="v-card--material mt-4">
              <v-card-title class="align-start">
                <v-sheet
                color="blue"
                width="100%"
                class="overflow-hidden mt-n9 transition-swing v-card--material__sheet"
                style="z-index: 2"
                elevation="6"
                max-width="100%"
                rounded
                >
                  <v-theme-provider dark>
                    <slot name="heading" />
                    <div class="text-h7 white--text pa-3 v-card--material__title"> NOVO CADASTRO </div>
                  </v-theme-provider>
                </v-sheet>
              </v-card-title>
              <v-card class="card-cadastro">
                <v-form>
                  <v-container class="py-0">
                    <v-row>
                      <v-col
                        cols="12"
                        md="4"
                        lg="4"
                        sm="4"
                        xs="4"
                      >
                        <v-text-field
                          class="mt-5"
                          label="NOME"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        md="4"
                        lg="4"
                        sm="4"
                        xs="4"
                      >
                        <v-text-field
                          class="mt-5"
                          label="CPF"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        md="4"
                        lg="4"
                        sm="4"
                        xs="4"
                      >
                        <v-text-field
                          class="mt-5"
                          label="RG"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card>
            </app-card>

          </v-flex>
        </v-layout>
      </v-container>
    </div>

</template>

<script>
export default {
  name: 'Cadastro',
  data: () => ({

  })

}
</script>

<style lang="scss" scoped>
.card-cadastro{
  margin-top: -30px;
  z-index: 0;
}
</style>
