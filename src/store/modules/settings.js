import defaultSettings from '@/settings'
import { getSiteConfig } from '@/api/settings'
import Cookie from 'js-cookie'

const { showSettings, fixedHeader, sidebarLogo, tagsView } = defaultSettings

const theme = Cookie.get('theme') || 'default'
const colors = require(`@/styles/themes/${theme}/colors.scss`)

const state = {
  theme: theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  siteConfig: {},
  colorVariables: colors
}

const mutations = {
  SET_SITECONFIG: (state, value) => {
    state.siteConfig = value
  },
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  getSiteConfig({ commit }) {
    return getSiteConfig().then(response => {
      const data = response.data
      commit('SET_SITECONFIG', data)
    })
  },
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

