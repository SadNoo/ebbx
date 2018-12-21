<template>
  <div class="danmaku-container" ref="danmakuContainer" :style="{ display: showDanmaku ? 'block' : 'none' }" />
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'lodash/debounce'
import Danmaku from 'danmaku'

export default {
  name: 'danmaku',
  props: {
    onReference: {
      type: Function,
      required: true,
    },
    player: {
      type: Object,
      required: false,
    },
    vdata: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      danmaku: null,
      resizeListener: null,
    }
  },
  computed: {
    ...mapState({
      showDanmaku: (state) => state.playerConfig.danmaku,
    }),
  },
  methods: {
    async recreate() {
      if (this.danmaku) {
        this.$refs.danmakuContainer.removeChild(this.danmaku.stage)
        this.danmaku.destroy()
        this.danmaku = null
      }
      // wait for next render size changes
      await this.$nextTick()
      this.danmaku = new Danmaku({
        container: this.$refs.danmakuContainer,
        video: this.player.video,
      })
    },
    emit(time, text) {
      if (!this.danmaku) {
        return
      }
      this.danmaku.emit({
        time,
        render() {
          const div = document.createElement('div')
          div.className = 'danmaku'
          div.innerHTML = text
          return div
        },
      })
    },
  },
  watch: {
    vdata() {
      this.recreate()
    },
  },
  mounted() {
    this.onReference(this)
    this.recreate()
    this.resizeListener = debounce(() => {
      if (this.danmaku) {
        this.danmaku.resize()
      }
    }, 100)
    window.addEventListener('resize', this.resizeListener)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeListener)
  },
}
</script>

<style scoped lang="scss">
.danmaku-container {
  bottom: 5rem; // player controls
  left: 0;
  opacity: .9;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  user-select: none;

  :global(.danmaku) {
    color: #fff;
    font-size: 2rem;
    height: calc(2rem * 1.4);
    line-height: calc(2rem * 1.4);
    text-shadow: 0 -1px #4d4d4d,
                 0 1px #4d4d4d,
                 -1px 0 #4d4d4d,
                 1px 0 #4d4d4d,
                 0 0 5px #2d2d2d;

    // tablet, break comment section
    @media (max-width: 1135px) {
      font-size: 1.75rem;
      height: calc(1.75rem * 1.4);
      line-height: calc(1.75rem * 1.4);
    }

    // mobile
    @media (max-width: 839px) {
      font-size: 1.5rem;
      height: calc(1.5rem * 1.4);
      line-height: calc(1.5rem * 1.4);
    }
  }

  :global(.danmaku img) {
    height: 2rem;
    vertical-align: middle;

    // tablet, break comment section
    @media (max-width: 1135px) {
      height: 1.75rem;
    }

    // mobile
    @media (max-width: 839px) {
      height: 1.5rem;
    }
  }

  :global(> div > div) {
    will-change: transform;
  }
}
</style>
