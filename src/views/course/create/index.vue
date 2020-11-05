<template>
  <div class="create-course-page">
  <edit-wrapper></edit-wrapper>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import EditWrapper from '../components/edit-wrapper.vue'

export default Vue.extend({
  name: 'CreateCoursePage',
  components: {
    EditWrapper
  }
})
</script>

<style lang="scss" scoped>

</style>
