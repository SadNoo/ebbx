<template>
  <div>
    <i
      :class="{ 'player-settings': true, 'fe-settings': true, expanded: settingsExpanded }"
      @click="settingsExpanded = !settingsExpanded"
    />
    <portal to="player-settings">
      <div
        ref="settings"
        :class="{ settings: true, prepared: currentRect }"
        v-if="settingsExpanded"
      >
        <div class="menu" v-if="!currentMenu">
          <div
            v-for="(menu, title) in menuList"
            @click="currentMenu = title"
            :key="title"
            class="menu-item"
          >
            <div class="menu-title">{{ title }}</div>
            <div class="menu-value">{{ getMenuValue(title) }}</div>
          </div>
        </div>
        <div class="menu" v-else>
          <div class="menu-back" @click="currentMenu = null">
            <i class="fe-chevron-left" />
            {{ currentMenu }}
          </div>
          <div
            v-for="(value, key) in menuList[currentMenu]"
            @click="updatePlayerSettings(currentMenu, value)"
            :key="key"
            class="menu-item"
          >
            <div class="menu-option">
              <i class="menu-option-selected fe-check" v-if="getMenuValue(currentMenu) === key" />
              {{ key }}
            </div>
          </div>
        </div>
      </div>
    </portal>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import { sleep } from '@/utility'

export default {
  data() {
    return {
      currentRect: null,
      settingsExpanded: false,
      currentMenu: null,
      menuList: {
        Speed: {
          '0.25x': 0.25,
          '0.5x': 0.5,
          '0.75x': 0.75,
          '1x': 1,
          '1.25x': 1.25,
          '1.5x': 1.5,
          '2x': 2,
        },
      },
      playbackRate: 1,
    }
  },
  computed: {
    ...mapState({
      playerConfig: (state) => state.playerConfig,
    }),
    video() {
      return this.$parent.$parent.video
    },
    menuListInverted() {
      const inverted = {}
      Object.keys(this.menuList).forEach((key) => {
        inverted[key] = _.invert(this.menuList[key])
      })
      return inverted
    },
  },
  methods: {
    ...mapActions([
      'updatePlayerConfig',
    ]),
    onClickAnywhereListener(event) {
      let elem = event.target
      let traversed = 0
      while (traversed < 5 && elem && elem !== this.$refs.settings) {
        elem = elem.parentNode
        traversed += 1
      }
      if (elem !== this.$refs.settings) {
        // prevent clicked element receiving click event
        // [useCapture] must be set to true in addEventListener
        // https://stackoverflow.com/a/38861760/3896501
        event.stopPropagation()
        // not clicking on menu, close settings
        this.settingsExpanded = false
      }
    },
    onRateChangeListener() {
      this.playbackRate = this.video.playbackRate
    },
    getMenuValue(title) {
      if (title === 'Speed') {
        return this.menuListInverted[title][this.playbackRate]
      }
      return null
    },
    async calculateRect() {
      // store old rect before update
      let oldRect
      if (this.$refs.settings) {
        oldRect = this.$refs.settings.getBoundingClientRect()
      }
      // wait for next render
      await this.$nextTick()
      const { settings } = this.$refs
      if (!settings) {
        // player settings closed
        this.currentRect = null
        return
      }
      // reset all rect and wait for size update
      settings.removeAttribute('style')
      this.currentRect = null
      await this.$nextTick()
      // get updated size after render
      this.currentRect = settings.getBoundingClientRect()
      if (oldRect) {
        // animate
        settings.setAttribute('style', `width: ${oldRect.width}px; height: ${oldRect.height}px`)
        await sleep(0)
        settings.setAttribute('style', `width: ${this.currentRect.width}px; height: ${this.currentRect.height}px`)
        await sleep(200)
        settings.removeAttribute('style')
      }
    },
    updatePlayerSettings(key, value) {
      switch (key) {
        case 'Speed': {
          this.playbackRate = value
          break
        }
        default: {
          break
        }
      }
      // exit menu after config
      this.currentMenu = null
    },
  },
  watch: {
    settingsExpanded(expanded) {
      if (expanded) {
        this.calculateRect()
        this.$parent.$parent.stayAwake = true
        document.addEventListener('click', this.onClickAnywhereListener, true)
      } else {
        // closed, reset menu
        this.currentMenu = null
        this.$parent.$parent.stayAwake = false
        document.removeEventListener('click', this.onClickAnywhereListener, true)
      }
    },
    currentMenu() {
      this.calculateRect()
    },
    playbackRate(value) {
      this.video.playbackRate = value
      this.updatePlayerConfig({ key: 'rate', value })
    },
  },
  mounted() {
    this.video.addEventListener('ratechange', this.onRateChangeListener)
    if (this.video.playbackRate !== this.playerConfig.rate) {
      // set initial playback rate
      this.video.playbackRate = this.playerConfig.rate
    } else {
      // trigger rate change
      this.onRateChangeListener()
    }
  },
  beforeDestroy() {
    this.video.removeEventListener('ratechange', this.onRateChangeListener)
  },
}
</script>

<style scoped lang="scss">
.player-settings {
  cursor: pointer;
  display: inline-block;
  font-size: 1.6rem;
  height: 3rem;
  line-height: 3rem;
  pointer-events: all;
  text-align: center;
  transition: transform .2s;
  width: 3rem;

  &.expanded {
    transform: rotate(25deg);
  }
}

.settings {
  background: rgba(28, 28, 28, .9);
  border-radius: 4px;
  bottom: calc(1.5rem + 3rem);
  box-shadow: 0 2px 4px rgba(0, 0, 0, .4);
  color: #fff;
  overflow: hidden;
  position: absolute;
  right: 2rem;
  transition: width .2s, height .2s;
  z-index: 66;

  &:not(.prepared) {
    opacity: 0;
    pointer-events: none;
  }

  .menu {
    padding: .5rem 0;

    .menu-back {
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, .2);
      cursor: pointer;
      display: flex;
      font-weight: bold;
      height: calc(2rem + .5rem);
      margin-bottom: .5rem;
      padding: 0 1rem .5rem;

      > i {
        text-align: left;
        width: 2rem;
      }
    }

    .menu-item {
      align-items: center;
      cursor: pointer;
      display: flex;
      height: 2rem;
      padding: 0 1rem;
      position: relative;

      &:hover {
        background: rgba(255, 255, 255, .1);
      }

      .menu-title {
        font-weight: bold;
        width: 6rem;
      }

      .menu-value {
        text-align: right;
        width: 6rem;
      }

      .menu-option {
        padding-left: 2rem;
        width: 7rem;

        .menu-option-selected {
          align-items: center;
          display: flex;
          height: 2rem;
          justify-content: center;
          left: 0;
          position: absolute;
          top: 0;
          width: 3rem;
        }
      }
    }
  }
}
</style>
