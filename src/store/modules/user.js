import {  logout, getUserInfo, saveProfile } from '@/api/user'
import router, { resetRouter } from '@/router'
import {removeToken} from "@/utils/auth"

const state = {
  userinfo: null,
}

const mutations = {
  SET_USERINFO: (state, data) => {
    state.userinfo = data
  }
}

const actions = {

  // get user info
  getUserInfo({ commit }) {
    return new Promise((resolve, reject)=>{
      getUserInfo().then(response => {
        const { data } = response
        commit('SET_USERINFO', data)
        resolve(data)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken()
        resetRouter()
        commit('SET_USERINFO', null)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // save
  save({commit}, data){
    return new Promise((resolve, reject)=>{
      saveProfile(data).then(res=>{
        commit('SET_USERINFO', res.data)
        resolve(res.data)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
