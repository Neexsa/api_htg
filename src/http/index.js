import Vue from 'vue'
import VueResource from 'vue-resource'
import services from './services'
// import interceptors from './interceptors'

Vue.use(VueResource)

const http = Vue.http

http.options.root = 'https://htgneexsa.cf/api_cadastro/'
// http.options.root = 'http://localhost:3030/api_cadastro/'
// http.interceptors.push(interceptors)

Object.keys(services).map(service => {
  services[service] = Vue.resource('', {}, services[service])
})

const setBearerToken = token => {
  // eslint-disable-next-line dot-notation
  http.headers.common['Authorization'] = `Bearer ${token}`
}

export default services
export { http, setBearerToken }
