<template>
  <div class="error-wrapper">
    <h2>This is A ErrorPage</h2>
    <div>
      <el-button size="small" type="primary" @click="toHomePage">返回首页</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ErrorPage',
  methods: {
    toHomePage () {
      this.$router.push('/role')
    }
  }
})
</script>

<style lang="scss" scoped>
.error-wrapper{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
