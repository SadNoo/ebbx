<template>
  <div class="wrapper">
    <loader v-if="!article" />
    <article v-if="article">
      <var data-mark />
      <div class="title">
        <h1>{{ article.title }}</h1>
        <span class="meta">發表於 {{ getRelativeDate(article.created_at) }}</span>
      </div>
      <div class="main" v-html="article.content" />
    </article>
  </div>
</template>

<script>
import API from '@/api'
import { getRelativeDate } from '@/utility'

import Loader from '@/components/Loader'

export default {
  name: 'article-page',
  components: {
    Loader,
  },
  data() {
    return {
      article: null,
    }
  },
  computed: {
    id() {
      return this.$route.params.title.split('-').pop()
    },
  },
  methods: {
    getRelativeDate,
  },
  async mounted() {
    const article = await API.fetchArticle(this.id)
    if (!article) {
      this.$router.replace({ path: '/404' })
      return
    }
    this.article = article
    const siteTitle = document.title.split(' - ')[1]
    document.title = `${article.title} - ${siteTitle}`
    await this.$nextTick()
    this.$root.$emit('pageload')
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 0 1rem;
  max-width: 960px;
  width: 100%;
}

article {
  line-height: 2rem;
  margin: 3rem 0;

  // mobile
  @media (max-width: 839px) {
    margin: 1rem 0;
  }

  .title {
    padding: 1rem 0 2rem;

    h1 {
      color: #fff;
      font-size: 1.8rem;
      font-weight: 300;
      line-height: 2.5rem;
      margin: 0 0 .5rem;
    }

    .meta {
      color: #bbb;
      font-style: italic;
    }
  }
}
</style>

<style lang="scss">
.main {
  img {
    vertical-align: top;

    // mobile
    @media (max-width: 839px) {
      max-width: 100%;
    }
  }

  p {
    margin: 0;
    word-break: break-word;
  }
}
</style>
