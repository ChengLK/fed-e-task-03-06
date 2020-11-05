<template>
  <div class="user-wrapper">
    <div class="search-oprate">
      <el-form size="small" :inline="true" :model="querySearch" class="demo-form-inline">
        <el-form-item label="手机号">
          <el-input v-model="querySearch.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
           <el-date-picker
            v-model="querySearch.dateValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 72px;" size="small" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card class="box-card">
      <div>
       <el-table
          :data="records"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="用户ID">
          </el-table-column>
          <el-table-column
            label="头像">
            <template slot-scope="scope">
              <el-avatar size="medium" :src="scope.row.portrait || require('@/assets/3ea6b.avatar.png')"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="注册时间">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <i :class="['status-icon',  scope.row.status === 'ENABLE' ? 'status-on-sale' : 'status-off-sale']"></i>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="forbidUser(scope.row.id)">禁用</el-button>
              <el-button @click="handleClick(scope.row.id)" type="text" size="small">分配角色</el-button>
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
      title="分配角色"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div>
        <el-form size="small" ref="form" :model="content">
          <el-form-item prop="roleIdList">
            <el-select style="width: 80%;" v-model="content.roleIdList" multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
import { gainAccessRoles } from '@/service/access.ts'
import { getUserPages, forbidUser, gainAccessByUser } from '@/service/users.ts'
import Vue from 'vue'
import { DataApplyMixin } from '@/utils/index.ts'

interface QueryProps {
  pageSize: string | number;
  currentPage: string | number;
}

interface OptionProps {
  id: string;
  name: string;
}

export default Vue.extend({
  name: 'UserPage',
  mixins: [DataApplyMixin],
  data () {
    return {
      querySearch: {
        phone: '',
        dateValue: []
      },
      dialogVisible: false,
      content: {
        roleIdList: [],
        userId: ''
      },
      options: []
    }
  },
  methods: {
    async forbidUser (userId: string) {
      const { data } = await forbidUser({ userId })
      console.log(data)
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
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }

      if (this.querySearch) {
        const { phone, dateValue } = this.querySearch
        const extra = { phone: phone }
        if ((dateValue || []).length) {
          const [startCreate, endCreate] = dateValue
          Object.assign(extra, {
            startCreateTime: (startCreate as Date).toISOString(),
            endCreateTime: (endCreate as Date).toISOString()
          })
        }
        Object.assign(query, extra)
      }

      const { data } = await getUserPages(query)
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
    async handleClick (id: string) {
      const { data } = await gainAccessByUser(id)
      if (data.data && Array.isArray(data.data)) {
        const roles = data.data
          .map((vals: {id: string}) => vals.id)
        this.content = {
          userId: id,
          roleIdList: roles
        }
        this.dialogVisible = true
      } else {
        this.$message.error('请求出错，请稍后再试')
      }
    },
    handleClose () {
      this.dialogVisible = false
    },
    onSubmitSuccess () {
      console.log(this.content)
      this.dialogVisible = false
    },
    async gainAccessRoles () {
      const { data } = await gainAccessRoles()
      if (data.data && Array.isArray(data.data)) {
        const options = data.data
          .map((vals: OptionProps) => {
            return {
              value: vals.id,
              label: vals.name
            }
          })
        this.options = options
      }
    }
  },
  mounted () {
    this.loadSource()
    this.gainAccessRoles()
  }
})
</script>

<style lang="scss" scoped>
.search-oprate {
  display: flex;
  justify-content: space-between;
}
</style>
