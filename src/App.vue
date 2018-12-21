<template>
  <div id="app">
    <div class="content">
      <nav>
        <div class="left">
          <router-link class="logo link" :to="{ name: 'index' }">
            <svg width="32" height="16" viewBox="0 0 428 214" fill="currentColor">
              <path d="M320.6,118.7c-0.2-3.3-0.8-6.5-1.5-9.6c-0.7-3.2-1.8-6.2-3.2-9c-1.4-2.8-3.1-5.2-5.2-7c-1.4-1.3-3.2-2.1-5.3-2.3
              c-2.1-0.3-4.2-0.2-6.6,0.1c-2.3,0.4-4.7,1-7.2,1.8c-2.5,0.9-4.8,1.8-7,3c-2.2,1.2-4.2,2.4-6,3.7c-1.8,1.3-3.2,2.5-4.2,3.7
              c-1.5,1.8-3,4.4-4.3,8.1c-1.4,3.7-1.3,6.2,0.2,7.5c2.2,1.9,5.3,2,9.3,0.3c1.5-0.6,3.1-1.6,4.9-2.7c1.7-1.2,3.4-2.2,5.2-3.2
              c1.8-1,3.6-1.7,5.5-2.2c1.9-0.5,3.8-0.4,5.9,0.3c1.2,1.7,2,3.7,2.5,6.3c0.5,2.6,0.7,5.3,0.6,8.3c-0.1,3-0.3,6.2-0.9,9.6
              c-0.5,3.3-1.2,6.8-1.9,10.2c-0.7,3.2-1.7,6.7-3,10.4s-2.8,7.5-4.6,11.2c-1.7,3.7-3.6,7.3-5.6,10.7c-2,3.4-4.2,6.3-6.3,8.8
              c-1.5,1.8-3.5,3.1-5.8,4.1c-2.4,1-4.9,1.7-7.5,1.9s-5.1,0.1-7.7-0.5c-2.5-0.6-4.6-1.7-6.4-3.3c-8.8-7.7-16-17.3-21.5-28.5
              c-5.5-11.2-9.2-23.8-10.9-37.6c-1-7.2-2.8-11.9-5.4-14.5c2.3-1,4.6-2,6.6-2.9c2.6-1.2,5-2.3,7.4-3.4c0.6-0.3,1.4-0.6,2.4-1
              c0.9-0.3,1.9-0.7,3-1.2c1.1-0.4,2-0.7,2.7-1c0.7-0.2,1.2-0.5,1.5-0.6c1.4-0.6,3-1.2,4.9-2.1c1.9-0.8,4.1-1.8,6.6-2.9
              c2.5-1.1,4.7-2.1,6.7-2.9c2-0.9,3.8-1.6,5.4-2.2c11-4.7,22.5-11,34.2-19c1.1-0.9,1.8-1.5,2.2-2c0.8-1.4,0.9-3.3,0.2-5.5
              c-0.6-2.3-1.8-3.8-3.2-4.7c-0.8-0.5-4,0.4-9.6,2.6c-5.4,2.2-10.2,4.4-14.3,6.7c-1.3,0.7-2.3,1.4-3.1,1.9c-0.8,0.6-1.9,1.3-3.4,2.2
              c-2.6,1.3-5.2,2.6-8,3.8c-2.8,1.3-5.8,2.6-8.8,3.9c-6.2,2.6-11,4.5-14.5,6.1c-5.4,2.3-10.2,4.5-14.5,6.3c-4.2,1.8-8,3.4-11.3,4.8
              c-6.6,2.7-17.8,7.3-34,13.9c-1.9,0.7-4.4,1.7-7.4,2.8c-2.5,1-5.5,2.2-8.7,3.4c0-1.2-0.2-2.6-0.9-4.4c-1.4-3.7-2.8-6.4-4.3-8.1
              c-1-1.1-2.4-2.3-4.2-3.7c-1.8-1.3-3.8-2.6-6-3.7c-2.2-1.2-4.6-2.2-7-3c-2.5-0.9-4.9-1.5-7.2-1.8c-2.3-0.4-4.6-0.4-6.6-0.1
              c-2.1,0.2-3.8,1-5.3,2.3c-2.1,1.8-3.8,4.1-5.2,7c-1.4,2.9-2.4,5.8-3.2,9c-0.7,3.2-1.3,6.4-1.5,9.6c-0.2,3.3-0.4,6.1-0.3,8.8
              c0.2,6.5,1,13,2.2,19.5c1.2,6.5,2.9,12.8,5,18.9c2.1,6.1,4.6,11.7,7.5,17.1s6.1,10,9.5,13.9l0.4,0.5c3.4,3.8,7.2,7,11.4,9.5
              c4.2,2.5,8.5,4.1,13,4.8c4.5,0.7,8.9,0.4,13.5-0.8c4.5-1.3,8.8-3.7,12.8-7.2c3.8-3.3,7.4-7,10.6-10.9s6.2-8.3,8.9-13.1
              s5-10.1,7.2-15.9c1.5-4.1,2.9-8.8,4.2-13.6c1.3,4.9,2.6,9.5,4.2,13.6c2.2,5.8,4.6,11.2,7.2,15.9s5.6,9.2,8.9,13.1
              s6.8,7.6,10.6,10.9c4,3.5,8.2,5.9,12.8,7.2c4.5,1.3,9,1.5,13.5,0.8c4.5-0.7,8.9-2.3,13-4.8c4.2-2.5,8-5.7,11.4-9.5l0.4-0.5
              c3.4-3.9,6.6-8.5,9.5-13.9c3-5.3,5.4-11,7.5-17.1c2.2-6.1,3.8-12.4,5-18.9c1.3-6.5,2-13.1,2.2-19.5
              C321,124.8,320.8,121.9,320.6,118.7z M125.6,117.6c0.5-2.6,1.3-4.6,2.5-6.3c2-0.7,4-0.8,5.9-0.3c1.9,0.5,3.8,1.2,5.5,2.2
              c1.8,1,3.5,2.1,5.2,3.2c1.7,1.1,3.4,2.1,4.9,2.7c0.4,0.2,0.7,0.1,1.1,0.2c-0.8,0.3-1.8,0.7-2.6,1c-2.9,1.1-5.4,2.2-7.2,3
              c-9.2,3.8-14.3,6.6-15.4,8.2c-0.2-1.9-0.5-3.9-0.5-5.7C124.9,122.8,125.1,120,125.6,117.6z M196.2,160.4
              c-5.5,11.3-12.7,20.8-21.5,28.5c-1.8,1.6-3.9,2.6-6.4,3.3c-2.5,0.6-5,0.8-7.7,0.5c-2.6-0.2-5.1-0.9-7.5-1.9c-2.4-1-4.3-2.4-5.8-4.1
              c-2.2-2.5-4.2-5.3-6.3-8.8c-2.1-3.3-3.9-6.9-5.6-10.7c-1.7-3.7-3.2-7.5-4.6-11.2c-1.3-3.7-2.3-7.3-3-10.4c-0.2-1.1-0.4-2.2-0.6-3.3
              c0.2,0.2,0.4,0.7,0.6,0.8c0.5,0.2,1.1,0.5,1.8,0.6c0.8,0.1,1.4,0.1,1.7,0c4.8-0.9,9.6-2.3,14.5-4.1c2.4-0.9,5-1.9,7.8-3.2
              c2.8-1.2,5.8-2.6,9-4.2s5.8-2.8,7.6-3.7c1.8-0.9,3-1.4,3.6-1.7c4.5-2,8.9-4,13.5-6c4.6-2.1,8.9-4,13.3-5.7c2.1-0.9,4.4-1.8,6.8-2.9
              c1-0.4,2.2-1,3.2-1.4c-1.7,2.9-3,6.5-3.7,11.9C205.4,136.7,201.7,149.2,196.2,160.4z"/>
              <ellipse cx="158.5" cy="21.1" rx="17.3" ry="21.1"/>
              <ellipse cx="270.5" cy="21.1" rx="17.3" ry="21.1"/>
              <path d="M56.7,16.9c0,2.3-2,5.6-6,9.9c-3,3-5.9,6-8.9,8.9c-7.2,8.2-12.9,19.8-17,35c-3.6,13.2-5.4,26.2-5.4,39
              c0,32.9,7.5,57.1,22.4,72.4c3,2.3,6,4.7,9.1,7c3.8,3,5.7,5.9,5.7,8.8c0,2.1-0.8,4-2.5,5.6c-1.7,1.6-3.6,2.4-5.8,2.4
              c-1.9,0-4.3-0.7-7-2.2C13.7,188.3,0,156.2,0,107.5c0-17.6,3.5-35.3,10.6-53.4c7.9-20,18.3-34.5,31.2-43.5c2.6-1.8,4.6-2.7,6.1-2.7
              c2.3,0,4.4,0.9,6.1,2.8C55.8,12.4,56.7,14.5,56.7,16.9z"/>
              <path d="M428,107.5c0,48.8-13.8,80.9-41.3,96.2c-2.7,1.5-5,2.2-6.9,2.2c-2.2,0-4.2-0.8-5.8-2.4c-1.7-1.6-2.5-3.5-2.5-5.6
              c0-2.9,1.9-5.9,5.7-8.8c3-2.3,6-4.7,9.1-7c14.9-15.4,22.4-39.5,22.4-72.4c0-12.8-1.8-25.8-5.4-39c-4.2-15.2-9.8-26.8-17-35
              c-3-3-5.9-6-8.9-8.9c-4-4.3-6-7.6-6-9.9c0-2.3,0.9-4.4,2.6-6.3c1.7-1.8,3.8-2.8,6.1-2.8c1.5,0,3.6,0.9,6.2,2.7
              c12.9,9,23.3,23.5,31.2,43.5C424.5,72.1,428,89.9,428,107.5z"/>
            </svg>
            <span>ebb</span>
          </router-link>
          <search-bar v-if="loaded && !isMobile" />
        </div>
        <div class="right">
          <div class="icon" v-if="isMobile">
            <router-link class="link" :to="{ name: 'search' }">
              <i class="fe-search" />
            </router-link>
          </div>
          <div class="icon" v-if="user">
            <router-link class="link" :to="{ name: 'watch-history' }">
              <i class="fe-clock" />
            </router-link>
          </div>
          <div class="icon">
            <router-link class="link" :to="{ name: 'account' }">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </router-link>
          </div>
        </div>
      </nav>
      <portal-target slim name="nav-level" />
      <portal-target slim name="curtain" />
      <main>
        <loader v-if="!loaded" />
        <router-view v-if="loaded" />
      </main>
      <footer>
        <div>
          <span>&copy; {{ year }} ebb.io</span>
          <div class="disclaimer">
            本站影片皆串流自其他網站，伺服器並不保存影音資源
            <br />
            影片版權歸原作者所有，如有侵權請盡快通知我們反映
          </div>
          <div class="links">
            <a class="link" rel="noopener noreferrer nofollow" href="https://t.me/ebbStatus" target="_blank">最新消息</a>
            <ins />
            <a class="link" rel="noopener noreferrer nofollow" href="https://t.me/ebbAnimeUpdate" target="_blank">推送通知</a>
            <ins />
            <a class="link" rel="noopener noreferrer nofollow" href="https://t.me/ebbCafe" target="_blank">CAFE</a>
            <ins />
            <a class="link" rel="noopener noreferrer nofollow" href="https://github.com/ebb-io/ebbx" target="_blank" >GitHub</a>
            <ins />
            <router-link class="link" :to="{ name: 'apps' }">Apps</router-link>
            <ins />
            <router-link class="link" :to="{ name: 'about' }">關於我們</router-link>
          </div>
        </div>
      </footer>
    </div>
    <transition name="ebuko" mode="out-in">
      <div class="ebuko-fix-wrap">
        <ebuko v-if="showEbuko && !hideEbukoOverride" />
      </div>
    </transition>
    <div class="notification-wrapper">
      <notification v-for="x in notifications" :key="x.id" :payload="x" />
    </div>
    <background />
    <div v-if="isMobile && !adsDismissed" class="mfloat-ads">
      <ads type="iit_banner" :size="{ width: screenWidth, height: 120 }" />
      <i class="fe-x" @click="adsDismissed = true" />
    </div>
  </div>
