<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>

 
</script>
 
<style scoped>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  /* 确保填满整个视口 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto; /* 允许内容滚动 */
  
  /* 移除默认边距 */
  margin: 0;
  padding: 0;
}
</style>
