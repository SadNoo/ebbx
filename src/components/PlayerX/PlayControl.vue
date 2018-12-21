<template>
  <i
    :class="`play-control fe-${player.paused ? 'play' : 'pause'}`"
    @click="player.togglePlay"
  />
</template>

<script>
export default {
  computed: {
    player() {
      return this.$parent.$parent
    },
  },
}
</script>

<style scoped lang="scss">
.play-control {
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
