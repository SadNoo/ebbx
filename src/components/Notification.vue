<template>
  <transition name="fade" mode="out-in">
    <div class="notification" @click="dismiss">
      <i :class="{ [`${payload.type}`]: true, [`fe-${icon}`]: true }" />
      <span v-html="payload.text" />
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'notification',
  props: {
    payload: {
      type: Object,
      required: true,
    },
  },
  computed: {
    icon() {
      if (this.payload.type === 'alert') {
        return 'alert-triangle'
      }
      return 'info'
    },
  },
  methods: {
    ...mapActions([
      'dequeueNotification',
    ]),
    dismiss() {
      this.dequeueNotification(this.payload.id)
    },
  },
}
</script>

<style lang="scss" scoped>
.notification {
  align-items: flex-start;
  background: url(../assets/g-notification.png);
  background-size: 100%;
  border-radius: 4px;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .08);
  cursor: pointer;
  display: flex;
  padding: 1rem;
  transition: all .15s ease-in-out;
  width: 18rem;

  &:not(:first-child) {
    margin-top: .5rem;
  }

  > i {
    flex-shrink: 0;
    font-size: 1.4rem;
    margin-right: 1rem;
    margin-top: .05rem;
    text-align: center;
    width: 1.5rem;

    &.info { color: #78eaff; }
    &.alert { color: #f79292; }
  }
}

// transitions
.fade-enter {
  opacity: 0;
  transform: translateX(1rem);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(-1rem);
}
</style>
