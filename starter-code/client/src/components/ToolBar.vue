<template>
  <div class="toolBar">
    <div class="top wide center purpleIcon">
      <b-avatar variant="info" size="5rem">
        <img src="../assets/favicon-32x32.png" alt="logo">
      </b-avatar>
    </div>
    <div class="bottom wide center">
      <b-avatar class="pointer icon" variant="info" size="4rem">
        <img src="../assets/icon-sun.svg" alt="light-mode">
      </b-avatar>
      <hr>
      <div>--------</div>
      <b-avatar class="pointer icon" variant="info" size="4rem">
        <img src="../assets/image-avatar.jpg" alt="avatar">
      </b-avatar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tool-bar',
  props: {

  }
}
</script>

<style scoped>
.toolBar {
  background-color: var(--wrGreyWeak) !important;
  z-index: 99;
  height: 100vh;
  width: 7vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 0 2.5rem 2.5rem 0;
  padding-bottom: 2rem;
  overflow: hidden;
}

.bottom {
  padding: 2rem 0;
}

.purpleIcon {
  background-color: var(--wrPurpleWeak);
  width: 7rem;
  height: 7rem;
  border-radius: 0 0 7rem 0;
}

hr {
  height: 0.15rem;
  color: var(--wrWhiteWeak) !important;
  background-color: var(--wrWhiteWeak) !important;
  width: 10rem;
  position: absolute;
  left: 0;
  bottom: 8rem;
}
</style>
