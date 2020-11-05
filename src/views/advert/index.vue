<template>
  <div class="menu-wrapper">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span></span>
        <el-button size="small" type="primary" @click="toPageOfAdvert">添加广告</el-button>
      </div>
      <div>
        <el-table
          :data="adverts"
          style="width: 100%">
          <el-table-column
            prop="id"
            width="80px"
            label="广告ID">
          </el-table-column>
          <el-table-column
            prop="name"
            label="广告名称">
          </el-table-column>
          <el-table-column
            prop="parentId"
            label="广告位置">
          </el-table-column>
          <el-table-column
            width="120px"
            label="广告图片">
            <template slot-scope="scope">
              <img style="object-fit: cover;" :src="scope.row.img" alt="" height="60" width="60" srcset="">
            </template>
          </el-table-column>
          <el-table-column
            label="时间">
            <template slot-scope="scope">
              <div class="format-string">
                <span>开始时间：{{scope.row.startTimeFormatString}}</span>
                <span>到期时间：{{scope.row.endTimeFormatString}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateStatus"
            width="120px"
            label="上线/下线">
            <template slot-scope="scope">
              <el-switch
                @change="statusChange(scope.row)"
                :value="scope.row.updateStatus">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="160">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row.id)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { getAdverts, advertUpdateStatus } from '@/service/adverts.ts'
import Vue from 'vue'

export default Vue.extend({
  name: 'AdvertPage',
  data () {
    return {
      adverts: []
    }
  },
  methods: {
    async loadSource () {
      const { data } = await getAdverts()
      if (data.success) {
        for (const iterator of data.content) {
          iterator.updateStatus = iterator.status === 1
        }
        this.adverts = data.content
      }
    },
    toPageOfAdvert () {
      this.$router.push('/create-advert')
    },
    handleClick (id: string) {
      this.$router.push(`/edit-advert/${id}`)
    },
    statusChange (row: { id: string; status: number }) {
      this.$confirm('是否要修改上线/下线状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await advertUpdateStatus({
          id: row.id,
          status: row.status ? 0 : 1
        })
        if (data.message) {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.loadSource()
        }
      }).catch(() => console.clear())
    }
  },
  mounted () {
    this.loadSource()
  }
})
</script>

<style lang="scss" scoped>
.format-string {
  display: flex;
  flex-direction: column;
}
</style>
