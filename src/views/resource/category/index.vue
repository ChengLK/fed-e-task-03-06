
<template>
  <div class="category-wrapper">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span></span>
        <el-button @click="isCreateHandle()" type="primary" size="small">添 加</el-button>
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
            label="名称">
          </el-table-column>
          <el-table-column
            label="创建时间">
             <template slot-scope="scope">
               <span>{{scope.row.createdTime}}</span>
             </template>
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="120">
            <template slot-scope="scope">
              <el-button @click="isCreateHandle(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="handleClick(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination-wrapper
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          ></el-pagination-wrapper> -->
      </div>
    </el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form size="small" ref="form" :rules="rules" :model="content" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="content.name" placeholder="名称" maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="content.sort" placeholder="排序" maxlength="6"></el-input>
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
import { getCategoryPages, categorySaveOrderUpdate, isDeleteCategory } from '@/service/access.ts'
import { Form } from 'element-ui'
import Vue from 'vue'

const isOrigin = { name: '', sort: '' }

export default Vue.extend({
  name: 'CategoryPage',
  data () {
    return {
      records: [],
      dialogVisible: false,
      title: '添加分类',
      content: {
        name: '',
        sort: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async loadSource () {
      const { data } = await getCategoryPages()
      if (data.data) {
        this.records = data.data
      }
    },
    isCreateHandle (row?: { name: string; sort: string }) {
      if (row) {
        this.title = '编辑分类'
        this.content = row
      } else {
        this.title = '添加分类'
        this.content = isOrigin
      }
      console.log(row)
      this.dialogVisible = true
    },
    handleClick (id: string) {
      this.$confirm('是否要删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await isDeleteCategory(id)
        if (data.data) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.loadSource()
        }
      }).catch(() => console.clear())
    },
    handleClose () {
      (this.$refs.form as Form).resetFields()
      this.dialogVisible = false
    },
    onSubmitSuccess () {
      (this.$refs.form as Form).validate(async isValid => {
        if (isValid) {
          const { data } = await categorySaveOrderUpdate(this.content)
          if (data.data) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.loadSource()
          }
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
