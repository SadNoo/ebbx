import _ from 'lodash'
import Vue from 'vue'
import qs from 'qs-lite'
import PortalVue from 'portal-vue'
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import { RecycleScroller } from 'vue-virtual-scroller'

import { API_ROOT } from '@/api'

import App from '@/App'
import store from '@/store'
import router from '@/router'
import '@/polyfills'

const connection = io.connect(API_ROOT.replace('https:', 'wss:').replace('/_', ''), {
  transports: ['websocket'],
  upgrade: false,
})

Vue.use(PortalVue)
Vue.use(new VueSocketIO({ connection }))
Vue.use(VueReCaptcha, { siteKey: '6LfNBYIUAAAAALW1i2wUUzoSnggqR4ZHpHttNuVA' })
Vue.component('RecycleScroller', RecycleScroller)

Vue.config.productionTip = false

const siteTitle = document.title
const siteDescription = document.querySelector('meta[name="description"]').content.replace('2018', new Date().getFullYear())

// router :: beforeEach

let appLoadResolver
const appLoadPromise = new Promise((resolve) => { appLoadResolver = resolve })

router.beforeEach(async (to, from, next) => {
  await appLoadPromise
  if (to.meta.requiresAuth && !store.state.user) {
    next('/account/login')
    return // navigation to /account in /account/login will fire without return
  } else if (to.meta.requiresNoAuth && store.state.user) {
    next('/account')
    return
  }
  next()
})

// router :: afterEach

let pageLoadResolver
let pageLoadPromise = new Promise((resolve) => { pageLoadResolver = resolve })

router.afterEach(async (to) => {
  pageLoadPromise = new Promise((resolve) => { pageLoadResolver = resolve })
  const { title } = to.meta
  document.title = `${title ? `${title} - ` : ''}${siteTitle}`
  document.querySelector('meta[name="description"]').content = siteDescription
  const url = `${to.path}${Object.keys(to.query).length > 0 ? '?' : ''}${qs.stringify(to.query)}`

  await pageLoadPromise

  window.requestAnimationFrame(() => {
    window.ga('set', 'page', url)
    window.ga('send', 'pageview')
  }, 50)
})

const vueEventBus = new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})

vueEventBus.$on('appload', () => appLoadResolver())
vueEventBus.$on('pageload', () => pageLoadResolver())

// observe lazy load
const loadedUrls = []

document.addEventListener('scroll', _.debounce(() => {
  const threshold = window.innerHeight * 0.1
  for (let i = 0, nodeList = document.querySelectorAll('[data-deferred-src]'); i < nodeList.length; i += 1) {
    const el = nodeList[i]
    const src = el.getAttribute('data-deferred-src')
    if (loadedUrls.indexOf(src) >= 0) {
      el.style.backgroundImage = `url(${src})`
      el.style.opacity = 1
      continue
    }
    const rect = el.getBoundingClientRect()
    const withinViewport = rect.top + threshold >= 0 && rect.top - threshold <= window.innerHeight
    if (!withinViewport) {
      continue
    }
    const image = new Image()
    image.onload = () => window.requestAnimationFrame(() => {
      loadedUrls.push(src)
      el.style.backgroundImage = `url(${src})`
      el.style.opacity = 1
    })
    image.onerror = () => el.removeAttribute('data-deferred-src')
    image.src = src
  }
}, 75), true)

// SAO Inject
const onMediaLoaded = () => {
  const progress20 = 800
  const progress40 = progress20 + 1000
  const progress70 = progress40 + 800
  const progress90 = progress70 + 1200

  setTimeout(console.log.bind(console, '> [NERvGear] Initializing... 0%'), 0)
  setTimeout(console.log.bind(console, '> [NERvGear] Initializing... 20%'), progress20)
  setTimeout(console.log.bind(console, '> [NERvGear] Initializing... 40%'), progress40)
  setTimeout(console.log.bind(console, '> [NERvGear] Initializing... 70%'), progress70)
  setTimeout(console.log.bind(console, '> [NERvGear] Initializing... 90%'), progress90)
  setTimeout(() => {
    const oLog = console.log
    console.log = () => {} // prevent other log at this moment
    setTimeout(console.clear.bind(console), 0)
    setTimeout(oLog.bind(console, '> [NERvGear] Do you want to start linking? (yes/no)'), 0)
    function start() {
      setTimeout(oLog.bind(console, '> [NERvGear] Preparing linkage...'), 0)
      // link start
      const linkStart = `
        <svg viewBox="0 0 70 16" xmlns="http://www.w3.org/2000/svg">
          <style>
            .type { font: 11px monospace; }
            @keyframes typing {
              0%, 10% { x: 6; }
              29.9%, 20% { x: 12; }
              39.9%, 30% { x: 20; }
              49.9%, 40% { x: 26; }
              59.9%, 50% { x: 32; }
              69.9%, 60% { x: 40; }
              79.9%, 70% { x: 46; }
              89.9%, 80% { x: 53; }
              99.9%, 90% { x: 60; }
              100% { x: 70; }
            }
            .l {
              animation: typing 1.5s .5s linear;
              animation-fill-mode: forwards;
              fill: #fff;
              x: 0;
              y: 2;
              height: 11px;
              width: 70px;
            }
          </style>

          <text x="0" y="11px" class="type">link start</text>
          <g>
            <rect class="l" />
          </g>
        </svg>
      `
      const cssbiz = `background: url(data:image/svg+xml;base64,${btoa(linkStart)}) left top no-repeat; font-size: 1rem`
      const progressLinkStart = 500
      const progressLinkStartComplete = progressLinkStart + 1500 + 500 + 500
      setTimeout(oLog.bind(console, '%c                   ', cssbiz), progressLinkStart)
      let resolve
      const prom = new Promise((r) => { resolve = r })
      setTimeout(oLog.bind(console, prom), progressLinkStartComplete)
      // animation
      setTimeout(oLog.bind(
        console,
        '%c　　',
        'background: url(https://na.cx/i/4H7WswK.gif) left top no-repeat; background-size: 240px; font: 120px Arial',
      ), progressLinkStartComplete + 1000)
      setTimeout(() => {
        resolve('https://ebb.io/anime/104x147')
        setTimeout(oLog.bind(console, prom), 0)
      }, progressLinkStartComplete + 4100)
    }
    Object.defineProperty(window, 'yes', {
      get() {
        start()
        return true
      },
    })
    Object.defineProperty(window, 'no', {
      get() {
        setTimeout(oLog.bind(console, '> [NERvGear] Do you want to start linking? (yes/no)'), 0)
        return false
      },
    })
    console.log = oLog
  }, progress90 + 500)
}

if (/applewebkit/i.test(navigator.userAgent)) {
  const image = new Image()
  image.onload = onMediaLoaded
  image.src = 'https://na.cx/i/4H7WswK.gif'
} else {
  setTimeout(console.log.bind(console, '> [NERvGear] Unsupported Environment'), 0)
}
