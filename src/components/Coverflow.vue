<template>
  <div 
    class="coverflow"
    ref="coverflow"
  >
    <a
      v-for="(item, i) in items"
      :key="item.season_id"
      :class="{ card: true, active: activeItem === i }"
      :style="{
        height: `${cardSize[1]}px`,
        opacity: getOpacity(i),
        top: `${cardTop}px`,
        transform: `translate3d(${getLeft(i)}px, 0, 0) scale(${getScaleFactor(i)})`,
        width: `${cardSize[0]}px`,
      }"
      :href="`/anime/${item.anime_id}x${item.season_id}`"
      @click="goToItem($event, i)"
    >
      <div class="poster" :style="{ backgroundImage: `url(${item.poster})` }" />
      <div class="detail" :style="{ opacity: activeItem === i ? 1 : 0 }">
        <div class="titles">
          <h1>
            <s v-for="char in spliddit(item.name_chi)">{{ char }}</s>
            <s />
            <s>{{ item.season_title }}</s>
          </h1>
        </div>
      </div>
    </a>
    <div class="meta">
      {{ metaPrefix }} {{ activeItem + 1 }} / {{ items.length }}
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import spliddit from 'spliddit'

export default {
  name: 'coverflow',
  props: {
    items: {
      type: Array,
      required: true,
    },
    metaPrefix: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      resizeListener: null,
      containerSize: [0, 0],
      cardSize: [0, 0],
      cardTop: 0,
      activeItem: 0,
    }
  },
  methods: {
    spliddit,
    updateSize() {
      const { width, height } = this.$refs.coverflow.getBoundingClientRect()
      this.containerSize = [width, height]
      const cardWidth = Math.min(360, this.containerSize[0] * 0.8)
      this.cardSize = [cardWidth, Math.floor(cardWidth * 1.5)]
      this.cardTop = (this.containerSize[1] - this.cardSize[1]) / 2
    },
    getOpacity(index) {
      if (index === this.activeItem) {
        return 1
      }
      if ([this.activeItem - 1, this.activeItem + 1].indexOf(index) >= 0) {
        return 0.8
      }
      return 0.6
    },
    getScaleFactor(index) {
      if (index === this.activeItem) {
        return 1.1
      }
      if ([this.activeItem - 1, this.activeItem + 1].indexOf(index) >= 0) {
        return 1.0
      }
      return 0.9
    },
    getLeft(index) {
      let left = ((this.containerSize[0] - this.cardSize[0]) / 2) // align to center of container
      left += index * this.cardSize[0] // offset by index
      left -= (this.activeItem * this.cardSize[0]) // minus by active item
      if (this.activeItem - 2 === index) {
        left += 30 * 1.1
      }
      if (this.activeItem + 2 === index) {
        left -= 30 * 1.1
      }
      return left
    },
    goToItem(event, index) {
      event.preventDefault()
      if (index === this.activeItem) {
        this.$router.push({ path: event.target.pathname })
        return
      }
      this.activeItem = index
    },
  },
  mounted() {
    this.resizeListener = _.debounce(this.updateSize, 200)
    window.addEventListener('resize', this.resizeListener)
    this.updateSize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeListener)
  },
}
</script>

<style lang="scss" scoped>
.coverflow {
  cursor: default;
  height: 100%;
  mask-image: linear-gradient(to right, transparent 0, black 4rem, black calc(100% - 4rem), transparent 100%);
  overflow: hidden;
  position: absolute;
  user-select: none;
  width: 100%;

  .card {
    cursor: pointer;
    padding: 10px;
    position: absolute;
    transition: transform .25s ease-out, opacity .2s;

    &.active {
      z-index: 2;

      &:active:before {
        background: rgba(128, 128, 128, .25);
        content: '';
        z-index: 2;
      }
    }

    .poster,
    .detail,
    &:active:before {
      bottom: 10px;
      left: 10px;
      position: absolute;
      right: 10px;
      top: 10px;
    }

    .poster {
      background: transparent center no-repeat;
      background-size: cover;
      border-radius: 6px;
      box-shadow: 0 2px 16px 2px rgba(0, 0, 0, .5);
    }

    .detail {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==) center 100% no-repeat;
      background-size: 100% 200%;
      background-position-y: 75%;
      transition: opacity .2s;

      .titles {
        align-items: flex-start;
        bottom: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: flex-end;
        left: 0;
        padding: 2rem 0;
        position: absolute;
        top: 0;
        width: 100%;

        > h1 {
          border-left: calc(1rem - 1px) solid #000;
          color: #fff;
          display: flex;
          font-size: 1.75rem;
          font-weight: 300;
          flex-wrap: wrap;
          line-height: 2.5rem;
          margin: 0 0 0 1rem;
          padding-right: .5rem;

          > s {
            align-items: center;
            background: #000;
            display: flex;
            text-decoration: none;
            text-indent: -.5rem;
            padding: .25rem .5rem .25rem 0;
          }
        }
      }
    }
  }

  .meta {
    bottom: 3rem;
    color: #fff;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
  }
}
</style>