</template>

<script>
import store from 'store'
import { mapState, mapActions, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import API from '@/api'

import Ads from '@/components/Ads'
import Ebuko from '@/components/Ebuko'
import Loader from '@/components/Loader'
import SearchBar from '@/components/SearchBar'
import Notification from '@/components/Notification'
import Background from '@/components/Background'

export default {
  name: 'app',
  components: {
    Ads,
    Ebuko,
    Loader,
    SearchBar,
    Notification,
    Background,
  },
  data() {
    return {
      year: new Date().getFullYear(),
      loaded: false,
      adsDismissed: false,
    }
  },
  computed: {
    ...mapState([
      'user',
      'isMobile',
      'showEbuko',
      'hideEbukoOverride',
      'notifications',
    ]),
    screenWidth() {
      return window.innerWidth
    },
  },
  methods: {
    ...mapMutations([
      'setIsCommentsSided',
      'setIsMobile',
    ]),
    ...mapActions([
      'setEbukoUnwell',
      'setShowEbuko',
      'fetchUser',
      'fetchAnimeList',
      'fetchHPData',
      'enqueueNotification',
    ]),
    checkEbukoHealth() {
      return new Promise((resolve) => {
        const script = document.createElement('script')
        const result = (blocked) => {
          script.parentNode.removeChild(script)
          this.setEbukoUnwell(blocked)
          resolve()
        }
        script.onload = result.bind(true, false)
        script.onerror = result.bind(false, true)
        script.src = 'https://admax.network'
        document.head.appendChild(script)
      })
    },
  },
  async mounted() {
    await this.checkEbukoHealth()

    // listeners
    const onWindowResize = debounce(() => {
      const isCommentsSided = !window.matchMedia('(max-width: 1135px)').matches
      const isMobile = !!window.matchMedia('(max-width: 839px)').matches
      const showEbuko = !!window.matchMedia('(min-width: calc(1536px + (110px + 64px) * 2))').matches
      this.setIsCommentsSided(isCommentsSided)
      this.setIsMobile(isMobile)
      this.setShowEbuko(showEbuko)
    }, 200)
    window.addEventListener('resize', onWindowResize)
    onWindowResize()

    await Promise.all([
      this.fetchUser(),
      this.fetchAnimeList(),
      this.fetchHPData(),
    ])

    this.loaded = true
    this.$root.$emit('appload')
  },
}
</script>

<style lang="scss">
@import url('/assets/style.css');

@font-face {
  font-family: '37DE7F';
  font-style: normal;
  font-weight: 400;
  src: url(/static/37DE7F_2nlig.woff2) format('woff2');
  // https://unicode-table.com/
  unicode-range: U+0020-007E;
}

html, body {
  overflow-x: hidden;
}

html {
  background: #111927;
  overflow-y: scroll;
}

body {
  background: linear-gradient(0, #031d36, #111b27);
  color: #ebf8fb;
  font: 1rem '37DE7F', 'Helvetica Neue', 'Helvetica', 'Microsoft JhengHei', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  letter-spacing: .5px;
  line-height: 1.6rem;
  margin: 0;
  overflow-y: hidden;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

::-webkit-scrollbar-thumb {
  background-clip: padding-box;
  background-color: rgba(128, 128, 128, .5);
  border: 2px solid transparent;
}

::-webkit-scrollbar {
  height: .8rem;
  width: .8rem;
}

.content {
  align-items: center;
  background: url(./assets/g-content.png);
  background-size: 100% 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
  min-height: calc(100vh - 2rem * 2);
  max-width: 1536px;
  padding-bottom: env(safe-area-inset-bottom);
  position: relative;
  z-index: 2;

  &:before {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAEAQMAAACTPww9AAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlMAFoJHeGkAAAAQSURBVAjXYxBgUGBwYGgAAAJYAPF9gAMvAAAAAElFTkSuQmCC);
    border-radius: 8px;
    content: '';
    height: 100%;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }

  // smaller than container
  @media (max-width: calc(1536px - 1px)) {
    margin: 0 auto;
    min-height: 100vh;

    &, &:before {
      border-radius: 0;
    }
  }
}

a {
  color: #b5dff5;

  &.link {
    border-bottom: 1px dashed transparent;
    padding-top: 3px;
    padding-bottom: 2px;
    text-decoration: none;
    transition: border-color .2s;

    &:hover {
      border-bottom-color: currentColor;
    }
  }
}

input[type="text"] {
  background: rgba(94, 99, 124, .2);
  border: 0;
  border-radius: 12px;
  color: inherit;
  font: inherit;
  font-size: 1.1rem;
  outline: 0;
  padding: .2rem;
  position: relative;
  text-align: left;
  transition: background .2s;

  &:focus {
    background: rgba(94, 99, 124, .3);
  }
}

[data-deferred-src] {
  opacity: 0;
  transition: opacity .1s linear;
}

.grecaptcha-badge {
  display: none;
}
</style>

<style lang="scss" scoped>
.ebuko-enter-active, .ebuko-leave-active {
  transition: all .15s;
}
.ebuko-enter {
  opacity: 0;
  transform: translateY(-10px);
}
.ebuko-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.ebuko-fix-wrap {
  bottom: 1rem;
  left: calc((100vw - 1536px) / 2 - 110px - 64px);
  position: fixed;
  z-index: 1;
}

.notification-wrapper {
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 10;
}

.mfloat-ads {
  background: #1e1f2e;
  bottom: 0;
  height: 120px;
  left: 0;
  position: fixed;
  z-index: 99;

  > i {
    align-items: center;
    background: #52596d;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    font-size: 1.2rem;
    height: 2rem;
    justify-content: center;
    position: absolute;
    right: 0;
    top: -.75rem;
    width: 2rem;
  }
}

nav {
  align-items: center;
  display: flex;
  height: 3.5rem;
  line-height: 3.5rem;
  padding: 0 2rem;
  pointer-events: none;
  text-align: center;
  transition: opacity .25s;
  width: 100%;

  .left,
  .right {
    > * {
      pointer-events: all;
    }
  }

  .left {
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: flex-start;

    span {
      font-size: 1.1rem;
    }
  }

  .right {
    display: flex;
    flex: 1;
    justify-content: flex-end;

    .icon {
      text-align: right;
      width: 2.5rem;

      &,
      > .link {
        align-items: center;
        display: flex;
        justify-content: center;
      }

      > .link {
        width: 2.25rem;
        line-height: 2.5rem;
        height: 2.25rem;
      }
    }
  }
}

.logo {
  align-items: center;
  display: inline-flex;
  height: 1.5rem;
  margin-right: 2rem;

  > span {
    height: 1rem;
    line-height: 1rem;
    margin-left: 1rem;
  }
}

main {
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  width: 100%;

  > .page {
    margin-bottom: auto;
    width: 100%;
  }
}

.side-ad {
  opacity: .5;
  position: fixed;
  top: 50%;
  transform: translateY(-50%);

  &:hover { opacity: .8; }
}

footer {
  align-items: center;
  display: flex;
  font-size: .8rem;
  height: 9rem;
  justify-content: center;
  padding-bottom: 1rem;
  text-align: center;
  width: 100%;

  ins {
    background: rgba(210, 229, 247, .6);
    border-radius: 50%;
    display: inline-block;
    height: 3px;
    margin: .2rem .4rem;
    width: 3px;
  }

  .disclaimer {
    color: #979a9f;
  }

  .links {
    margin-top: 1rem;
    padding: 0 4rem;
  }
}
</style>
