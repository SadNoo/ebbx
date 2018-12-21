<template>
  <div class="seek-bar">
    <div :class="{ 'seek-preview': true, visible: seekAreaDowned }" ref="seekPreview" />
    <div class="bar">
      <span class="played" ref="progressBarPlayed" />
      <span class="buffered" ref="progressBarBuffered" />
    </div>
    <figure :class="{ preview: true, hidden: !seekAreaHovering && !seekAreaDowned }" ref="peek">
      <div class="peek" ref="peekImage" />
      <time ref="timeDisplayPeek">-:--</time>
    </figure>
    <div class="seek-area"
      ref="seekArea"
      @mouseenter="onSeekAreaMouseEnter"
      @mouseleave="onSeekAreaMouseLeave"
      @mousedown="onSeekAreaMouseDown"
      @mousemove="onSeekAreaMouseMove"
    />
    <div class="chrome-controls">
      <div class="left">
        <play-control />
        <volume-control v-if="!isMobile" />
        <span class="time-display">
          <time ref="timeDisplayCurrentTime">-:--</time>
          {{ ' / ' }}
          <time ref="timeDisplayDuration">-:--</time>
        </span>
      </div>
      <div class="right">
        <player-settings v-if="!isMobile" />
        <snapshot-control v-if="!isMobile" />
        <danmaku-control />
        <lighting-control v-if="!isMobile" />
        <fullscreen-control />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getFormattedTime } from '@/utility'

import PlayControl from './PlayControl'
import VolumeControl from './VolumeControl'
import PlayerSettings from './PlayerSettings'
import SnapshotControl from './SnapshotControl'
import LightingControl from './LightingControl'
import DanmakuControl from './DanmakuControl'
import FullscreenControl from './FullscreenControl'

const PEEK_PREVIEW_WIDTH = 160

export default {
  components: {
    PlayControl,
    VolumeControl,
    PlayerSettings,
    SnapshotControl,
    LightingControl,
    DanmakuControl,
    FullscreenControl,
  },
  data() {
    // Don't use to update time display, progress bar, etc.
    // Manipulating DOM directly is more efficient than Vue reactivity system.
    return {
      seekAreaHovering: false,
      seekAreaDowned: false,
      resumeVideoOnMouseUp: false,
    }
  },
  computed: {
    ...mapState({
      isMobile: (state) => state.isMobile,
    }),
    player() {
      return this.$parent
    },
    video() {
      return this.player.video
    },
  },
  methods: {
    onSeekAreaMouseEnter() {
      this.seekAreaHovering = true
    },
    onSeekAreaMouseLeave() {
      this.seekAreaHovering = false
    },
    onSeekAreaMouseDown({ offsetX, target: { clientWidth } }) {
      this.seekAreaDowned = true
      if (!this.video.paused) {
        this.video.pause()
        this.resumeVideoOnMouseUp = true
      }
      const { progressBarPlayed, seekArea, seekPreview } = this.$refs
      this.var__videoRect = this.video.getBoundingClientRect()
      this.var__seekAreaRect = seekArea.getBoundingClientRect()
      window.requestAnimationFrame(() => {
        // update progress bar, seek preview to follow seeking
        progressBarPlayed.style.width = `${(offsetX / clientWidth) * 100}%`
        seekPreview.style.backgroundSize = `${this.var__videoRect.width * 100}px ${this.var__videoRect.height}px`
        seekPreview.style.backgroundPosition = `${Math.floor((offsetX / clientWidth) * 100) * -this.var__videoRect.width}px`
      })
      document.addEventListener('mousemove', this.onDocumentMouseMove)
      document.addEventListener('mouseup', this.onDocumentMouseUp)
    },
    onDocumentMouseMove(event) {
      // prevent selection occurs
      event.preventDefault()
      const { seekArea } = this.$refs
      const offsetX = event.pageX - this.var__seekAreaRect.left
      this.repositionSeekPreview(offsetX, seekArea.clientWidth)
      // update progress bar, seek preview to follow seeking
      this.$refs.progressBarPlayed.style.width = `${(offsetX / seekArea.clientWidth) * 100}%`
      this.$refs.seekPreview.style.backgroundPosition = `${Math.floor((offsetX / seekArea.clientWidth) * 100) * -this.var__videoRect.width}px`
    },
    onDocumentMouseUp({ offsetX, target: { clientWidth } }) {
      this.seekAreaDowned = false
      document.removeEventListener('mouseup', this.onDocumentMouseUp)
      document.removeEventListener('mousemove', this.onDocumentMouseMove)
      if (this.resumeVideoOnMouseUp) {
        this.video.play()
        this.resumeVideoOnMouseUp = false
      }
      const seekTime = (offsetX / clientWidth) * this.video.duration
      this.video.currentTime = seekTime
      // sync history
      this.player.syncWatchHistory(true)
    },
    onSeekAreaMouseMove({ offsetX, target: { clientWidth } }) {
      if (!this.seekAreaHovering) {
        return
      }
      this.repositionSeekPreview(offsetX, clientWidth)
    },
    repositionSeekPreview(offsetX, clientWidth) {
      // update peek to follow seeking
      const progress = offsetX / clientWidth
      let offset = offsetX - (PEEK_PREVIEW_WIDTH / 2)
      offset = Math.max(offset, 0)
      offset = Math.min(offset, clientWidth - PEEK_PREVIEW_WIDTH)
      this.$refs.peek.style.left = `${offset}px`
      this.$refs.timeDisplayPeek.innerHTML = getFormattedTime(progress * this.video.duration)
      this.$refs.peekImage.style.backgroundPosition = `${Math.floor(progress * 100) * -PEEK_PREVIEW_WIDTH}px`
    },
    onTimeUpdateListener() {
      const { currentTime, duration } = this.video
      this.$refs.timeDisplayCurrentTime.innerHTML = getFormattedTime(currentTime)
      this.$refs.timeDisplayDuration.innerHTML = getFormattedTime(duration)
      this.$refs.progressBarPlayed.style.width = `${(currentTime / duration) * 100}%`
    },
    onProgressListener() {
      const { buffered, currentTime, duration } = this.video
      // https://developer.mozilla.org/en-US/docs/Web/Apps/Fundamentals/Audio_and_video_delivery/buffering_seeking_time_ranges
      // find the buffered block within current time
      let block = null
      for (let i = 0; i < buffered.length; i += 1) {
        const start = buffered.start(i)
        const end = buffered.end(i)
        if (start <= currentTime && currentTime <= end) {
          block = { start, end }
        }
      }
      if (!block) {
        this.$refs.progressBarBuffered.style.width = '0%'
        return
      }
      const { start: _, end } = block
      const loaded = (end / duration) * 100
      this.$refs.progressBarBuffered.style.width = `${loaded}%`
    },
  },
  watch: {
    'player.peekSrc': {
      immediate: true,
      async handler(src) {
        await this.$nextTick()
        const { peekImage, seekPreview } = this.$refs
        const image = new Image()
        image.onload = () => {
          const { width, height } = image
          const ratio = (width / 100) / height
          const thumbnailHeight = PEEK_PREVIEW_WIDTH / ratio
          seekPreview.style.backgroundImage = `url(${src})`
          peekImage.style.backgroundImage = `url(${src})`
          peekImage.style.backgroundSize = `${PEEK_PREVIEW_WIDTH * 100}px ${thumbnailHeight}px`
          peekImage.style.width = `${PEEK_PREVIEW_WIDTH}px`
          peekImage.style.height = `${thumbnailHeight}px`
        }
        image.src = src
      },
    },
  },
  mounted() {
    this.video.addEventListener('timeupdate', this.onTimeUpdateListener)
    this.video.addEventListener('progress', this.onProgressListener)
  },
  beforeDestroy() {
    this.video.removeEventListener('timeupdate', this.onTimeUpdateListener)
    this.video.removeEventListener('progress', this.onProgressListener)
  },
}
</script>

