<template>
  <transition name="fade">
    <div class="modal-wrapper">
      <ins class="modal-overlay" @click="onClose" />
      <div class="modal">
        <div class="inner">
          <div class="header">
            <slot name="title" :data="data">
              Modal title
            </slot>
          </div>
          <slot name="body" :data="data">
            Modal body
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    data: [Boolean, Object],
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.modal-wrapper {
  align-items: center;
  display: flex;
  justify-content: center;
  position: fixed;
  z-index: 2000;

  &,
  .modal-overlay {
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
  }

  .modal-overlay {
    background: rgba(0, 0, 0, .4);
    position: absolute;
    z-index: 1;
  }

  .modal {
    background: #3d7a9e;
    border-radius: .5rem;
    box-shadow: 0 4px 24px 1px rgba(0, 0, 0, .4);
    position: relative;
    z-index: 2;

    .inner {
      background: #222;
      border-radius: inherit;
      margin: 2px;
      min-width: 20rem;
      padding: 2rem;

      .header {
        color: #87d5ff;
        font-size: 1.2rem;
        margin: 0 0 2rem;
      }
    }
  }
}
</style>