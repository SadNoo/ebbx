<template>
  <div :class="{ page: directoryParams }">
    <loader v-if="!directoryParams" />
    <div v-if="directoryParams">
      <var data-mark />
      <nav>
        <div>
          <router-link :to="{ path: getPage(-1) }" v-if="hasPrevPage">上頁</router-link>
        </div>
        <h1>{{ animeDirectory.title }} ({{ directoryParams.page }} / {{ animeDirectory.total }} 頁)</h1>
        <div>
          <router-link :to="{ path: getPage(+1) }" v-if="hasNextPage">下頁</router-link>
        </div>
      </nav>
      <transition :name="transitionName" mode="out-in">
        <anime-list-renderer :key="getPage(0)" :items="animeDirectory.items" />
      </transition>
      <nav>
        <div>
          <router-link :to="{ path: getPage(-1) }" v-if="hasPrevPage">上頁</router-link>
        </div>
        <h1 />
        <div>
          <router-link :to="{ path: getPage(+1) }" v-if="hasNextPage">下頁</router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import Loader from '@/components/Loader'
import AnimeListRenderer from '@/components/AnimeListRenderer'

export default {
  name: 'directory-page',
  components: {
    Loader,
    AnimeListRenderer,
  },
  data() {
    return {
      transitionName: 'next',
    }
  },
  computed: {
    ...mapState([
      'directoryParams',
    ]),
    ...mapGetters([
      'animeDirectory',
    ]),
    hasPrevPage() {
      return this.directoryParams.page > 1
    },
    hasNextPage() {
      return this.directoryParams.page < this.animeDirectory.total
    },
  },
  methods: {
    ...mapActions([
      'updateDirectoryParams',
    ]),
    getPage(adj) {
      const { type, page, param } = this.directoryParams
      return `/browse/${type}/${type !== 'all' ? `${param}/` : ''}page/${page + adj}`
    },
    rebuildDirectoryParams(routeParams) {
      window.scrollTo(0, 0)
      try {
        const [type, ...params] = routeParams.split('/')
        let param = null
        let page = 1
        if (type === 'all') {
          if (params.length > 0 && !(params[0] === 'page' && !Number.isNaN(+params[1]))) {
            throw new Error('corrupt url 1')
          }
          page = +(params[1] || 1)
        } else if (['tag', 'studio'].indexOf(type) >= 0 && params.length > 0) {
          [param] = params
          if (params.length > 1 && !(params[1] === 'page' && !Number.isNaN(+params[2]))) {
            throw new Error('corrupt url 2')
          }
          page = +(params[2] || 1)
        } else {
          throw new Error('corrupt url 3')
        }
        this.updateDirectoryParams({ type, page, param })
      } catch (e) {
        this.$router.replace({ path: '/404' })
      }
    },
  },
  created() {
    this.rebuildDirectoryParams(this.$route.params.path)
  },
  watch: {
    '$route'(to, from) {
      if (+from.params.path !== +to.params.path) {
        this.rebuildDirectoryParams(to.params.path)
      }
    },
    async directoryParams(newVal, oldVal) {
      if (!newVal.list.length) {
        this.$router.replace({ path: '/404' })
        return
      }
      this.transitionName = (newVal && newVal.page) < (oldVal && oldVal.page) ? 'prev' : 'next'
      await this.$nextTick()
      this.$root.$emit('pageload')
    },
  },
  beforeDestroy() {
    // clean up
    this.updateDirectoryParams(null)
  },
}
</script>

<style lang="scss" scoped>
nav {
  align-items: center;
  display: flex;
  margin: 2rem 0;
  text-align: center;

  > :first-child,
  > :last-child {
    width: 20%;
  }

  > h1 {
    flex: 1;
    font-size: 1.5rem;
    font-weight: 300;
    margin: 0;
  }
}

// transitions
.next-enter-active, .next-leave-active,
.prev-enter-active, .prev-leave-active {
  transition: all .15s ease-in-out;
}
.next-enter {
  opacity: 0;
  transform: translateX(1rem);
}
.next-leave-to {
  opacity: 0;
  transform: translateX(-1rem);
}
.prev-enter {
  opacity: 0;
  transform: translateX(-1rem);
}
.prev-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
