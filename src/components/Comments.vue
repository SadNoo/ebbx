<template>
  <div :class="{ comments: true, 'collapsed-mobile': isMobileCollapsed }">
    <div class="chat-block">
      <div :class="{ inner: true, collapsed: isCollapsed }">
        <recycle-scroller :items="messageList" :item-height="35" :buffer="800" class="scroller">
          <div slot-scope="{ item }" class="chat-row">
            <span class="time">
              <time @click="jumpTo(item.time)">{{ getFormattedTime(item.time) }}</time>
            </span>
            <span class="text" v-html="item.text" />
            <span class="date" :title="getFullDate(item.date)">
              <time>{{ getRelativeDate2(item.date) }}</time>
              <span class="actions">
                <i class="fe-flag" @click="reportModalData = item" />
              </span>
            </span>
          </div>
        </recycle-scroller>
        <form @submit.prevent="sendMessage">
          <input type="text" ref="textInput" />
          <div class="guest-message" v-if="!user">
            <router-link :to="{ name: 'account' }">登入後即可發表評論 ( ´･ω･)</router-link>
          </div>
        </form>
      </div>
      <div class="comments-collapsed" v-if="isCommentsSided && isCollapsed">
        <div>
          <i class="fe-bell-off" />
          <h1>評論已隱藏</h1>
          <span>需要專心看動畫嗎？ ( ´ω` )</span>
        </div>
      </div>
      <div class="collapse-toggle" v-if="isCommentsSided" @click="isCollapsed = !isCollapsed">
        {{ isCollapsed ? `顯示評論 (${messageList.length})` : '隱藏評論' }}
      </div>
    </div>
    <div class="expand" v-if="isMobileCollapsed" @click="showComments = true">顯示留言</div>
    <modal :data="reportModalData" @close="reportModalData = null" v-if="reportModalData">
      <template slot="title">
        <span>檢舉評論</span>
      </template>
      <template slot="body">
        <report-comment-form
          :comment="reportModalData"
          @submitted="reportModalData = null"
        />
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import twemoji from 'twemoji'

import Modal from '@/components/Modal'
import ReportCommentForm from '@/components/ReportCommentForm'
import { getFormattedTime, getFullDate, getRelativeDate2 } from '@/utility'

export default {
  name: 'comments',
  components: {
    Modal,
    ReportCommentForm,
  },
  props: {
    vdata: {
      type: Object,
      required: true,
    },
    player: {
      type: Object,
      required: false,
    },
    danmakuRef: {
      type: Object,
      required: false,
    },
  },
  sockets: {
    purgeMessage(msgId) {
      this.messageList = this.messageList.filter(({ id }) => id !== msgId)
    },
    newMessage(msg) {
      const message = this.normalizeMessage(msg)
      const insertAt = this.getIndexForInsert(message.time)
      this.messageList.splice(insertAt, 0, message)
      this.emitDanmaku(message)
    },
  },
  data() {
    return {
      showComments: false,
      isCollapsed: false,
      reportModalData: null,
      messageList: [],
    }
  },
  computed: {
    ...mapState([
      'user',
      'isCommentsSided',
    ]),
    isMobileCollapsed() {
      return !this.showComments && !this.isCommentsSided
    },
    roomId() {
      return this.vdata.roomId
    },
    epLength() {
      return this.vdata.epLength
    },
  },
  methods: {
    ...mapActions([
      'enqueueNotification',
    ]),
    getFormattedTime,
    getFullDate,
    getRelativeDate2,
    sendMessage() {
      const { textInput } = this.$refs
      const text = textInput.value.slice(0, 60).trim()
      if (text === '/bg') {
        console.log('switch')
        textInput.value = ''
        return
      }
      const offset = parseFloat((this.player.video.currentTime / this.epLength).toFixed(8))
      if (offset <= 0 || offset >= 1) {
        return
      }
      const shake = () => {
        textInput.className = ''
        window.requestAnimationFrame(() => {
          textInput.className = 'invalid'
          clearTimeout(textInput.ito)
          textInput.ito = setTimeout(() => {
            textInput.className = ''
            delete textInput.ito
          }, 600)
        })
      }
      if (text.length < 1) {
        shake()
        return
      }
      this.$socket.emit('send-message', { text, offset, length: this.epLength }, ({ status }) => {
        if (status === 406) {
          shake()
        } else {
          if (status === 403) {
            this.enqueueNotification({ type: 'alert', text: '你的帳號曾發表不當評論<br>因此不能再發表評論<br>如有問題，請與我們聯絡', duration: 8000 })
          } else if (status === 429) {
            this.enqueueNotification({ type: 'alert', text: '請稍候再發送', duration: 2500 })
          } else if (status !== 200) {
            console.log('cannot send message', status)
          }
          textInput.value = ''
        }
      })
    },
    // https://stackoverflow.com/a/21822316/3896501
    getIndexForInsert(time) {
      let low = 0
      let high = this.messageList.length
      while (low < high) {
        const mid = low + high >>> 1
        if (this.messageList[mid].time < time) {
          low = mid + 1
        } else {
          high = mid
        }
      }
      return low
    },
    setInitialMessages(messages) {
      this.messageList = messages.map(this.normalizeMessage)
      this.messageList.forEach(this.emitDanmaku)
    },
    emitDanmaku({ text, time }) {
      this.danmakuRef.emit(time, text)
    },
    normalizeMessage(message) {
      message.text = twemoji.parse(message.text, {
        callback: (codepoint) => {
          switch (codepoint) {
            case 'a9': // © copyright
            case 'ae': // ® registered trademark
            case '2122': // ™ trademark
            case '2642': // Male sign (Apple emoji doesn't support)
            case '2640': // Female sign (Apple emoji doesn't support)
              return false
            default:
              // return `https://twemoji.maxcdn.com/2/72x72/${codepoint}.png`
              return `/static/emoji/${codepoint}.png`
          }
        },
      })
      message.time = this.epLength * message.offset
      return message
    },
    jumpTo(time) {
      this.player.video.currentTime = Math.max(0, time - 0.5)
    },
  },
  watch: {
    roomId(newId, oldId) {
      this.$socket.emit('leave-chatroom', oldId, () => {
        this.setInitialMessages([])
        this.$socket.emit('join-chatroom', newId, ({ messages }) => {
          this.setInitialMessages(messages)
        })
      })
    },
  },
  beforeDestroy() {
    this.$socket.emit('leave-chatroom', this.roomId, () => {})
  },
  mounted() {
    this.$socket.emit('join-chatroom', this.roomId, ({ messages }) => {
      this.setInitialMessages(messages)
    })
  },
}
</script>

