<template>
  <div class="login">
    <div class="login-helper">
      <div class="promoter">
        <ebuko />
      </div>
      <div :class="`bubble ${this.prevSessionError ? 'error' : ''}`" v-html="message" />
    </div>
    <div class="login-form">
      <div>
        <h2>
          <span>ebbConnect</span>
          <span>登入 ebb 帳號</span>
        </h2>
        <div class="row">
          <div class="description">
            選擇希望連結至 ebb 帳號的登入方式
          </div>
          <div class="buttons">
            <div class="button" @click="doGoogleAuth">
              <i class="icon google" />
              <span>使用 Google 登入</span>
            </div>
            <div class="button" ref="telegramDiv">
              <i class="icon telegram" />
              <span>使用 Telegram 登入</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { API_ROOT } from '@/api'

import Ebuko from '@/components/Ebuko'

const authGoogle = API_ROOT.replace('/_', '/auth/google')
const authTelegram = API_ROOT.replace('/_', '/auth/telegram')

const loadTelegram = (targetDiv) => new Promise((resolve) => {
  const script = document.createElement('script')
  script.onload = () => {
    document.body.removeChild(script)
    targetDiv.appendChild(document.querySelector('body > iframe[id^="telegram-login"]'))
    resolve()
  }
  script.setAttribute('data-telegram-login', 'ebbConnectBot')
  script.setAttribute('data-size', 'small')
  script.setAttribute('data-userpic', 'false')
  script.setAttribute('data-auth-url', authTelegram)
  script.async = 1
  script.src = 'https://telegram.org/js/telegram-widget.js?4'
  document.body.appendChild(script)
})

export default {
  name: 'login-page',
  components: {
    Ebuko,
  },
  data() {
    return {
      prevSessionError: null,
      words: [],
    }
  },
  computed: {
    message() {
      if (this.prevSessionError) {
        return `<span>登入時出現異常啦！ ( ; ω ; )<br>請將此二維碼回報給我們</span>
          <br>
          <img alt src="https://chart.googleapis.com/chart?chs=160x160&cht=qr&chl=${this.prevSessionError}&chld=M|1&choe=UTF-8">`
      }
      return this.words.join('')
    },
  },
  methods: {
    ...mapActions([
      'setHideEbukoOverride',
    ]),
    doGoogleAuth() {
      window.location.href = authGoogle
    },
  },
  created() {
    // remove hash
    if (window.location.search.startsWith('?oe=')) {
      const [techInfo] = window.location.search.replace('?oe=', '').split('&')
      this.prevSessionError = techInfo
    }
    this.setHideEbukoOverride(true)
  },
  async mounted() {
    await loadTelegram(this.$refs.telegramDiv)
    // wait fadeIn
    setTimeout(async () => {
      const words = []
        .concat('ebbConnect へようこそ'.split(''))
        .concat('<br />')
        .concat('エブ'.split(''))
        .concat('<i>!! </i>')
        .concat('ヽ(^_^)ノ'.split(''))
      const delay = () => new Promise((resolve) => setTimeout(resolve, 50))
      while (words.length) {
        // eslint-disable-next-line
        await delay()
        this.words.push(words.shift())
      }
    }, 499)
    await this.$nextTick()
    this.$root.$emit('pageload')
  },
  beforeDestroy() {
    this.setHideEbukoOverride(false)
  },
}
</script>

<style lang="scss" scoped>
@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes fadeOutHeading {
  to { opacity: 0; }
}
@keyframes fadeInHeading {
  to { opacity: 1; }
}

.login {
  display: flex;
  padding: 0 2rem;

  .login-helper {
    margin: 0 3rem 0 0;
    min-height: 260px;
    min-width: 294px;
    padding-left: 96px;
    padding-bottom: 176px;
    position: relative;

    .promoter {
      bottom: 0;
      left: 0;
      position: absolute;
    }

    .bubble {
      animation: fadeIn .5s .5s;
      animation-fill-mode: forwards;
      border-radius: 6px;
      color: #ececef;
      display: inline-block;
      opacity: 0;
      padding: 10px;
      position: relative;
      user-select: none;

      &.error {
        color: #f2a46d;

        :global(img) {
          margin: .5rem 0 0;
          opacity: .8;
        }
      }

      &:before {
        background: currentColor;
        border-radius: 6px;
        content: '';
        height: 2rem;
        position: absolute;
        right: 100%;
        top: calc(100% - 1rem);
        transform: rotate(60deg);
        width: 1px;
      }

      &:after {
        border: 1px solid;
        border-radius: 6px;
        bottom: 0;
        content: '';
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }

  .login-form {
    align-items: center;
    display: flex;

    h2 {
      font-size: 1.6rem;
      height: 2rem;
      margin: 0 0 1.5rem;
      position: relative;

      span {
        left: 0;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }

      span:first-child {
        animation: fadeOutHeading .3s 3.5s;
        animation-fill-mode: forwards;
        opacity: 1;
      }
      span:last-child {
        animation: fadeInHeading .3s calc(3.5s + .3s);
        animation-fill-mode: forwards;
        opacity: 0;
      }
    }

    .row {
      .description { color: #b5dff5; }

      .buttons {
        .button {
          align-items: center;
          background: #394460;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          height: 3rem;
          margin-top: 1rem;
          overflow: hidden;
          position: relative;
          transition: background .3s;
          user-select: none;
          width: 15rem;

          &:hover { background: #475577; }
          &:active { background: #324064; }

          .icon {
            background: transparent center no-repeat;
            background-size: 1.5rem;
            height: 3rem;
            width: 3rem;

            &.google { background-image: url(https://lh3.googleusercontent.com/_RS8nTX8HLPW-dDr374dEdQTaYn-7LI8HVVk0INaAmk7t8MYZKDssvGnep-GwPR94LJPxqq6UDnbm4tonioTpkl4Kqr6-k-670teZA); }
            &.telegram { background-image: url(https://telegram.org/img/t_logo.png); }
          }

          span {
            margin: 0 auto;
            width: 9rem;
          }

          > :global(iframe) {
            left: 0;
            opacity: .01;
            position: absolute;
            top: 0;
            transform: scale(100) !important;
          }
        }
      }
    }
  }

  // mobile
  @media (max-width: 839px) {
    align-items: center;
    flex-direction: column;

    .login-helper {
      margin: 1rem 0;
    }
  }
}
</style>
