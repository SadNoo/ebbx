<template>
  <div class="page">
    <var data-mark />
    <section v-if="featuredSeasons">
      <h1>精選推介</h1>
      <plark>
        <div class="featured">
          <a
            v-for="season in featuredSeasons"
            :key="season.season_id"
            :href="`/anime/${season.anime_id}x${season.season_id}`"
            @click.prevent=""
            @mousedown.prevent="calendarLinkMousedown"
            @touchstart="calendarLinkTouchstart"
          >
            <article>
              <b :data-deferred-src="season.poster_large" />
              <h2>{{ season.name_chi }} {{ season.season_title }}</h2>
            </article>
          </a>
        </div>
      </plark>
    </section>
    <section v-if="calendar">
      <h1>{{ calendar.title }}</h1>
      <div :class="`collapsable${calendarExpanded ? '' : ' collapsed'}`">
        <div class="inner" :style="{ maxHeight: calendarExpanded ? null : '16rem' }">
          <plark>
            <div class="calendar">
              <div
                class="column"
                v-for="day in calendar.days"
                :key="day.label"
              >
                <b>{{ day.label }}</b>
                <ul>
                  <li v-for="anime in day.animes" :key="anime.path">
                    <a
                      v-if="anime.path"
                      :href="anime.path"
                      @click.prevent=""
                      @mousedown.prevent="calendarLinkMousedown"
                      @touchstart="calendarLinkTouchstart"
                    >
                      {{ anime.name }}
                    </a>
                    <span v-if="!anime.path">{{ anime.name }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </plark>
        </div>
        <div class="show" v-if="!calendarExpanded" @click="calendarExpanded = true">全部顯示</div>
      </div>
    </section>
    <section v-for="(animes, type) in informatizedAnimeList" :key="type">
      <div class="info-ads">
        <ads type="ypa_banner" :size="{ width: 620, height: 120 }" />
      </div>
      <h1>{{ type }}</h1>
      <div :class="`collapsable${expandedBlocks.indexOf(type) >= 0 ? '' : ' collapsed'}`">
        <div class="inner" :style="{ maxHeight: expandedBlocks.indexOf(type) >= 0 ? null : `${blockMaxHeight}px` }">
          <anime-list-renderer :items="animes" />
        </div>
        <div class="show" v-if="expandedBlocks.indexOf(type) < 0" @click="expandedBlocks.push(type)">全部顯示</div>
      </div>
    </section>
    <section>
      <h1>瀏覽更多</h1>
      <div class="links">
        <router-link class="link" :to="{ path: '/browse/all' }">
          <i class="fe-list" />
          <span>全部動畫列表</span>
        </router-link>
        <router-link class="link" :to="{ path: '/timeline' }" v-if="!isMobile">
          <i class="fe-git-commit" />
          <span>動畫時間軸</span>
        </router-link>
      </div>
      <br />
      <div class="info-ads">
        <ads type="ypa_banner" :size="{ width: 620, height: 120 }" />
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import Ads from '@/components/Ads'
import AnimeListRenderer from '@/components/AnimeListRenderer'
import Plark from '@/components/Plark'

export default {
  name: 'index-page',
  components: {
    Ads,
    AnimeListRenderer,
    Plark,
  },
  data() {
    return {
      calendarExpanded: false,
      expandedBlocks: [],
      blockMaxHeight: Math.floor(window.screen.height * 0.8),
    }
  },
  computed: {
    ...mapState({
      calendar: (state) => state.hpData.calendar,
      isMobile: 'isMobile',
      animeList: 'animeList',
    }),
    ...mapGetters([
      'featuredSeasons',
      'informatizedAnimeList',
    ]),
  },
  methods: {
    calendarLinkMousedown({ button, clientX: cx1, clientY: cy1, currentTarget }) {
      if (button !== 0) {
        return
      }
      const mouseup = ({ clientX: cx2, clientY: cy2 }) => {
        document.removeEventListener('mouseup', mouseup)
        if (cx1 === cx2 && cy1 === cy2) {
          this.$router.push({ path: currentTarget.pathname })
        }
      }
      document.addEventListener('mouseup', mouseup)
    },
    calendarLinkTouchstart({ touches, currentTarget }) {
      const { clientX: cx1, clientY: cy1 } = touches[0]
      let cx2
      let cy2
      const touchmove = ({ touches }) => {
        cx2 = touches[0].clientX
        cy2 = touches[0].clientY
      }
      const touchend = () => {
        document.removeEventListener('touchmove', touchmove)
        document.removeEventListener('touchend', touchend)
        if (cx1 === cx2 && cy1 === cy2) {
          this.$router.push({ path: currentTarget.pathname })
        }
      }
      document.addEventListener('touchmove', touchmove)
      document.addEventListener('touchend', touchend)
    },
  },
  async mounted() {
    await this.$nextTick()
    this.$root.$emit('pageload')
  },
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 1.5rem;
  font-weight: 200;
  margin: 0 ;
  padding: 2rem;

  + .links {
    display: flex;
    flex-wrap: wrap;
    margin-left: 1.5rem;

    > a {
      align-items: center;
      background: rgba(255, 255, 255, .03);
      border: 1px solid rgba(180, 187, 240, .2);
      border-radius: 4px;
      color: #fff;
      display: flex;
      height: 4rem;
      margin: .5rem;
      width: 14rem;

      &:hover {
        background: rgba(255, 255, 255, .06);
        border: 1px solid rgba(180, 187, 240, .3);
      }

      > i {
        font-size: 1.5rem;
        text-align: center;
        width: 4rem;
      }
    }
  }
}

.featured {
  display: flex;
  white-space: nowrap;

  a {
    color: #fff;
    text-decoration: none;

    &:not(:first-child) article {
      margin-left: .5rem;
    }
  }

  article {
    align-items: flex-end;
    cursor: pointer;
    display: inline-flex;
    height: 12rem;
    position: relative;
    width: 24rem;

    > b {
      background: none center no-repeat;
      background-size: cover;
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: -1;

      $x: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+' +
        'OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/' +
        'bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEY' +
        'BJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAA' +
        'ABJRU5ErkJggg==';

      &:after {
        background: url($x) center 100% no-repeat;
        background-size: 100% 200%;
        content: '';
        height: 100%;
        position: absolute;
        width: 100%;
      }
    }

    > h2 {
      font-size: 1.4rem;
      font-weight: 400;
      margin: 0;
      padding: 1rem;
      text-align: right;
      white-space: normal;
      width: 100%;
    }
  }
}

.collapsable {
  position: relative;

  &.collapsed {
    overflow: hidden;

    .inner {
      mask-image: linear-gradient(to bottom, black calc(100% - 10rem), rgba(0, 0, 0, .2) calc(100% - 5rem), transparent 100%);
      overflow: hidden;
    }
  }

  .show {
    background: rgba(94, 99, 124, .2);
    border-radius: 12px;
    bottom: 0;
    cursor: pointer;
    font-size: .95rem;
    height: 2rem;
    left: 50%;
    line-height: 2rem;
    margin-left: -3rem;
    position: absolute;
    text-align: center;
    width: 6rem;
  }
}

.calendar {
  display: flex;
  padding-bottom: .5rem;

  .column {
    background: rgba(94, 99, 124, .2);
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;
    min-width: 240px;
    // max-width: 260px;

    &:not(:first-child) {
      margin-left: .5rem;
    }

    > b {
      color: #ffbae9;
      display: inline-block;
      margin: 1rem 0;
      padding-left: 1rem;
      width: 100%;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;

      li:not(:first-child) {
        border-top: 1px dashed rgba(181, 223, 245, .2);
      }

      li {
        word-break: break-word;

        span,
        a {
          display: inline-block;
          padding: .8rem 1rem;
          width: 100%;
        }

        span {
          color: #6b7881;
        }

        a {
          text-decoration: none;
          transition: background .1s linear;

          &:hover { background: rgba(138, 157, 193, .1); }
        }
      }
    }
  }

  .column:nth-child(1) > b { color: #ffbae9; }
  .column:nth-child(2) > b { color: #ccbaff; }
  .column:nth-child(3) > b { color: #baf8ff; }
  .column:nth-child(4) > b { color: #baffbd; }
  .column:nth-child(5) > b { color: #fdffba; }
  .column:nth-child(6) > b { color: #ffd1ba; }
  .column:nth-child(7) > b { color: #ffbaba; }
}

.info-ads {
  display: flex;
  justify-content: center;
  margin: 2rem 2rem 0;
}
</style>
