<template>
  <div :class="{ page: loaded }">
    <loader v-if="!loaded" />
    <div v-if="loaded">
      <var data-mark />
      <div class="player-container">
        <div class="player-container-inner">
          <div class="player" :style="{ opacity: !activeEpisodeId ? 0 : 1 }">
            <playerx
              :on-reference="linkPlayerRef"
              :vdata="vdata"
            />
            <portal-target slim name="comments" v-if="isCommentsSided" />
          </div>
          <div class="message" v-if="!activeEpisodeId">
            目前沒有正在播放的項目 <sup style="margin-bottom: 1rem">z<sup>z<sup>z</sup></sup></sup>
          </div>
        </div>
      </div>
      <portal-target slim name="comments" v-if="!isCommentsSided" />
      <div class="jouhou">
        <div class="info">
          <div class="info-inner">
            <header>
              <div
                class="image"
                :style="{ backgroundImage: 'url(' + activeSeason.poster + ')' }"
              />
              <div class="titles">
                <h1>
                  <s v-for="char in spliddit(playlist.anime.name_chi)">{{ char }}</s>
                </h1>
                <h2>
                  <s v-for="char in spliddit(playlist.anime.name_jpn)">{{ char }}</s>
                </h2>
              </div>
            </header>
            <div class="desc">
              {{ playlist.anime.description }}
            </div>
            <div class="row">
              <span>原　　作</span>
              <ins />
              <span>{{ playlist.anime.author }}</span>
            </div>
            <div class="row">
              <span>動畫製作</span>
              <ins />
              <div class="tags">
                <router-link
                  v-for="studio in activeSeasonStudios"
                  :key="studio"
                  :to="{ path: `/browse/studio/${studio}` }"
                >{{ studio }}</router-link>
              </div>
            </div>
            <div class="row">
              <span>最後更新</span>
              <ins />
              <span>{{ getFormattedDate(activeSeason.last_updated, 'YYYY 年 M 月 D 日') }}</span>
            </div>
            <div class="row">
              <span>作品類別</span>
              <ins />
              <div class="tags">
                <router-link
                  v-for="tag in playlist.anime.tags"
                  :key="tag.id"
                  :style="{ background: `rgba(${hexToRgb(tag.color)},.2)`, boxShadow: `0 0 0 1px rgba(${hexToRgb(tag.color)},.7)` }"
                  :to="{ path: `/browse/tag/${tag.name}` }"
                >{{ tag.name }}</router-link>
              </div>
            </div>
            <div class="row">
              <span>分　　享</span>
              <ins />
              <div class="sharer">
                <div class="facebook">
                  <a :href="`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`" target="_blank" @click="actionShare">
                    <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" />
                    </svg>
                  </a>
                </div>
                <div class="twitter">
                  <a :href="`https://twitter.com/intent/tweet?text=${shareUrl}`" target="_blank" @click="actionShare">
                    <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                    </svg>
                  </a>
                </div>
                <div class="telegram">
                  <a :href="`tg://msg_url?url=${shareUrl}`" target="_blank" @click="actionShare">
                    <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M9.78,18.65L10.06,14.42L17.74,7.5C18.08,7.19 17.67,7.04 17.22,7.31L7.74,13.3L3.64,12C2.76,11.75 2.75,11.14 3.84,10.7L19.81,4.54C20.54,4.21 21.24,4.72 20.96,5.84L18.24,18.65C18.05,19.56 17.5,19.78 16.74,19.36L12.6,16.3L10.61,18.23C10.38,18.46 10.19,18.65 9.78,18.65Z" />
                    </svg>
                  </a>
                </div>
                <div class="whatsapp">
                  <a :href="`whatsapp://send?text=${shareUrl}`" target="_blank" @click="actionShare">
                    <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M16.75,13.96C17,14.09 17.16,14.16 17.21,14.26C17.27,14.37 17.25,14.87 17,15.44C16.8,16 15.76,16.54 15.3,16.56C14.84,16.58 14.83,16.92 12.34,15.83C9.85,14.74 8.35,12.08 8.23,11.91C8.11,11.74 7.27,10.53 7.31,9.3C7.36,8.08 8,7.5 8.26,7.26C8.5,7 8.77,6.97 8.94,7H9.41C9.56,7 9.77,6.94 9.96,7.45L10.65,9.32C10.71,9.45 10.75,9.6 10.66,9.76L10.39,10.17L10,10.59C9.88,10.71 9.74,10.84 9.88,11.09C10,11.35 10.5,12.18 11.2,12.87C12.11,13.75 12.91,14.04 13.15,14.17C13.39,14.31 13.54,14.29 13.69,14.13L14.5,13.19C14.69,12.94 14.85,13 15.08,13.08L16.75,13.96M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C10.03,22 8.2,21.43 6.65,20.45L2,22L3.55,17.35C2.57,15.8 2,13.97 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,13.72 4.54,15.31 5.46,16.61L4.5,19.5L7.39,18.54C8.69,19.46 10.28,20 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />
                    </svg>
                  </a>
                </div>
                <div class="copy">
                  <textarea ref="copyArea" class="hidden" readonly>{{ shareUrl }}</textarea>
                  <a href="#" @click.prevent="copyShareUrl" @click="actionShare">
                    <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul class="playlist seasons">
          <li
            v-for="season in playlist.seasons"
            :key="season.id"
            :class="{ active: season.id === activeSeason.id }"
          >
            <router-link
              replace
              :to="{ name: 'anime', params: { animeId: playlist.anime.id, seasonId: season.id } }"
            >
              {{ season.season_title }}
            </router-link>
          </li>
        </ul>
        <ul class="playlist episodes">
          <li
            v-for="episode in activeSeason.episodes"
            :key="episode.id"
            :class="{ active: episode.id === activeEpisodeId }"
          >
            <a
              :href="`/anime/${playlist.anime.id}x${activeSeason.id}?ep=${episode.title}`"
              @click.prevent="play(episode)"
            >
              {{ episode.title }}
              <i class="fe-clock" v-if="watchHistory && watchHistory.title === episode.title" />
            </a>
          </li>
        </ul>
      </div>
      <div class="split-ads">
        <div class="info-ads">
          <ads type="ypa_banner" :size="{ width: 620, height: 120 }" />
        </div>
        <div class="shrinked-ads">
          <ads type="iit_banner" :size="{ width: 440, height: 120 }" />
        </div>
      </div>
    </div>
    <portal to="comments">
      <comments
        v-if="vdata"
        :vdata="vdata"
        :player="playerRef"
        :danmaku-ref="danmakuRef"
      />
    </portal>
    <portal to="danmaku">
      <danmaku
        v-if="vdata"
        :vdata="vdata"
        :on-reference="linkDanmakuRef"
        :player="playerRef"
      />
    </portal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import md5 from 'js-md5'
