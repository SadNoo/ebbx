<template>
  <div class="lighting-control">
    <i
      :class="`fe-${player.isLightOff ? 'sun' : 'moon'}`"
      @click="player.isLightOff = !player.isLightOff"
    />
    <portal to="curtain">
      <div class="curtain" v-if="player.isLightOff" />
    </portal>
  </div>
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
.lighting-control > i {
  cursor: pointer;
  display: inline-block;
  font-size: 1.6rem;
  height: 3rem;
  line-height: 3rem;
  pointer-events: all;
  text-align: center;
  width: 3rem;
}

.curtain {
  background: rgba(0, 0, 0, .8);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 2;
}
</style>
