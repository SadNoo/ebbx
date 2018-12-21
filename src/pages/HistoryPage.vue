<template>
  <div :class="{ page: loaded }">
    <loader v-if="!loaded" />
    <template v-if="loaded">
      <var data-mark />
      <h1>播放紀錄</h1>
      <watch-history-renderer :items="list" @remove="onRemoveHistory" />
      <div v-if="!list.length" style="text-align:center">
        <br />
        (o ˘◡˘ o) 暫無播放紀錄
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import API from '@/api'

import Loader from '@/components/Loader'
import WatchHistoryRenderer from '@/components/WatchHistoryRenderer'

export default {
  name: 'history-page',
  components: {
    Loader,
    WatchHistoryRenderer,
  },
  computed: {
    ...mapState([
      'animeList',
    ]),
  },
  data() {
    return {
      loaded: false,
      list: [],
    }
  },
  methods: {
    ...mapActions([
      'enqueueNotification',
    ]),
    async onRemoveHistory(id) {
      const { status } = await API.removeWatchHistory({ seasonId: id })
      if (status !== 200) {
        this.enqueueNotification({ type: 'alert', text: '同步播放記錄時發生錯誤', duration: 3000 })
        return
      }
      this.list = this.list.filter(({ seasonId }) => seasonId !== id)
    },
  },
  async mounted() {
    this.list = await API.fetchWatchHistory()
    this.list = this.list
      .map((row) => {
        const anime = this.animeList.find((anime) => anime.anime_id === row.animeId)
        return { ...row, anime }
      })
      // in case anime missing cant join
      .filter(({ anime }) => !!anime)
    this.loaded = true
    await this.$nextTick()
    this.$root.$emit('pageload')
    document.dispatchEvent(new window.Event('scroll'))
  },
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 1.5rem;
  font-weight: 300;
  margin: 2rem 0;
  text-align: center;
}
</style>
