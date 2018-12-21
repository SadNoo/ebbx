<template>
  <i
    :class="`fullscreen-control fe-${player.isFullscreen ? 'minimize' : 'maximize'}-2`"
    @click="toggleFullscreen"
  />
</template>

<script>
// http://blog.51cto.com/mazey/2056631

const IS_IOS = /iPad|iPhone|iPod/.test(navigator.platform)

export default {
  computed: {
    player() {
      return this.$parent.$parent
    },
  },
  methods: {
    toggleFullscreen() {
      if (IS_IOS) {
        this.player.video.webkitEnterFullscreen()
        return
      }
      // desktop
      let func
      let elem
      if (this.player.isFullscreen) {
        elem = document
        func = elem.exitFullscreen
          || elem.webkitExitFullscreen
          || elem.mozCancelFullScreen
          || elem.msExitFullscreen
      } else {
        elem = this.player.$el
        func = elem.requestFullscreen
          || elem.webkitRequestFullscreen
          || elem.mozRequestFullScreen
          || elem.msRequestFullscreen
      }
      if (func) {
        func.call(elem)
      }
    },
    onFullscreenChangeListener() {
      const elem = document.fullscreenElement
        || document.webkitFullscreenElement
        || document.mozFullScreenElement
        || document.msFullscreenElement
      if (elem) {
        // entered
        this.player.isFullscreen = true
        this.player.$el.setAttribute('style', 'width: 100vw; height: 100vh') // necessary for safari
      } else {
        // exited
        this.player.isFullscreen = false
        this.player.$el.removeAttribute('style')
      }
    },
  },
  mounted() {
    this.player.$on('signal-toggle-fullscreen', this.toggleFullscreen)

    document.addEventListener('fullscreenchange', this.onFullscreenChangeListener)
    document.addEventListener('webkitfullscreenchange', this.onFullscreenChangeListener)
    document.addEventListener('mozfullscreenchange', this.onFullscreenChangeListener)
    document.addEventListener('MSFullscreenChange', this.onFullscreenChangeListener)
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', this.onFullscreenChangeListener)
    document.removeEventListener('webkitfullscreenchange', this.onFullscreenChangeListener)
    document.removeEventListener('mozfullscreenchange', this.onFullscreenChangeListener)
    document.removeEventListener('MSFullscreenChange', this.onFullscreenChangeListener)
  },
}
</script>

<style scoped lang="scss">
.fullscreen-control {
  cursor: pointer;
  display: inline-block;
  font-size: 1.6rem;
  height: 3rem;
  line-height: 3rem;
  pointer-events: all;
  text-align: center;
  width: 3rem;
}
</style>
