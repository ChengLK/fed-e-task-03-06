<template>
  <div class="course-wrapper">
    <div class="search-oprate">
      <el-form size="small" :inline="true" :model="querySearch" class="demo-form-inline">
        <el-form-item label="课程名称">
          <el-input v-model="querySearch.courseName" placeholder="课程名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="querySearch.status" placeholder="状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="edit-wrapper">
        <el-button
          size="small"
          icon="el-icon-edit"
          type="primary"
          @click="onSubmitIsCreate()">新建课程</el-button>
      </div>
    </div>
    <el-card class="box-card">
      <div>
        <el-table
          :data="records"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="courseName"
            label="课程名称">
          </el-table-column>
          <el-table-column
            label="价格">
            <template slot-scope="scope">
              <span> {{scope.row.price ? `¥${scope.row.price}` : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sortNum"
            label="排序">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <i :class="['status-icon',  scope.row.status ? 'status-on-sale' : 'status-off-sale']"></i>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="120">
            <template slot-scope="scope">
              <el-button @click="changeState(scope.row)" type="text" size="small">{{scope.row.status ? '下架' : '上架'}}</el-button>
              <el-button @click="onSubmitIsCreate(scope.row.id)" type="text" size="small">编辑</el-button>
              <el-button @click="handleClickManage(scope.row.id)" type="text" size="small">内容管理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination-wrapper
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        ></el-pagination-wrapper>
    </el-card>
  </div>
</template>

<script lang="ts">
import { getQueryCourses, courseChangeState } from '@/service/course.ts'
import { DataApplyMixin } from '@/utils'
import Vue from 'vue'

interface QueryProps {
  pageSize: string | number;
  currentPage: string | number;
}

export default Vue.extend({
  name: 'CoursePage',
  mixins: [DataApplyMixin],
  data () {
    return {
      querySearch: {
        courseName: '',
        status: ''
      }
    }
  },
  methods: {
    onSubmit () {
      this.loadSource({
        pageSize: 10,
        currentPage: 1
      })
    },
    async loadSource (QueryProps?: QueryProps) {
      if (QueryProps) {
        const { pageSize, currentPage } = QueryProps
        this.pageSize = pageSize
        this.currentPage = currentPage
      }

      const query = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }

      if (this.querySearch) {
        Object.assign(query, this.querySearch)
      }

      const { data } = await getQueryCourses(query)
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
    async changeState (row: { id: string; status: string }) {
      const { data } = await courseChangeState({
        courseId: row.id,
        status: row.status ? '0' : '1'
      })
      if (data.mesg === '处理成功') this.loadSource()
    },
    onSubmitIsCreate (id: string) {
      if (id) {
        this.$router.push(`/edit-course/${id}`)
      } else {
        this.$router.push('/new-course')
      }
    },
    handleClickManage (id: string) {
      this.$router.push(`/sections-course/${id}`)
    }
  },
  mounted () {
    this.loadSource()
  }
})
</script>

<style lang="scss" scoped>
.search-oprate {
  display: flex;
  justify-content: space-between;
}
</style>
