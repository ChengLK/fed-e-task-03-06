<template>
  <div class="edit-course-page">
    <edit-wrapper :courseId="id"></edit-wrapper>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { getCourseById } from '@/service/course.ts'
import EditWrapper from '../components/edit-wrapper.vue'

export default Vue.extend({
  name: 'EditCoursePage',
  props: ['id'],
  data () {
    return {
      content: {
        courseName: ''
      }
    }
  },
  components: {
    EditWrapper
  },
  methods: {
    async loadSource () {
      const { data } = await getCourseById(this.id)
      if (data.data) {
        this.content = data.data
      }
    }
  },
  mounted () {
    this.loadSource()
  }
})
</script>

<style lang="scss" scoped>

</style>
