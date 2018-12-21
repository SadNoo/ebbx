<template>
  <div class="up-next">
    <div class="inner">
      <template v-if="hasNextEpisode">
        <h2>即將放映</h2>
        <h1>{{ nextEpisodeTitle }}</h1>
        <div class="loader">
          <svg :width="loaderSize" :height="loaderSize" viewPort="0 0 100 100">
            <circle
              r="45%" cx="50%" cy="50%" fill="none"
              stroke-width="4"
              stroke="rgba(224, 224, 224, .4)"
              :stroke-dasharray="dashArray"
              :stroke-dashoffset="0"
            />
            <circle
              r="45%" cx="50%" cy="50%" fill="none"
              stroke-width="4"
              stroke="#fff"
              :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"
            />
          </svg>
          <i class="fe-x" @click="player.showUpNextOverlay = false" />
        </div>
      </template>
      <template v-else>
        <h1>找不到下一集了 (・_・;)</h1>
      </template>
    </div>
  </div>
</template>

<script>
// https://stackoverflow.com/a/44007797/3896501
export default {
  data() {
    return {
      loaderSize: 64,
      percentage: 0,
    }
  },
  computed: {
    player() {
      return this.$parent
    },
    radius() {
      return this.loaderSize * 0.45
    },
    dashArray() {
      return 2 * this.radius * Math.PI
    },
    dashOffset() {
      const c = Math.PI * (this.radius * 2)
      const offset = (1 - this.percentage) * c
      return offset
    },
    nextEpisodeTitle() {
      const { activeSeason, nextEpisode } = this.player.pageComponent
      return `${activeSeason.season_title} ${nextEpisode.title}`
    },
    hasNextEpisode() {
      return !!this.player.pageComponent.nextEpisode
    },
  },
  watch: {
    percentage(pcnt) {
      if (pcnt === 1) {
        const { nextEpisode } = this.player.pageComponent
        this.player.pageComponent.play(nextEpisode, true)
      }
    },
  },
  mounted() {
    if (!this.hasNextEpisode) {
      return
    }
    const duration = 1000 * 3.5
    const end = Date.now() + duration
    const step = () => {
      const remaining = end - Date.now()
      if (remaining < 60) {
        // animation ended
        this.percentage = 1
        return
      }
      const rate = 1 - (remaining / duration)
      this.percentage = rate
      window.requestAnimationFrame(step)
    }
    step()
  },
}
</script>

<style scoped lang="scss">
.up-next {
  align-items: center;
  background: rgba(0, 0, 0, .75);
  bottom: 0;
  color: #fff;
  display: flex;
  justify-content: center;
  left: 0;
  padding-bottom: 4rem;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  z-index: 75;
}

.inner {
  h1,
  h2 {
    font-weight: normal;
    margin: 0;
  }

  h2 {
    color: #ccc;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin: 2rem 0;
  }

  .loader {
    display: inline-block;
    position: relative;

    svg {
      transform: rotate(-90deg);
      vertical-align: top;
    }

    > i {
      align-items: center;
      border-radius: 50%;
      bottom: 0;
      cursor: pointer;
      display: flex;
      font-size: 2rem;
      justify-content: center;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;

      &:active { color:  #999; }
    }
  }
}
</style>
