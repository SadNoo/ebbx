import Vue from 'vue'
import Vuex from 'vuex'
import store from 'store'
import API from '@/api'

Vue.use(Vuex)

const state = {
  user: null,
  isCommentsSided: false,
  isMobile: false,
  showEbuko: false,
  hideEbukoOverride: false,
  notifications: [],
  hpData: {},
  animeList: [],
  searchQuery: '',
  searchResultIds: [],
  directoryParams: null,
  playerConfig: {
    rate: 1,
    volume: 1,
    danmaku: false,
    ...(store.get('fl-player-config') || {}),
  },
}

let ebukoUnwell = false

//
//  Mutations
//
const mutations = {
  setIsCommentsSided(state, isCommentsSided) {
    state.isCommentsSided = isCommentsSided
  },
  setIsMobile(state, isMobile) {
    state.isMobile = isMobile
  },
  SET_SHOW_EBUKO(state, showEbuko) {
    state.showEbuko = showEbuko
  },
  SET_HIDE_EBUKO_OVERRIDE(state, hideEbukoOverride) {
    state.hideEbukoOverride = hideEbukoOverride
  },
  ENQUEUE_NOTIFICATION(state, notification) {
    state.notifications.push(notification)
  },
  DEQUEUE_NOTIFICATION(state, id) {
    state.notifications = state.notifications.filter((x) => x.id !== id)
  },
  SET_USER(state, user) {
    state.user = user
  },
  SET_HP_DATA(state, data) {
    state.hpData = data
  },
  SET_ANIME_LIST(state, list) {
    state.animeList = list
  },
  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query
  },
  SET_SEARCH_RESULT_IDS(state, ids) {
    state.searchResultIds = ids
  },
  UPDATE_DIRECTORY_PARAMS(state, params) {
    state.directoryParams = params
  },
  SET_PLAYER_CONFIG(state, config) {
    store.set('fl-player-config', config)
    state.playerConfig = config
  },
}

//
//  Actions
//
const actions = {
  setShowEbuko({ commit }, showEbuko) {
    commit('SET_SHOW_EBUKO', showEbuko && !ebukoUnwell)
  },
  setHideEbukoOverride({ commit }, hideEbukoOverride) {
    commit('SET_HIDE_EBUKO_OVERRIDE', hideEbukoOverride)
  },
  setEbukoUnwell(_, adblockEnabled) {
    ebukoUnwell = adblockEnabled
  },
  enqueueNotification({ commit, dispatch }, { type, text, duration }) {
    const id = `${(Math.random() * 1e8).toString(16)}`
    const payload = { id, type, text }
    commit('ENQUEUE_NOTIFICATION', payload)
    setTimeout(() => dispatch('dequeueNotification', id), duration)
  },
  dequeueNotification({ commit }, id) {
    commit('DEQUEUE_NOTIFICATION', id)
  },
  async fetchUser({ commit }) {
    const data = await API.fetchUser()
    commit('SET_USER', data)
  },
  async fetchHPData({ commit }) {
    const data = await API.fetchHPData()
    commit('SET_HP_DATA', data)
  },
  async fetchAnimeList({ commit }) {
    const animeList = await API.fetchAnimeList()
    commit('SET_ANIME_LIST', animeList)
  },
  async fetchSearchResults({ commit }, searchQuery) {
    const query = searchQuery.trim()
    commit('SET_SEARCH_QUERY', query)
    const ids = await API.fetchSearchResults(query)
    window.ga('send', 'event', 'Search', 'query', query)
    commit('SET_SEARCH_RESULT_IDS', ids)
  },
  async updateDirectoryParams({ commit, state }, params) {
    if (!params) {
      commit('UPDATE_DIRECTORY_PARAMS', null)
      return
    }
    let list
    switch (params.type) {
      case 'all': {
        list = state.animeList
        break
      }
      case 'tag':
      case 'studio': {
        const paramChanged = (state.directoryParams && state.directoryParams.param) !== params.param
        if (paramChanged) {
          list = await API.fetchAnimeList(params)
        } else {
          ({ list } = state.directoryParams)
        }
        break
      }
      default:
        break
    }
    commit('UPDATE_DIRECTORY_PARAMS', { ...params, list })
  },
  updatePlayerConfig({ commit }, { key, value }) {
    const config = {
      ...state.playerConfig,
      [key]: value,
    }
    commit('SET_PLAYER_CONFIG', config)
  },
}

const DIRECTORY_PER_PAGE = 3 * 7

//
//  Getters
//
const getters = {
  featuredSeasons(state) {
    if (!state.hpData.featured) {
      return null
    }
    return state.hpData.featured
  },
  informatizedAnimeList(state) {
    const nowAiring = []
    const newUpdated = []
    const now = new Date()

    state.animeList.forEach((anime) => {
      if (!anime.is_ended) {
        nowAiring.push(anime)
      }
      const checkNewUpdated = new Date(anime.last_updated)
      const diff = (now.getTime() - checkNewUpdated.getTime()) / 1000
      // 90 days
      if (diff < 60 * 60 * 24 * 30 * 3 && nowAiring.indexOf(anime) < 0) {
        newUpdated.push(anime)
      }
    })
    return {
      最新連載: nowAiring,
      近期更新: newUpdated,
    }
  },
  searchResultAnimeList(state) {
    if (!state.searchResultIds.length) {
      return []
    }
    return state.animeList.filter((anime) => state.searchResultIds.indexOf(anime.anime_id) >= 0)
  },
  animeDirectory(state) {
    if (!state.directoryParams) {
      return null
    }
    const { type, page, param, list } = state.directoryParams
    let title = ''
    const total = Math.ceil(list.length / DIRECTORY_PER_PAGE)
    const items = list.slice(DIRECTORY_PER_PAGE * (page - 1), DIRECTORY_PER_PAGE * page)
    if (type === 'tag') {
      title = `標籤：${param}`
    } else if (type === 'studio') {
      title = `動畫製作：${param}`
    } else {
      title = '動畫列表'
    }
    return { title, total, items }
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: true,
})