<style scoped lang="scss">
.seek-bar {
  align-items: flex-end;
  bottom: 0;
  color: #fff;
  display: flex;
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  text-shadow: 0 2px 4px #222;
  top: 0;
  z-index: 80;

  &:after {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==) bottom repeat-x;
    bottom: 0;
    content: '';
    height: 6rem;
    left: 0;
    position: absolute;
    right: 0;
    z-index: -1;
  }
}

.seek-preview {
  bottom: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity .1s .1s;
  z-index: 1;

  &.visible {
    opacity: 1;
  }

  &:after {
    background: rgba(0, 0, 0, .4);
    content: '';
    height: 100%;
    position: absolute;
    width: 100%;
  }
}

.bar {
  background: rgba(255, 255, 255, .1);
  display: flex;
  height: 2px;
  overflow: hidden;
  position: relative;
  width: 100%;
  z-index: 20;

  > span {
    height: 100%;
    left: 0;
    position: absolute;
  }

  .played {
    background: url(../../assets/g-progress.png);
    background-size: 100% 100%;
    z-index: 2;
  }

  .buffered {
    background: #999;
    z-index: 1;
  }
}

.preview {
  border-radius: 6px;
  bottom: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .5);
  margin: 0;
  overflow: hidden;
  position: absolute;
  transition: opacity .1s;
  z-index: 30;

  &.hidden {
    opacity: 0;
  }

  time {
    background: rgba(0, 0, 0, .8);
    border-radius: 6px 6px 0 0;
    bottom: 0;
    left: 50%;
    padding: 0 6px;
    position: absolute;
    transform: translateX(-50%);
  }
}

.seek-area {
  bottom: 0;
  cursor: pointer;
  height: 1.5rem;
  left: 0;
  pointer-events: all;
  position: absolute;
  right: 0;
  z-index: 10;
}

.chrome-controls {
  bottom: 1.5rem;
  display: flex;
  height: 3rem;
  left: 0;
  position: absolute;
  right: 0;
  z-index: 20;

  .left,
  .right {
    align-items: center;
    display: flex;
  }

  .left {
    flex: 1;
    justify-content: flex-start;
    padding-left: 2rem;

    // mobile
    @media (max-width: 839px) {
      padding-left: 1rem;
    }
  }

  .right {
    justify-content: flex-end;
    padding-right: 2rem;

    // mobile
    @media (max-width: 839px) {
      padding-right: 1rem;
    }
  }

  .time-display {
    padding-left: 1rem;
  }
}
</style>
