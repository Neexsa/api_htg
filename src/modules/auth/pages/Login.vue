<template>
    <v-container class="login">
    <div class="form-login">
     <v-card
        class="mx-auto card-login"
        max-width="344"
        outlined
      >
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline text-center">
              HTG
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-col
          class="px-3 py-0"
          cols="12"
          sm="12"
        >
          <v-text-field
            v-model="email"
            class="px-3 py-0"
            label="Username"
            :rules="[rules.required]"
            solo
          ></v-text-field>
        </v-col>

        <v-col
          class="px-3 py-0"
          cols="12"
          sm="12"
        >
          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            hint="At least 8 characters"
            @click:append="show1 = !show1"
            class="px-3 py-0"
            label="Password"
            solo
          ></v-text-field>
        </v-col>

        <v-card-actions class="px-5 pt-0 pb-4">
            <v-btn
              class="ma-auto"
              color="primary"
              rounded
              block
              @click="entrar()"
              :disabled = "loading"
            >
              <span v-if="loading">
                ENTRANDO...
                <v-icon class="fa fa-spinner fa-spin"></v-icon>
              </span>
              <span v-else>ENTRAR</span>
            </v-btn>
        </v-card-actions>

        <v-divider></v-divider>

        <!-- Criar nova rede social -->
        <!-- <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-center">
              Não tem uma conta?
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-actions class="px-5 pt-0 pb-4">
          <v-btn
              class="ma-auto"
              color="success"
              dark
              rounded
              @click="dialog = true"
          >
            Criar Conta
          </v-btn>
        </v-card-actions> -->
      </v-card>
    </div>
  </v-container>
</template>

<script>
// import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data: () => ({
    loading: false,
    dialog: false,
    show1: false,
    email: 'gabriel.ferreira9854@gmail.com',
    password: '12345678',
    rules: {
      required: value => !!value || 'Campo Obrigatório!!!',
      min: v => v.length >= 8 || 'Min 8 characters',
      emailMatch: () => ("The email and password you entered don't match")
    },
    date: null,
    menu: false,
    primeiroNome: '',
    ultimoNome: '',
    emailCriarConta: '',
    passwordNovo: '',
    telefone: '',
    cpf: ''
  }),
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },

  methods: {
    ...mapActions('auth', ['ActionDoLogin']),
    criarConta () {
      console.log(this.primeiroNome, this.ultimoNome, this.email, this.passwordNovo, this.telefone, this.cpf, this.date)
    },

    async entrar () {
      this.loading = true
      try {
        await this.ActionDoLogin({ email: this.email, senha: this.password })

        this.$router.push({ name: 'Home' })
      } catch (e) {
        alert(e.data ? e.data.message : 'Não foi possivél fazer o login!!!')
      }
      this.loading = false
    },

    save (dateFormatted) {
      this.$refs.menu.save(dateFormatted)
      console.log(dateFormatted)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (window.uid) {
        vm.$router.push({ name: 'Home' })
      }
    })
  }

}
</script>

<style lang="scss" scoped>
  .form-login {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  .card-login {
    width: 100%;
  }
  .text-center {
    text-align: center;
  }

  .login {
    z-index: 99999999999;
  }
</style>
