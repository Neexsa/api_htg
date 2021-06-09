import services from '@/http'
import * as storage from '../storage'
import * as types from './mutation-types'

export const ActionDoLogin = ({ dispatch }, payload) => {
  return services.auth.login(payload).then(res => {
    dispatch('ActionSetUser', res.data.user)
    dispatch('ActionSetToken', res.data.token)
  })
}

export const ActionCheckToken = ({ dispatch, state }) => {
  if (state.token) {
    return Promise.resolve(state.token)
  }

  const token = storage.getLocalToken()

  if (!token) {
    return Promise.reject(new Error('Token Inválido'))
  }

  dispatch('ActionSetToken', token)
  return dispatch('ActionLoadSession')
}

export const ActionLoadSession = ({ dispatch }) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const { data: { user } } = await services.auth.loadSession()
      dispatch('ActionSetUser', user)
      resolve()
    } catch (err) {
      dispatch('ActionSigOut')
      reject(err)
    }
  })
}

export const ActionSetUser = ({ commit }, payload) => {
  commit(types.SET_USER, payload)
}

export const ActionSetToken = ({ commit }, payload) => {
  storage.setLocalToken(payload)
  storage.setHeaderToken(payload)
  commit(types.SET_TOKEN, payload)
}

export const ActionSigOut = ({ dispatch }) => {
  storage.setHeaderToken('')
  storage.deleteLocalToken()
  dispatch('ActionSetUser', {})
  dispatch('ActionSetToken', '')
}
