<template>
  <ul>
    <li v-for="history in items" :key="history.seasonId">
      <router-link :to="{ name: 'anime', params: { animeId: history.animeId, seasonId: history.seasonId, autoPlay: true } }">
        <div class="image-container">
          <div class="image" :data-deferred-src="getPoster(history)" />
        </div>
        <div class="desc">
          <h2 class="title" :title="history.anime.name_chi">{{ history.anime.name_chi }}</h2>
          <div class="meta">
            <div>{{ history.seasonTitle }} {{ history.episodeTitle }} ({{ getFormattedTime(history.startTime) }})</div>
            <div>最後播放：{{ getRelativeDate(history.lastPlayed) }}</div>
          </div>
        </div>
      </router-link>
      <div class="remove" @click="$emit('remove', history.seasonId)">
        <i class="fe-x" />
      </div>
    </li>
  </ul>
</template>

<script>
import { getFormattedTime, getRelativeDate } from '@/utility'

export default {
  name: 'watch-history-renderer',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getFormattedTime,
    getRelativeDate,
    getPoster({ animeId, seasonId }) {
      return `https://seaside.ebb.io/${animeId}x${seasonId}.jpg`
    },
  },
  watch: {
    items() {
      document.dispatchEvent(new window.Event('scroll'))
    },
  },
  mounted() {
    // trigger lazy load
    document.dispatchEvent(new window.Event('scroll'))
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
  position: relative;
  width: 33.33%;

  > a {
    display: flex;
    height: 8rem;
    padding-left: 6rem;
    position: relative;
    text-decoration: none;
  }

  .image-container {
    background: #30353f;
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

  @media (max-width: 1079px) {
    width: 50%;
  }

  @media (max-width: 719px) {
    width: 100%;
  }

  > .remove {
    align-items: center;
    background: rgba(0, 0, 0, .25);
    cursor: pointer;
    display: flex;
    font-size: 1.2rem;
    height: 3rem;
    justify-content: center;
    position: absolute;
    right: 0;
    top: 0;
    width: 3rem;

    &:hover {
      background: rgba(128, 128, 128, .2);
    }
  }
}
</style>
