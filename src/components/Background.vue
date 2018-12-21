<template>
  <div class="background" />
</template>

<script>
export default {
  name: 'background',
}
</script>

<style lang="scss" scoped>
.background {
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  position: fixed;
  right: 0;
  top: 0;

  &:before,
  &:after {
    content: '';
    left: 0;
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;
  }

  &:before {
    background: linear-gradient(45deg, rgba(35, 9, 59, .2), rgba(0, 76, 71, .2));
  }

  &:after {
    background: url(../assets/pattern.png) repeat;
    background-size: 50px;
  }
}
</style>
