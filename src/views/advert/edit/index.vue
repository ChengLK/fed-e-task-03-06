<template>
  <div class="edit-advert-page">
    <edit-wrapper :id="id"></edit-wrapper>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import EditWrapper from '../components/edit-wrapper.vue'

export default Vue.extend({
  name: 'EditAdvertPage',
  props: ['id'],
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
