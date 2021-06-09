export default [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "login" */ './Home')

  }
]
