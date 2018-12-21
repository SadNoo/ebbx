import axios from 'axios'
import LZString from 'lz-string'

export const API_ROOT = 'https://ebb.io/_'

FormData.prototype.appendRecursive = function appendRecursive(data, wrapper = null) {
  Object.keys(data).forEach((k) => {
    const key = wrapper ? `${wrapper}[${k}]` : k
    if (data[k] instanceof File) {
      this.append(key, data[k])
    } else if (data[k] instanceof Array || data[k] instanceof Object) {
      this.appendRecursive(data[k], key)
    } else {
      this.append(key, JSON.stringify(data[k]))
    }
  })
}

const cancelTokenMap = {}

const request = async (method, endpoint, data = null) => {
  let getData = null
  let postData = null

  const cancelKey = `${method} ${endpoint}`
  if (cancelTokenMap[cancelKey]) {
    cancelTokenMap[cancelKey].cancel('Operation cancelled by another request.')
  }
  cancelTokenMap[cancelKey] = axios.CancelToken.source()

  if (data !== null) {
    switch (method) {
      case 'get': {
        getData = data
        break
      }
      case 'delete':
      case 'patch':
      case 'post':
      case 'put': {
        postData = new FormData()
        postData.appendRecursive(data)
        break
      }
      default:
        break
    }
  }

  try {
    const { data } = await axios({
      method,
      url: API_ROOT + endpoint,
      params: getData,
      data: postData,
      withCredentials: true,
      cancelToken: cancelTokenMap[cancelKey].token,
    })

    return JSON.parse(LZString.decompressFromUTF16(data))
  } catch (error) {
    console.log(error)
    throw error
  } finally {
    delete cancelTokenMap[cancelKey]
  }
}

export default {
  logout() {
    return request('post', '/logout')
  },
  fetchUser() {
    return request('get', '/user')
  },
  fetchSeasonsWatchHistory(ids) {
    return request('post', '/seasons_watch_history', ids)
  },
  fetchHPData() {
    return request('get', '/hpdata')
  },
  fetchAnimeList(params) {
    return request('get', '/anime_list', params)
  },
  fetchSeason(animeId) {
    return request('get', `/season_list/${animeId}`)
  },
  fetchPageSpecials(animeId) {
    return request('get', `/anime_page_sp/${animeId}`)
  },
  fetchSearchResults(query) {
    return request('post', '/search', { query })
  },
  fetchTimelineAnimeList(year, season) {
    return request('post', '/timeline_anime_list', { year, season })
  },
  fetchArticle(id) {
    return request('get', `/article/${id}`)
  },
  fetchWatchHistory() {
    return request('get', '/watch_history')
  },
  updateWatchHistory(data) {
    return request('post', '/update_watch_history', data)
  },
  removeWatchHistory(data) {
    return request('post', '/remove_watch_history', data)
  },
  reportCommentAbuse(data) {
    return request('post', '/report_comment', data)
  },
}
