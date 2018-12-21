<template>
  <div class="overlay-controls" @click="onOverlayClick" />
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      isMobile: (state) => state.isMobile,
    }),
    player() {
      return this.$parent
    },
  },
  methods: {
    async onOverlayClick() {
      if (this.isMobile) {
        if (this.player.isIdle) {
          this.player.isMouseOverOnControls = true
          this.player.isIdle = false
        } else {
          this.player.isMouseOverOnControls = false
          this.player.isIdle = true
        }
      } else {
        this.player.togglePlay()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.overlay-controls {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 60;
}
</style>
