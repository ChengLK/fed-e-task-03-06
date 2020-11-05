<template>
  <div class="menu-wrapper">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span></span>
        <el-button size="small" type="primary" @click="toCreateMenu">添加菜单</el-button>
      </div>
      <div>
        <el-table
          :data="records"
          style="width: 100%">
          <el-table-column
            label="编号"
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            prop="name"
            label="菜单名称">
          </el-table-column>
          <el-table-column
            prop="parentId"
            label="菜单级数">
          </el-table-column>
          <el-table-column
            prop="icon"
            label="前端图标">
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="排序">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="120">
            <template slot-scope="scope">
              <el-button @click="toPageOfEdit(scope.row.id)" type="text" size="small">编辑</el-button>
              <el-button @click="handleClick(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination-wrapper
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
          </el-pagination-wrapper>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { getMenuPages, isDeleteMenu } from '@/service/access'
import { DataApplyMixin } from '@/utils'
import Vue from 'vue'

export default Vue.extend({
  name: 'MenuPage',
  mixins: [DataApplyMixin],
  data () {
    return {
    }
  },
  methods: {
    handleClick (id: string) {
      this.$confirm('是否要删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await isDeleteMenu(id)
        if (data.data) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.loadSource()
        }
      }).catch(() => console.clear())
    },
    async loadSource () {
      const query = {
        size: this.pageSize,
        current: this.currentPage
      }

      const { data } = await getMenuPages(query)
      this.dataSolve(data, this.pageSize)
    },
    handleSizeChange (pageSize: string) {
      this.pageSize = pageSize
      this.loadSource()
    },
    handleCurrentChange (currentPage: string) {
      this.currentPage = currentPage
      this.loadSource()
    },
    toCreateMenu () {
      this.$router.push({ name: 'create-menu' })
    },
    toPageOfEdit (id: string) {
      this.$router.push(`/edit-menu/${id}`)
    }
  },
  mounted () {
    this.loadSource()
  }
})
</script>

<style lang="scss" scoped>
</style>