<style lang="scss" scoped>
.comments {
  height: 100%;
  position: relative;
  width: 22rem;

  .expand {
    background: #3f5571;
    border-radius: 12px;
    bottom: 1rem;
    color: #fff;
    cursor: pointer;
    font-size: .95rem;
    height: 2rem;
    left: 50%;
    line-height: 2rem;
    padding: 0 .8rem;
    position: absolute;
    transform: translateX(-50%);
    z-index: 1;
  }

  // tablet, break comment section
  @media (max-width: 1135px) {
    padding: 1.5rem;
    width: 100%;

    &.collapsed-mobile {
      height: 12rem;
      overflow: hidden;

      &:after {
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==") bottom repeat-x;
        bottom: 0;
        content: '';
        height: 6rem;
        left: -1.5rem;
        pointer-events: none;
        position: absolute;
        right: -1.5rem;
      }
    }
  }

  // mobile
  @media (max-width: 839px) {
    padding: .5rem;
  }
}

@keyframes shake {
  0%, 50% { background: rgba(255, 196, 192, .2); }
  10%, 90% { transform: translate3d(-1px, 0, 0);}
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.chat-block {
  background: url(../assets/g-comments.png);
  background-size: cover;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  > .inner {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    transition: opacity .1s;
    width: 100%;

    &.collapsed {
      opacity: 0;
      pointer-events: none;
      user-select: none;
    }

    .scroller {
      flex: 1;
      mask-image: linear-gradient(to bottom,
        transparent 0%,
        black 2rem,
        black calc(100% - 2rem),
        transparent 100%
      );
      -webkit-overflow-scrolling: touch;
      padding: 1.5rem 0;

      :global(object) {
        opacity: 0;
        pointer-events: none;
      }

      .chat-row {
        display: flex;
        font-size: .9rem;
        height: 35px;
        padding: 0 .5rem 0 1rem;
        align-items: center;

        > .time {
          border-right: 1px solid #528aa4;
          color: #8df;
          flex-shrink: 0;
          font-weight: bold;
          margin-right: .5rem;
          padding-right: .5rem;
          text-align: right;
          width: 3.5rem;

          > time { cursor: pointer }
        }

        > .text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          > :global(.emoji) {
            cursor: text;
            height: 20px;
          }
        }

        > .date {
          color: #aaa;
          cursor: default;
          margin-left: .5rem;
          text-align: right;
          width: 2.75rem;

          > .actions {
            display: none;
          }

          &:hover {
            > time {
              display: none;
            }

            > .actions {
              display: block;
              text-align: right;

              > i {
                color: #ffa261;
                cursor: pointer;
              }
            }
          }
        }
      }
    }

    form {
      padding: 0 1rem 1rem;
      position: relative;

      input {
        background: rgba(89, 205, 224, .1);
        height: 2rem;
        padding: 0 1rem;
        width: 100%;

        &:global(.invalid) {
          animation: shake .6s cubic-bezier(.36,.07,.19,.97);
        }
      }

      .guest-message {
        align-items: center;
        bottom: 1rem;
        display: flex;
        justify-content: center;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        user-select: none;

        > a {
          background: -webkit-linear-gradient(left, #fa9696, #ffe2ac, #f9f9ac, #a8ffbf, #b0ffff, #bbcaff, #e4a2ff);
          -webkit-background-clip: text;
          color: transparent;
          text-decoration: none;
        }
      }
    }

    // tablet, break comment section
    @media (max-width: 1135px) {
      border-radius: 8px;
      height: 24rem;
    }
  }

  .comments-collapsed {
    align-items: center;
    bottom: 0;
    display: flex;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
    z-index: -1;

    i {
      background: -webkit-linear-gradient(-45deg, #76d2e7, #907cff);
      -webkit-background-clip: text;
      color: transparent;
      font-size: 3.5rem;
    }

    h1 {
      color: #fff;
      font-size: 1.4rem;
      font-weight: 100;
      margin: 2rem 0 1rem;
    }

    span {
      color: #d0d0d0;
    }
  }

  .collapse-toggle {
    align-items: center;
    background: rgba(119, 180, 223, .1);
    color: #bdeaff;
    cursor: pointer;
    display: flex;
    font-size: .95rem;
    height: 2rem;
    justify-content: center;
    user-select: none;

    &:hover { color: #fff; }
  }
}
</style>
