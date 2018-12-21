<template>
  <div>
    <var data-mark />
    <div class="image" :style="{ backgroundImage: 'url(' + randomImage + ')' }" />
    <h1>/* error four hundred and four */</h1>
    <h2>此網頁不存在 (ﾟдﾟ )</h2>
    <router-link class="link" :to="{ name: 'index' }">返回首頁</router-link>
  </div>
</template>

<script>
export default {
  name: 'not-found-page',
  data() {
    const images = [
      'https://i.imgur.com/aVF4YLY.png',
      'https://i.imgur.com/caeXjQK.gif',
      'https://i.imgur.com/P5hlCVV.png',
      'https://i.imgur.com/OJvbuFY.png',
      'https://i.imgur.com/MSRKiJ9.gif',
      'https://i.imgur.com/pkHGGox.gif',
      'https://i.imgur.com/Zrtfeac.gif',
    ]
    const randomImage = images[Math.floor(Math.random() * images.length)]
    return { randomImage }
  },
  async mounted() {
    await this.$nextTick()
    this.$root.$emit('pageload')
  },
}
</script>

<style lang="scss" scoped>
div {
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  line-height: 3rem;
  margin: 4rem 0 0;
  padding: 0;
}

h2 {
  font-size: 1.6rem;
  font-weight: 400;
  margin: 2rem 0;
}

.image {
  background: transparent center no-repeat;
  background-size: contain;
  height: 16rem;
  margin: 0 auto;
  width: 24rem;
}
</style>