import spliddit from 'spliddit'

import API from '@/api'
import { getFormattedDate } from '@/utility'

import Ads from '@/components/Ads'
import Loader from '@/components/Loader'
import Playerx from '@/components/PlayerX'
import Comments from '@/components/Comments'
import Danmaku from '@/components/Danmaku'

export default {
  name: 'anime-page',
  components: {
    Ads,
    Loader,
    Playerx,
    Comments,
    Danmaku,
  },
  data() {
    return {
      playerRef: null,
      danmakuRef: null,
      vdata: null,
      activeSeasonId: null,
      activeEpisodeId: null,
      playlist: null,
      loaded: false,
      isSafari: navigator.userAgent.indexOf('Safari') > 0 && navigator.userAgent.indexOf('Chrome') < 0,
      hasPlayedAnEpisode: false,
      watchHistoryEntries: [],
    }
  },
  computed: {
    ...mapState([
      'user',
      'isCommentsSided',
      'isMobile',
    ]),
    watchHistory() {
      return this.watchHistoryEntries.find(({ seasonId }) => seasonId === this.activeSeason.id)
    },
    activeSeason() {
      if (!this.playlist || !this.activeSeasonId) {
        return {}
      }
      let activeSeason = this.playlist.seasons.find((s) => s.id === this.activeSeasonId)
      activeSeason = {
        ...activeSeason,
        poster: `https://seaside.ebb.io/${activeSeason.anime_id}x${activeSeason.id}.jpg`,
      }
      return activeSeason
    },
    activeEpisode() {
      return this.activeSeason.episodes.find(({ id }) => id === this.activeEpisodeId)
    },
    nextEpisode() {
      const index = this.activeSeason.episodes.findIndex(({ id }) => id === this.activeEpisodeId)
      return this.activeSeason.episodes[index - 1]
    },
    activeSeasonStudios() {
      return this.activeSeason.studio.split(/\r?\n/)
    },
    shareUrl() {
      let description = `${this.playlist.anime.name_chi} ${this.activeSeason.season_title}`
      // remove punctuation marks
      description = description.replace(/((?![\sa-z0-9\u3000\u3400-\u4DBF\u4E00-\u9FFF]).)/ig, ' ')
      description = description.trim().replace(/\s{1,}/g, '-')
      return `https://ebb.io/anime/${this.playlist.anime.id}x${this.activeSeason.id}/${description}`
    },
  },
  methods: {
    ...mapActions([
      'enqueueNotification',
    ]),
    spliddit,
    getFormattedDate,
    hexToRgb(hex) {
      const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)].join(',')
    },
    linkPlayerRef(player) {
      this.playerRef = player
      this.playerRef.pageComponent = this
    },
    linkDanmakuRef(danmaku) {
      this.danmakuRef = danmaku
      // this.danmakuRef.pageComponent = this
    },
    play({ id: episodeId }, autoPlay = true) {
      if (this.activeEpisode && this.activeEpisode.id === episodeId) {
        return
      }
      this.activeEpisodeId = episodeId
      if (!this.activeEpisode.sl) {
        this.enqueueNotification({ type: 'info', text: '讀取影片時發生未知錯誤<br>請嘗試重新載入網頁<br>如問題持續，請向我們反映', duration: 6000 })
        return
      }
      // update video data
      this.vdata = {
        src: this.activeEpisode.sl,
        roomId: md5(`${this.activeSeason.id}:${this.activeEpisode.title}`),
        epLength: this.activeEpisode.duration,
      }
      // update watch history
      const doRestore = this.watchHistory && this.watchHistory.title === this.activeEpisode.title
      if (doRestore) {
        // playback resumed from watch history
        this.playerRef.startTime = this.watchHistory.time
      } else {
        // set the watch history to current ep
        this.updateWatchHistory(this.activeSeason.id, this.activeEpisode.title, 0)
        this.playerRef.startTime = 0
      }
      // safari can't auto play first time since video not muted
      if (autoPlay && !(this.isSafari && !this.hasPlayedAnEpisode)) {
        this.playerRef.autoPlay = true
      } else {
        this.playerRef.autoPlay = false
      }
      if (!this.hasPlayedAnEpisode) {
        this.hasPlayedAnEpisode = true
      }
    },
    async routeChange() {
      const { anime } = this.playlist
      const siteTitle = document.title.split(' - ')[1]
      this.activeSeasonId = +this.$route.params.seasonId
      document.title = `${anime.name_chi} ${this.activeSeason.season_title} - ${siteTitle}`
      document.querySelector('meta[name="description"]').content = `ebb 提供 ${anime.name_chi} ${this.activeSeason.season_title} 的全集動畫，${new Date().getFullYear()} 年線上新番及已完結舊番隨你點播。 作品介紹：${anime.description}`
      await this.$nextTick()
      this.$root.$emit('pageload')
    },
    restoreWatchHistory() {
      if (!this.watchHistory) {
        return
      }
      const { title } = this.watchHistory
      const episode = this.activeSeason.episodes.find(({ title: t }) => t === title)
      this.play(episode, this.$route.params.autoPlay || false)
    },
    async updateWatchHistory(seasonId, title, time) {
      if (!this.user) {
        return
      }
      const { status } = await API.updateWatchHistory({ seasonId, title, time })
      if (status !== 200) {
        this.enqueueNotification({ type: 'alert', text: '同步播放記錄時發生錯誤', duration: 3000 })
        return
      }
      this.watchHistoryEntries = this.watchHistoryEntries
        .filter(({ seasonId: id }) => id !== seasonId)
        .concat({
          seasonId,
          title,
          time,
        })
    },
    async removeWatchHistory(id) {
      const { status } = await API.removeWatchHistory({ seasonId: id })
      if (status !== 200) {
        this.enqueueNotification({ type: 'alert', text: '同步播放記錄時發生錯誤', duration: 3000 })
        return
      }
      this.watchHistoryEntries = this.watchHistoryEntries.filter(({ seasonId }) => seasonId !== id)
    },
    actionShare({ currentTarget }) {
      window.ga('send', 'event', 'Share', 'method', currentTarget.parentNode.className)
      window.ga('send', 'event', 'Share', 'season', `${this.playlist.anime.name_chi} ${this.activeSeason.season_title}`)
    },
    copyShareUrl() {
      const textarea = this.$refs.copyArea
      textarea.focus()
      textarea.setSelectionRange(0, textarea.value.length)
      if (document.execCommand('copy')) {
        this.enqueueNotification({ type: 'info', text: '已複製分享連結', duration: 2500 })
        textarea.blur()
      }
    },
    async loadSeason(animeId) {
      const { success, list } = await API.fetchSeason(animeId)
      if (!success) {
        throw new Error('404')
      }
      // fetch watch history if signed in
      if (this.user) {
        const seasonIds = list.seasons.map(({ id }) => id)
        const { status, data } = await API.fetchSeasonsWatchHistory(seasonIds)
        if (status === 200) {
          this.watchHistoryEntries = data
        }
      }
      this.playlist = list
      // sanitize unknown episode
      if (this.watchHistory) {
        const { title } = this.watchHistory
        if (this.activeSeason.episodes.map(({ title: t }) => t).indexOf(title) < 0) {
          await this.removeWatchHistory(this.activeSeason.id)
        }
      }
    },
  },
  async mounted() {
    const { params } = this.$route
    try {
      await this.loadSeason(params.animeId)
      this.routeChange()
      // initialized
      this.loaded = true
      await this.$nextTick()
      // get page sp after page load
      const { js: pageSpecials } = await API.fetchPageSpecials(this.activeSeasonId)
      if (pageSpecials) {
        // eslint-disable-next-line
        new Function(pageSpecials)()
      }
      // restore previous watch history on load
      this.restoreWatchHistory()
      // scroll to active season if mobile on load
      if (this.isMobile) {
        const activeItem = document.querySelector('.playlist.seasons > .active')
        activeItem.parentNode.scrollLeft = activeItem.offsetLeft
      }
    } catch (error) {
      console.log(error)
      this.$router.replace({ path: '/404' })
    }
  },
  beforeDestroy() {
    if (this.activeEpisode) {
      this.updateWatchHistory(
        this.activeSeasonId,
        this.activeEpisode.title,
        this.playerRef.video.currentTime,
      )
      // stop buffering
      this.playerRef.video.pause()
      this.playerRef.player.destroy()
    }
    this.playerRef = null
  },
  watch: {
    $route() {
      this.routeChange()
    },
  },
}
</script>

