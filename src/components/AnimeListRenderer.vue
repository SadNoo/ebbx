<template>
  <ul>
    <template v-for="(anime, index) in items">
      <li v-if="adSize && index % adMod === adStartPos">
        <ads type="hpgrid_native" :size="adSize" />
      </li>
      <li :key="anime.anime_id">
        <router-link :to="{ name: 'anime', params: { animeId: anime.anime_id, seasonId: anime.season_id } }">
          <div class="image-container">
            <div class="image" :data-deferred-src="getPoster(anime)" />
          </div>
          <div class="desc">
            <h1 class="title" :title="anime.name_chi">{{ anime.name_chi }}</h1>
            <div class="meta">
              <div>季度：{{ anime.season_title }}</div>
              <div>集數：{{ anime.episode_title }}</div>
              <div>最後更新：{{ getFormattedDate(anime.last_updated) }}</div>
            </div>
          </div>
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script>
import _ from 'lodash'

import { getFormattedDate } from '@/utility'
import Ads from '@/components/Ads'

export default {
  name: 'anime-list-renderer',
  components: {
    Ads,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      adSize: null,
      resizeListener: null,
      adMod: 7,
      adStartPos: 1,
    }
  },
  watch: {
    items() {
      document.dispatchEvent(new window.Event('scroll'))
    },
  },
  methods: {
    getFormattedDate,
    getPoster(anime) {
      return `https://seaside.ebb.io/${anime.anime_id}x${anime.season_id}.jpg`
    },
  },
  mounted() {
    this.resizeListener = _.debounce(() => {
      let { width, height } = this.$el.children[0].getBoundingClientRect()
      width = Math.round(width)
      height = Math.round(height)
      this.adSize = { width, height }
    }, 150)
    window.addEventListener('resize', this.resizeListener)
    this.resizeListener()
    this.adStartPos = Math.round(Math.random() * this.adMod)
    // trigger lazy load
    document.dispatchEvent(new window.Event('scroll'))
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeListener)
  },
}
</script>

<style lang="scss" scoped>
ul {
  display: inline-block;
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

li {
  float: left;
  margin: 0 0 .5rem;
  text-align: left;
  width: 33.33%;

  > a {
    display: flex;
    height: 8rem;
    padding-left: 6rem;
    position: relative;
    text-decoration: none;
  }

  .image-container {
    background: #3a4555;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 6rem;

    .image {
      background: transparent center no-repeat;
      background-size: cover;
      height: 100%;
      width: 100%;
    }
  }

  .desc {
    background: rgba(94, 99, 124, .2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.2rem;
    padding: 1rem;
    transition: background .2s;
    width: 100%;

    &:hover {
      background: rgba(138, 157, 193, .2);
    }

    > .title {
      display: inline-block;
      font-size: 1rem;
      font-weight: 500;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    > .meta {
      color: #8ebbdc;
      font-size: .9rem;
      margin-top: 1rem;

      > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }
    }
  }

  @media (max-width: 959px) {
    width: 50%;
  }

  @media (max-width: 639px) {
    width: 100%;
  }
}
</style>
