<template>
  <button class="big-play-button" @click="$emit('click')">
    <svg viewBox="0 0 512 512">
      <g fill="rgba(0, 0, 0, .6)">
        <polygon points="209,336.2 334.5,255.5 209,174.8  "/>
        <path d="M256-0.5C114.6-0.5,0,114.1,0,255.5s114.6,256,256,256s256-114.6,256-256S397.4-0.5,256-0.5z M358.4,263.9
          l-154,99c-1.6,1.1-3.5,1.6-5.4,1.6c-1.6,0-3.3-0.4-4.8-1.2c-3.2-1.8-5.2-5.1-5.2-8.8v-198c0-3.7,2-7,5.2-8.8s7.1-1.6,10.2,0.4
          l154,99c2.9,1.8,4.6,5,4.6,8.4C363,258.9,361.3,262.1,358.4,263.9z"/>
      </g>
    </svg>
  </button>
</template>

<style scoped lang="scss">
.big-play-button {
  background: rgba(36, 37, 40, .5);
  border: 0;
  display: inline-flex;
  height: 100%;
  left: 0;
  outline: 0;
  padding: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 101;

  > svg {
    background: -webkit-linear-gradient(-45deg, rgba(118, 210, 231, .5), rgba(144, 124, 255, .5));
    border-radius: 50%;
    box-shadow: 0 0 24px rgba(0, 0, 0, .35);
    left: 50%;
    padding: 5px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 6rem;

    // mobile
    @media (max-width: 839px) {
      width: 4rem;
    }
  }
}
</style>
