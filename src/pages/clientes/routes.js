export default [
  {
    path: '/clientes',
    name: 'Clientes',
    component: () => import(/* webpackChunkName: "clientes" */ './Clientes')

  }
]
