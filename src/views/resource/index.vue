<template>
  <div class="resource-wrapper">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search">
          <div class="search-wrapper">
            <el-form size="small" :inline="true" :model="querySearch" class="demo-form-inline">
            <el-form-item label="资源名称">
              <el-input style="width: 150px;" v-model="querySearch.name" placeholder="资源名称"></el-input>
            </el-form-item>
            <el-form-item label="资源路径">
              <el-input style="width: 150px;" v-model="querySearch.url" placeholder="资源路径"></el-input>
            </el-form-item>
            <el-form-item label="资源分类">
              <el-select style="width: 150px;" v-model="querySearch.categoryId" placeholder="资源分类">
                <el-option v-for="item in listCategory" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          </div>
          <div class="search-btn">
            <el-button style="width: 72px;" size="small" @click="resetState">重置</el-button>
            <el-button style="width: 72px;" size="small" @click="onSubmit" type="primary">查询</el-button>
          </div>
        </div>
        <div class="oprate">
          <el-button size="small" @click="isCreateHandle()">添加菜单</el-button>
          <el-button size="small" @click="toPageOfCategory()" type="primary">资源分类</el-button>
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
            label="资源名称">
          </el-table-column>
          <el-table-column
            prop="url"
            label="资源路径">
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
            min-width="120">
            <template slot-scope="scope">
              <el-button @click="isCreateHandle(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
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
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form size="small" ref="form" :rules="rules" :model="content" label-width="80px">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="content.name" placeholder="资源名称" maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="content.url" placeholder="资源路径" maxlength="48"></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="content.categoryId" placeholder="请选择资源分类">
              <el-option v-for="item in listCategory" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源描述" prop="description">
            <el-input
              resize="none"
              :autosize="false"
              rows="3"
              maxlength="72"
              type="textarea"
              v-model="content.description"
              placeholder="资源描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="onSubmitSuccess">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { isDeleteSource, getResourcePages, sourceSaveOrUpdate, getCategoryPages } from '@/service/access.ts'
import Vue from 'vue'
import { DataApplyMixin } from '@/utils'
import { Form } from 'element-ui'

interface QueryProps {
  pageSize: string | number;
  currentPage: string | number;
}

interface CrossQueryProps {
  name: string;
  url: string;
  categoryId: string;
  description: string;
 }

const OriginByCreate = () => {
  return {
    name: '',
    url: '',
    categoryId: '',
    description: ''
  }
}

const isOriginSource = OriginByCreate()

export default Vue.extend({
  name: 'ResourcePage',
  mixins: [DataApplyMixin],
  data () {
    return {
      querySearch: {
        name: '',
        url: '',
        categoryId: ''
      },
      dialogVisible: false,
      title: '添加资源',
      content: isOriginSource,
      rules: {
        name: [
          { required: true, message: '请输入资源名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入资源路径', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择资源分类', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入资源描述', trigger: 'blur' }
        ]
      },
      listCategory: []
    }
  },
  methods: {
    resetState () {
      this.querySearch = {
        name: '',
        url: '',
        categoryId: ''
      }
    },
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
        size: this.pageSize,
        current: this.currentPage
      }
      if (this.querySearch) {
        Object.assign(query, this.querySearch)
      }

      const { data } = await getResourcePages(query)
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
    async handleClick (row: {id: string}) {
      this.$confirm('是否要删除该资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await isDeleteSource(row.id)
        if (data.data) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.loadSource()
        }
      }).catch(() => console.clear())
    },
    isCreateHandle (row?: CrossQueryProps) {
      if (row) {
        this.content = { ...row } // 仅第一层深拷贝
        this.title = '编辑资源'
      } else {
        this.content = OriginByCreate()
        this.title = '添加资源'
      }
      this.dialogVisible = true
    },
    handleClose () {
      (this.$refs.form as Form).resetFields()
      this.dialogVisible = false
    },
    onSubmitSuccess () {
      (this.$refs.form as Form).validate(async isValid => {
        if (isValid) {
          const { data } = await sourceSaveOrUpdate(this.content)
          if (data.data) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.loadSource()
            this.getCategoryPages()
          }
          this.dialogVisible = false
        }
      })
    },
    async getCategoryPages () {
      const { data } = await getCategoryPages()
      if (data.data && Array.isArray(data.data)) {
        this.listCategory = data.data
      }
    },
    toPageOfCategory () {
      this.$router.push('/rs-category')
    }
  },
  mounted () {
    this.loadSource()
    this.getCategoryPages()
  }
})
</script>

<style lang="scss" scoped>
.search {
  display: flex;
}
</style>