<style lang="scss" scoped>
.player-container {
  margin: 0 auto;
  position: relative;
  width: 100%;

  &:before { right: 100%; }
  &:after { left: 100%; }

  .player-container-inner {
    overflow: hidden;
    padding-bottom: 56.25%;
    pointer-events: none;
    position: relative;
    z-index: 2;

    > * { pointer-events: all; }

    > div {
      align-items: center;
      bottom: calc(22rem / 1.77);
      display: flex;
      justify-content: center;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;

      // tablet, break comment section
      @media (max-width: 1135px) {
        bottom: 0;
        right: 0;
      }
    }

    > .player {
      display: flex;

      // tablet, break comment section
      @media (max-width: 1135px) {
        flex-direction: column;
      }
    }

    .message {
      background: linear-gradient(0, rgba(94, 99, 124, 0.2), transparent 100%);
      color: rgba(240, 252, 255, .6);
      font-size: 1.5rem;
      font-weight: 100;
      z-index: 2;
    }

    // tablet, break comment section
    @media (max-width: 1135px) {
      padding-bottom: 56.25%;
    }
  }
}

.jouhou {
  background: rgba(94, 99, 124, .2);
  margin-top: calc(22rem / -1.77);
  padding-right: 22rem;
  position: relative;

  // tablet, break comment section
  @media (max-width: 1135px) {
    margin-top: 0;
  }

  // mobile
  @media (max-width: 839px) {
    background: none;
    padding: 16rem 0 0;
  }
}

