<template>
  <div class="page" v-if="sbiResult">
    <var data-mark />
    <h1>搜尋結果</h1>
    <div class="result">
      <div class="preview">
        <img alt="preview" :src="this.sbiResult.preview" />
      </div>
      <div class="meta">
        <h1>{{ sbiResult.nameChi }}</h1>
        <h2>{{ sbiResult.nameJpn }}</h2>
        <div class="details">
          <span>
            相似度：<span :style="{ color: getColor(+sbiResult.score / 100) }">{{ sbiResult.score }}%</span>
          </span>
          <span v-if="String(sbiResult.ep).length > 0">集數：{{ sbiResult.ep }}</span>
          <span>時間：{{ getFormattedTime(sbiResult.at) }}</span>
        </div>
      </div>
    </div>
    <div class="local-result">
      <h1>ebb 上的相近結果</h1>
      <anime-list-renderer :items="localResults" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import { Base64 } from 'js-base64'
import { getFormattedTime } from '@/utility'
import distance from 'jaro-winkler'

import AnimeListRenderer from '@/components/AnimeListRenderer'

export default {
  name: 'what-anime-page',
  components: {
    AnimeListRenderer,
  },
  data() {
    return {
      sbiResult: null,
    }
  },
  computed: {
    ...mapState([
      'animeList',
    ]),
    localResults() {
      const scoredJpn = this.animeList.map((row) => {
        const score = distance(this.sbiResult.nameJpn, row.name_jpn)
        return { ...row, score }
      })
      scoredJpn.sort((a, b) => b.score - a.score)

      const scoredChi = this.animeList.map((row) => {
        const score = distance(this.sbiResult.nameChi, row.name_chi)
        return { ...row, score }
      })
      scoredChi.sort((a, b) => b.score - a.score)

      const result = [scoredJpn[0], scoredChi[0]]
      result.sort((a, b) => b.score - a.score)

      return _.uniqBy(result, 'season_id')
    },
  },
  methods: {
    getFormattedTime,
    getColor(value) {
      // value from 0 to 1
      const hue = (value * 120).toString(10)
      return `hsl(${hue}, 100%, 70%)`
    },
    async decodeResult(query) {
      try {
        const { payload } = query
        const {
          at, ep, nameChi, nameJpn, preview, score,
        } = JSON.parse(Base64.decode(payload))
        this.sbiResult = { at, ep, nameChi, nameJpn, preview, score }
        await this.$nextTick()
        this.$root.$emit('pageload')
      } catch (error) {
        // 404
        this.$router.replace({ path: '/404' })
      }
    },
  },
  watch: {
    $route({ query }) {
      this.decodeResult(query)
    },
  },
  mounted() {
    this.decodeResult(this.$route.query)
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

.result {
  display: flex;
  justify-content: center;
  padding-top: 2rem;

  .preview > img {
    vertical-align: top;
    width: 100%;
  }

  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 2rem;

    h1, h2 {
      color: #a2c9df;
      font-weight: 300;
      margin: 0;
      text-align: left;
    }

    h1 {
      font-size: 1.75rem;
      line-height: 3rem;
    }
    h2 {
      color: #b6b6b6;
      font-size: 1.2rem;
      line-height: 2rem;
    }

    .details {
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
    }
  }
}

.local-result {
  margin: 1rem 0;

  > h1 {
    margin-top: 3rem;
  }
}

// mobile
@media (max-width: 839px) {
  .result {
    align-items: center;
    flex-direction: column;
    padding: 0;

    .preview {
      width: 100%;
    }

    .meta {
      margin: 0;
      width: 100%;

      h1, h2 {
        background: #000;
        line-height: 2rem;
        padding: .5rem;
      }
      h1 {
        font-size: 1.5rem;
        padding-top: 1rem;
        padding-bottom: 0;
      }
      h2 {
        color: #b6b6b6;
        font-size: 1.1rem;
      }
      .details {
        flex-direction: row;
        justify-content: space-around;
        padding: 0 .5rem;
      }
    }
  }
}
</style>
