<template>
  <div class="page">
    <var data-mark />
    <section class="mobile-search" v-if="isMobile">
      <search-bar />
      <portal-target slim name="search-result" />
    </section>
    <section class="desktop-search" v-if="!isMobile">
      <h1>搜尋結果</h1>
      <portal-target slim name="search-result" />
    </section>
    <portal to="search-result">
      <div class="result-container">
        <div class="message" v-if="message">
          {{ message }} 
        </div>
        <anime-list-renderer :items="searchResultAnimeList" v-if="!message" />
        <div class="info-ads" v-if="!message && !isMobile">
          <ads type="ypa_banner" :size="{ width: 620, height: 120 }" />
        </div>
      </div>
    </portal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import Ads from '@/components/Ads'
import AnimeListRenderer from '@/components/AnimeListRenderer'
import SearchBar from '@/components/SearchBar'

export default {
  name: 'search-page',
  components: {
    Ads,
    AnimeListRenderer,
    SearchBar,
  },
  computed: {
    ...mapState([
      'isMobile',
      'searchQuery',
    ]),
    ...mapGetters([
      'searchResultAnimeList',
    ]),
    message() {
      if (!this.searchQuery.length) {
        return '請輸入關鍵字～ (´･ᴗ･ ` )'
      } else if (!this.searchResultAnimeList.length) {
        return '沒有符合條件的結果呢⋯ Σ(°△° )'
      }
      return null
    },
  },
  methods: {
    ...mapActions([
      'fetchSearchResults',
    ]),
  },
  async mounted() {
    const { q: query } = this.$route.query
    if (query && !this.searchQuery) {
      // restore store's search query after user refreshes the page
      this.fetchSearchResults(query)
    }
    await this.$nextTick()
    this.$root.$emit('pageload')
  },
}
</script>

<style lang="scss" scoped>
.page {
  text-align: center;
}

.mobile-search {
  margin-top: 2rem;
}

.result-container {
  margin-top: 2rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 300;
  margin: 2rem 0;
}

.info-ads {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