.info {
  display: flex;
  flex: 1;

  .info-inner {
    flex: 1;
    padding: 2rem;
    max-width: 100%;

    .image {
      background: transparent center no-repeat;
      background-size: cover;
      border-radius: 6px;
      float: right;
      height: 30rem;
      margin-bottom: 1.5rem;
      margin-left: 1.5rem;
      width: 21.25rem;

      // tablet
      @media (max-width: 1135px) {
        height: 24rem;
        width: 17rem;
      }

      // mobile
      @media (max-width: 839px) {
        border-radius: 0;
        float: none;
        height: 28rem;
        margin: 0 0 1rem;
        mask-image: linear-gradient(to bottom, #000 50%, rgba(0, 0, 0, 0) 100%);
        width: 100%;
      }
    }

    h1, h2 {
      color: #a2c9df;
      font-weight: 300;

      > s { text-decoration: none; }
    }

    h1 {
      font-size: 2rem;
      line-height: 3rem;
      margin: 0;
    }

    h2 {
      color: #b6b6b6;
      font-size: 1.25rem;
      margin: .5rem 0 0;
    }

    .desc {
      color: rgba(255, 255, 255, .8);
      line-height: 1.75rem;
      margin: 2rem 0;
    }

    .row {
      align-items: flex-start;
      display: flex;
      margin-bottom: 1rem;

      &:last-child {
        margin: 0;
      }

      > span:first-child {
        flex-shrink: 0;
      }

      > ins {
        color: #89e4ff;
        font-weight: 500;
        letter-spacing: -2px;
        margin: 0 .8rem;
        text-decoration: none;

        &:before {
          content: '\\\\';
        }
      }

      .tags {
        display: flex;
        flex: 1;
        flex-wrap: wrap;

        > a {
          background: rgba(255, 255, 255, .2);
          border-radius: 8px;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, .7);
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          margin: 4px 0;
          padding: 0 6px;
          text-shadow: 0 0 2px #000;
          text-decoration: none;

          &:not(:last-child) {
            margin-right: 8px;
          }
        }
      }
    }

    .sharer {
      display: inline-block;

      > div {
        align-items: center;
        display: inline-flex;
        height: 2rem;
        justify-content: center;
        text-decoration: none;
        width: 2rem;

        &.facebook { color: #b0bede; }
        &.twitter { color: #9fdbea; }
        &.telegram { color: #9dcbde; }
        &.whatsapp { color: #91ea91; }
        &.copy { color: #e8e2ae; }

        .hidden {
          height: 1px;
          opacity: .001;
          position: absolute;
          width: 1px;
          z-index: -1;
        }

        > a { color: inherit; }
      }
    }
  }

  // mobile
  @media (max-width: 839px) {
    align-items: center;
    background: rgba(89, 117, 132, .1);
    flex-direction: column-reverse;

    .info-inner {
      padding: 0 0 2rem;
      width: 100%;

      > *:not(:first-child) {
        padding: 0 1.5rem;
      }

      h1, h2 { text-align: center; }

      header {
        position: relative;

        .titles {
          align-items: flex-start;
          bottom: 0;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: flex-end;
          left: 0;
          padding: calc(1.5rem - .5rem) 0 3rem;
          position: absolute;
          top: 0;
          width: 100%;

          > h1, h2 {
            border-left: calc(1rem - 1px) solid rgba(0, 0, 0, .75);
            display: flex;
            flex-wrap: wrap;
            margin: 0 0 0 1rem;
            padding-right: .5rem;

            > s {
              align-items: center;
              background: rgba(0, 0, 0, .75);
              display: flex;
              text-indent: -.5rem;
              padding: .25rem .5rem .25rem 0;
            }
          }

          > h2 {
            line-height: 1.8rem;
            margin-top: 2px;
          }
        }
      }

      .desc {
        margin-top: -3rem;
      }
    }
  }
}

.playlist {
  height: 100%;
  list-style: none;
  margin: 0;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
  padding: 2rem 0;
  position: absolute;
  top: 0;

  &.seasons {
    right: 10rem;
    width: 12rem;
  }

  &.episodes {
    right: 0;
    width: 10rem;
  }

  &:not(:first-child) {
    padding-left: 1px;
  }

  &:last-child {
    padding-right: 1px;
  }

  li {
    border-radius: 4px;
    display: inline-block;
    margin: 1px 0;
    transition: background .1s;
    white-space: nowrap;
    width: 100%;

    &:hover > a,
    &.active > a { color: #fff; }

    &.active {
      background: #384a5f;
      box-shadow: inset 0 0 0 1px #43576b;
    }

    a {
      align-items: center;
      display: flex;
      min-height: 2.5rem;
      padding: .5rem 1rem;
      text-decoration: none;
      transition: color .15s;
      white-space: normal;
      width: 100%;
      word-break: break-word;

      .fe-clock {
        background: #ebebeb;
        border-radius: 50%;
        color: #000;
        font-size: .8rem;
        margin-left: auto;
        padding: 3px;
      }
    }
  }

  // mobile
  @media (max-width: 839px) {
    border: 0;
    padding: 0;

    &.seasons,
    &.episodes {
      right: 0;
      width: 100%;
    }

    &.seasons {
      height: 2.5rem;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;

      li {
        margin: 0 1px 0 0;
        width: auto;

        &:hover:not(.active) { background: transparent; }
      }
    }

    &.episodes {
      height: calc(16rem - 2.5rem);
      top: 2.5rem;
    }
  }
}

.split-ads {
  align-items: center;
  display: flex;
  height: 10rem;
  justify-content: center;
}

// ads
// > 1000px
@media (min-width: 1000px) {
  .info-ads {
    display: flex;
  }
  .shrinked-ads {
    display: none;
  }
}
// < 1000px
@media (max-width: 999px) {
  .info-ads {
    display: none;
  }
}
</style>
