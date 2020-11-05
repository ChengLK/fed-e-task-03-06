<template>
  <div class="create-menu-page">
    <edit-wrapper></edit-wrapper>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import EditWrapper from '../components/edit-wrapper.vue'

export default Vue.extend({
  name: 'CreateMenuPage',
  data () {
    return {}
  },
  components: {
    EditWrapper
  }
})
</script>

<style>

</style>
