<template>
  <div class="el-pagination-wrapper">
     <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ElPaginationWrapper',
  props: {
    pageSize: {
      type: Number
    },
    currentPage: {
      type: Number
    },
    total: {
      type: Number
    }
  },
  methods: {
    handleSizeChange (pageSize: string) {
      this.$emit('size-change', pageSize)
    },
    handleCurrentChange (currentPage: string) {
      this.$emit('current-change', currentPage)
    }
  }
})
</script>

<style scoped lang="scss">
</style>
