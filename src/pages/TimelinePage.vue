<template>
  <div class="timeline">
    <div class="anime-list">
      <loader v-if="loading" />
      <div v-if="!loading && animeList.length < 1">
        ( ; ω ; ) 本季度暫時未有任何動畫...
      </div>
      <coverflow
        v-if="!loading && animeList.length > 0"
        :items="animeList"
        :meta-prefix="`現正顯示 ${activeNode[0]} ${seasonLabel[activeNode[1]]}季動畫`"
      />
    </div>
    <plark>
      <div class="selector">
        <div class="year" v-for="year in reversedTimeKeys" :key="year">
          <div class="seasons">
            <div
              v-for="season in yearData[year]"
              :key="season"
              :style="getStyles(year, season)"
              :class="{ current: year === activeNode[0] && season === activeNode[1] }"
              @click="reloadList(year, season)"
            >
              <span>{{ seasonLabel[season] }}</span>
            </div>
          </div>
          <h3>{{ year }}</h3>
        </div>
      </div>
    </plark>
  </div>
</template>

<script>
import { hsl2rgb } from 'color-functions'
import API from '@/api'

import Coverflow from '@/components/Coverflow'
import Loader from '@/components/Loader'
import Plark from '@/components/Plark'

export default {
  name: 'timeline-page',
  components: {
    Coverflow,
    Loader,
    Plark,
  },
  data() {
    const date = new Date()
    const fromYear = '1996'
    const toYear = date.getFullYear().toString()
    let yearData = [...new Array(+toYear - +fromYear)].map((_, i) => +fromYear + i)
    yearData = yearData.reduce((accumulator, year) => ({
      ...accumulator,
      [year]: ['3', '2', '1', '0'],
    }), {})
    yearData[toYear] = [...new Array(Math.ceil((date.getMonth() + 1) / 3))]
      .map((_, i) => String(i)).reverse()
    return {
      fromYear,
      toYear,
      yearData,
      seasonLabel: {
        0: '冬', // 1月
        1: '春', // 4月
        2: '夏', // 7月
        3: '秋', // 10月
      },
      activeNode: [toYear, yearData[toYear][0]],
      animeList: [],
      loading: true,
    }
  },
  computed: {
    reversedTimeKeys() {
      return Object.keys(this.yearData).sort().reverse()
    },
  },
  methods: {
    getStyles(year, season) {
      const hueMap = {
        0: 190, // 冬
        1: 96, // 春
        2: 336, // 夏
        3: 30, // 秋
      }
      const lightness = (1 - ((this.toYear - year) / (this.toYear - this.fromYear))) * 20
      const minLightness = 15
      const { r: r1, g: g1, b: b1 } = hsl2rgb(hueMap[season], 75, lightness + minLightness + 10)
      const { r: r2, g: g2, b: b2 } = hsl2rgb(hueMap[season], 50, lightness + minLightness)
      const { r: r3, g: g3, b: b3 } = hsl2rgb(hueMap[season], 100, 75)
      return {
        background: `linear-gradient(135deg, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}) 100%)`,
        color: `rgb(${r3}, ${g3}, ${b3})`,
      }
    },
    async reloadList(year, season) {
      this.loading = true
      this.animeList = []
      const { success, list } = await API.fetchTimelineAnimeList(year, season)
      if (success) {
        this.animeList = list
        this.activeNode = [year, season]
        this.loading = false
      }
    },
  },
  mounted() {
    const [year, season] = this.activeNode
    this.reloadList(year, season)
  },
}
</script>

<style lang="scss" scoped>
.timeline {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  .anime-list {
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: center;
    position: relative;
  }

  .plark {
    mask-image: linear-gradient(to right, transparent 0, black 4rem, black calc(100% - 4rem), transparent 100%);
    padding: 1rem 4rem 1rem;
    position: relative;

    &:before {
      border-top: 2px dashed rgba(255, 255, 255, .3);
      content: '';
      height: 0;
      left: -10%;
      position: absolute;
      top: 50%;
      transform: translate(0, calc(-1rem - 2px));
      width: 120%;
    }
  }

  .selector {
    max-width: 100%;
    white-space: nowrap;

    .year {
      display: inline-block;

      > h3 {
        font-size: 1.1rem;
        margin: 1rem 0 0;
        padding-left: .5rem;
        text-align: center;
      }

      .seasons {
        display: flex;

        > div {
          align-items: center;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          font-size: 1.25rem;
          height: 3.25rem;
          justify-content: center;
          margin: .5rem;
          position: relative;
          user-select: none;
          width: 3.25rem;

          &:after {
            border-radius: 50%;
            content: '';
            height: 100%;
            opacity: .6;
            position: absolute;
            transition: background .1s linear;
            width: 100%;
          }

          &:active:after {
            background: #888;
          }

          @keyframes ripple {
            40%, to { height: 125%; opacity: 0; width: 125%; }
          }

          &.current:before {
            animation: ripple 1.5s ease infinite;
            border: 3px solid currentColor;
            border-radius: 50%;
            box-shadow: 0 0 4px 1px currentColor;
            content: '';
            height: 100%;
            position: absolute;
            width: 100%;
          }

          > span { color: #fff; }
        }
      }

      &:not(:first-child) > h3 {
        border-left: 2px solid rgba(255, 255, 255, .3);
      }
    }
  }
}
</style>
