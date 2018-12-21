<template>
  <div
    :class="{ 'volume-control': true, hovering: volumeControlHovering || volumeSliderDowned }"
    @mouseenter="onVolumeControlMouseEnter"
    @mouseleave="onVolumeControlMouseLeave"
  >
    <i :class="`fe-${volumeIcon}`" @click="toggleMute" />
    <div
      class="volume-slider"
      ref="volumeSlider"
      @mousedown="onVolumeSliderMouseDown"
    >
      <div class="volume-slider-handle" ref="volumeHandle" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

const SLIDER_WIDTH = 60
const HANDLE_WIDTH = 12

export default {
  data() {
    return {
      volumeControlHovering: false,
      volumeSliderDowned: false,
      volumeIcon: null,
      isMuted: false,
    }
  },
  computed: {
    ...mapState({
      playerConfig: (state) => state.playerConfig,
    }),
    player() {
      return this.$parent.$parent
    },
    video() {
      return this.player.video
    },
  },
  methods: {
    ...mapActions([
      'updatePlayerConfig',
    ]),
    onVolumeControlMouseEnter() {
      this.volumeControlHovering = true
    },
    onVolumeControlMouseLeave() {
      this.volumeControlHovering = false
    },
    onVolumeSliderMouseDown() {
      this.volumeSliderDowned = true
      this.var__volumeSliderRect = this.$refs.volumeSlider.getBoundingClientRect()
      document.addEventListener('mousemove', this.onDocumentMouseMove)
      document.addEventListener('mouseup', this.onDocumentMouseUp)
    },
    updateOnSliderChange(event) {
      // prevent selection occurs
      event.preventDefault()
      let percentage = (event.pageX - this.var__volumeSliderRect.left) / SLIDER_WIDTH
      percentage = Math.max(0, percentage)
      percentage = Math.min(1, percentage)
      this.video.volume = percentage
      if (percentage === 0) {
        // set muted and unmute at half volume
        this.isMuted = true
        this.savedVolume = 0.5
      } else {
        // reset mute state
        this.isMuted = false
      }
    },
    onDocumentMouseMove(event) {
      this.updateOnSliderChange(event)
    },
    onDocumentMouseUp(event) {
      this.updateOnSliderChange(event)
      this.volumeSliderDowned = false
      // remove listeners
      document.removeEventListener('mousemove', this.onDocumentMouseMove)
      document.removeEventListener('mouseup', this.onDocumentMouseUp)
    },
    onVolumeChangeListener() {
      const { volume } = this.video
      let left = (SLIDER_WIDTH * volume) - (HANDLE_WIDTH / 2)
      left = Math.max(left, 0)
      left = Math.min(left, SLIDER_WIDTH - HANDLE_WIDTH)
      this.$refs.volumeHandle.style.left = `${left}px`
      // update icon
      if (volume === 0) {
        this.volumeIcon = 'volume-off'
      } else if (volume < 0.5) {
        this.volumeIcon = 'volume-1'
      } else {
        this.volumeIcon = 'volume-2'
      }
      // save config
      this.updatePlayerConfig({ key: 'volume', value: volume })
    },
    toggleMute() {
      if (this.isMuted) {
        this.isMuted = false
        this.video.volume = this.savedVolume
      } else {
        this.isMuted = true
        this.savedVolume = this.video.volume
        this.video.volume = 0
      }
    },
  },
  mounted() {
    this.player.$on('signal-toggle-mute', this.toggleMute)

    this.video.addEventListener('volumechange', this.onVolumeChangeListener)
    if (this.video.volume !== this.playerConfig.volume) {
      // set initial volume
      this.video.volume = this.playerConfig.volume
    } else {
      // trigger volume change
      this.onVolumeChangeListener()
    }
  },
  beforeDestroy() {
    this.video.removeEventListener('volumechange', this.onVolumeChangeListener)
  },
}
</script>

<style scoped lang="scss">
.volume-control {
  cursor: pointer;
  display: inline-block;
  font-size: 0; // fix unwanted padding between inline blocks
  height: 3rem;
  overflow: hidden;
  pointer-events: all;
  transition: width .2s;
  white-space: nowrap;
  width: 3rem;

  &.hovering {
    width: calc(3rem + 60px + 1rem);
  }

  > i {
    display: inline-block;
    font-size: 1.6rem;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    vertical-align: top;
    width: 3rem;
  }
}

.volume-slider {
  display: inline-block;
  height: 3rem;
  margin-right: 1rem; // padding
  overflow: hidden;
  position: relative;
  width: 60px;

  &:after {
    background: #aaa;
    content: '';
    height: 4px;
    left: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 60px;
    z-index: 0;
  }

  .volume-slider-handle {
    background: #fff;
    border-radius: 50%;
    height: 12px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    z-index: 1;

    &:after {
      background: #fff;
      content: '';
      height: 4px;
      position: absolute;
      right: calc(100% - 12px / 2);
      top: 50%;
      transform: translateY(-50%);
      width: 60px;
      z-index: 0;
    }
  }
}
</style>
