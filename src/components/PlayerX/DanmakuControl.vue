<template>
  <i
    :class="`danmaku-control fe-${showDanmaku ? 'comment-outline-off' : 'comment-outline'}`"
    @click="toggleDanmaku"
  />
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      showDanmaku: (state) => state.playerConfig.danmaku,
    }),
  },
  methods: {
    ...mapActions([
      'updatePlayerConfig',
    ]),
    toggleDanmaku() {
      this.updatePlayerConfig({ key: 'danmaku', value: !this.showDanmaku })
    },
  },
}
</script>

<style scoped lang="scss">
.danmaku-control {
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
