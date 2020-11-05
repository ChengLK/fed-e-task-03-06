<template>
  <div class="menu-wrapper">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span></span>
        <el-button size="small" type="primary" @click="advertCreate()">添加广告位</el-button>
      </div>
      <div>
        <el-table
          :data="adverts"
          style="width: 100%">
          <el-table-column
            prop="spaceKey"
            label="spaceKey">
          </el-table-column>
          <el-table-column
            prop="name"
            label="广告位名称">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="80">
            <template slot-scope="scope">
              <el-button @click="advertCreate(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form size="small" ref="form" :rules="rules" :model="content" label-width="100px">
          <el-form-item label="spaceKey" prop="spaceKey">
            <el-input v-model="content.spaceKey" placeholder="spaceKey" maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="广告位名称" prop="name">
            <el-input v-model="content.name" placeholder="广告位名称" maxlength="48"></el-input>
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
import { getAdvertSpaces, saveOrUpdate, UpdateProps } from '@/service/adverts.ts'
import { Form } from 'element-ui'
import Vue from 'vue'

const isOrigin = { spaceKey: '', name: '' }

export default Vue.extend({
  name: 'AdvertSpacePage',
  data () {
    return {
      adverts: [],
      dialogVisible: false,
      title: '添加广告位',
      content: {
        spaceKey: '',
        name: ''
      },
      rules: {
        spaceKey: [
          { required: true, message: '请输入spaceKey值', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入广告位名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async loadSource () {
      const { data } = await getAdvertSpaces()
      if (data.success) {
        this.adverts = data.content
      }
    },
    async advertCreate (row: UpdateProps) {
      if (row) {
        this.title = '编辑广告位'
        this.content = Object.assign({}, row)
      } else {
        this.title = '添加广告位'
        this.content = isOrigin
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
          const { data } = await saveOrUpdate(this.content)
          if (data.success) {
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
