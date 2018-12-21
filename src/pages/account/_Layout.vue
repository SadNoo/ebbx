<template>
  <router-view />
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'account-layout',
  computed: {
    ...mapState([
      'user',
    ]),
  },
  methods: {
    checkLogin() {
      if (!this.user) {
        this.$router.replace({ name: 'login' })
      } else if (this.$route.name === 'login') {
        this.$router.replace({ name: 'account' })
      }
    },
  },
  watch: {
    $route() {
      this.checkLogin()
    },
  },
  created() {
    this.checkLogin()
  },
}
</script>

<style lang="scss" scoped>
article {
  padding: 0 2rem;
}
</style>
