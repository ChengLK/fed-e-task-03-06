<template>
  <div class="role-wrapper">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search">
          <el-form :inline="true" size="small" :model="querySearch">
            <el-form-item label="输入搜索">
              <el-input v-model="querySearch.name" placeholder="输入搜索"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="search-call">
          <el-button size="small" @click="onSubmitSearch">查询搜索</el-button>
          <el-button size="small" type="primary" @click="isCreateRole">添加角色</el-button>
        </div>
      </div>
      <div>
         <el-table
          :data="records"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述">
          </el-table-column>
          <el-table-column
            prop="updatedTime"
            label="添加时间">
          </el-table-column>
          <el-table-column
            label="操作"
            width="240">
            <template slot-scope="scope">
              <el-button @click="distributeMenu(scope.row.id)" type="text" size="small">分配菜单</el-button>
              <el-button @click="distributeResource(scope.row.id)" type="text" size="small">分配资源</el-button>
              <el-button @click="editContent(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="handleClick(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
         <el-pagination-wrapper
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          ></el-pagination-wrapper>
      </div>
    </el-card>
    <el-dialog
      :title="content.id ? '编辑角色' : '新建角色'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form ref="form" :rules="contentRules" size="small" :model="content" label-width="80px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="content.name" placeholder="角色名称" maxlength="12"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="code">
            <el-input v-model="content.code" placeholder="角色编码" maxlength="12"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" resize="none" rows="2" maxlength="32" v-model="content.description" placeholder="描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="isUpdateOnModify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { getRolePages, roleSaveOrUpdate, RolePros, deleteRoleItem } from '@/service/access.ts'
import Vue from 'vue'
import { Form } from 'element-ui'
import { DataApplyMixin } from '@/utils/index.ts'

interface QueryProps {
  pageSize: string | number;
  currentPage: string | number;
  name: string;
}

const isOriginSource = {
  id: '',
  code: '',
  name: '',
  description: ''
}

export default Vue.extend({
  name: 'RolePage',
  mixins: [DataApplyMixin],
  data () {
    return {
      querySearch: {
        name: ''
      },
      dialogVisible: false,
      content: Object.assign({}, isOriginSource),
      contentRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmitSearch () {
      this.loadSource({
        pageSize: 10,
        currentPage: 1,
        name: this.querySearch.name
      })
    },
    async loadSource (QueryProps?: QueryProps) {
      if (QueryProps) {
        const { pageSize, currentPage } = QueryProps
        this.pageSize = pageSize
        this.currentPage = currentPage
      }

      const query = {
        size: this.pageSize,
        current: this.currentPage
      }
      if (this.querySearch) {
        Object.assign(query, this.querySearch)
      }

      const { data } = await getRolePages(query)
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
    distributeMenu (roleId: string) {
      this.$router.push({ name: 'alloc-menu', query: { roleId } })
    },
    distributeResource (roleId: string) {
      this.$router.push({ name: 'alloc-resource', query: { roleId } })
    },
    handleClick (id: string) {
      this.$confirm('是否要删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteRoleItem(id)
        if (data.data) {
          this.$message.success('删除成功')
        }
        this.loadSource()
      }).catch(() => {
        console.clear()
      })
    },
    isCreateRole () {
      this.dialogVisible = true
      this.content = Object.assign({}, isOriginSource)
    },
    editContent (row: RolePros) {
      this.content = row
      this.dialogVisible = true
    },
    handleClose () {
      (this.$refs.form as Form).resetFields()
      this.dialogVisible = false
    },
    isUpdateOnModify () {
      (this.$refs.form as Form).validate(async isValid => {
        if (isValid) {
          const { data } = await roleSaveOrUpdate(this.content)
          if (data.code === '000000') {
            this.$message.success('操作成功')
          }
          this.loadSource()
          this.dialogVisible = false
        }
      })
    }
  },
  mounted () {
    this.loadSource()
  }
})
</script>

<style lang="scss" scoped>
</style>
