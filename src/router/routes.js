import { routes as auth } from '../modules/auth'
import { routes as home } from '../pages/home'
import { routes as cadastro } from '../pages/cadastro'
import { routes as rdo } from '../pages/rdo'
import { routes as clientes } from '../pages/clientes'

export default [
  ...auth,
  ...home,
  ...cadastro,
  ...rdo,
  ...clientes
]
