<template>
  <div class="create-advert-page">
    <edit-wrapper></edit-wrapper>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import EditWrapper from '../components/edit-wrapper.vue'

export default Vue.extend({
  name: 'CreateAdvertPage',
  data () {
    return {}
  },
  components: {
    EditWrapper
  }
})
</script>

<style scoped lang='scss'>

</style>
