<template>
  <div class="alloc-resource-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search">
          分配资源
        </div>
        <div class="search-call">
        </div>
      </div>
      <div>
        <div v-for="item in resource" :key="item.id">
          <el-row class="">
             <el-col :span="24">
              <div class="grid-content bg-purple-dark padding-style">
                <el-checkbox
                  :indeterminate="item.isIndeterminate"
                  v-model="item.selected"
                  @change="handleCheckAllChange(item)">{{item.name}}</el-checkbox>
              </div>
            </el-col>
          </el-row>
          <el-row class="padding-style">
            <el-checkbox-group v-model="item.checkedItems" @change="(value) => handleCheckedItemChange(value, item)">
              <el-col class="bg-purple-light" v-for="wrapper in item.resourceList" :key="wrapper.id" :span="8">
                <el-checkbox :label="wrapper.id">{{wrapper.name}}</el-checkbox>
              </el-col>
            </el-checkbox-group>
          </el-row>
        </div>
      </div>
       <div class="layout-center-style">
        <div class="layout-center">
          <el-button size="small" type="primary" @click="saveMenuBtn">保 存</el-button>
          <el-button size="small" @click="clearBothInfo">清 空</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getRoleResources,
  getResourceAll,
  allocateRoleResources
} from '@/service/access.ts'

interface ValsProps {
  id: string;
  selected: boolean;
  name: string;
  resourceList: ValsProps[];
}

interface DataProps {
  id: string;
  selected: boolean;
  name: string;
  isIndeterminate: boolean;
  checkedItems: any[];
  resourceList: any[];
}

export default Vue.extend({
  name: 'allocResourcePage',
  data () {
    return {
      roleId: '',
      resource: [] as DataProps[]
    }
  },
  methods: {
    async loadSource () {
      const { data } = await getResourceAll()
      if (data.data) {
        // console.log(data.data)
      }
    },
    async getRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      if (data.data && Array.isArray(data.data)) {
        this.resource = data.data.map((vals: ValsProps) => {
          const list = vals.resourceList.map(item => ({
            id: item.id,
            selected: item.selected,
            name: item.name
          }))
          const checkedItems = list.filter(item => item.selected)
            .map(item => item.id)
          return {
            id: vals.id,
            selected: checkedItems.length === list.length,
            name: vals.name,
            isIndeterminate: checkedItems.length > 0 && checkedItems.length < list.length,
            checkedItems: checkedItems,
            resourceList: list
          }
        })
      }
    },
    handleCheckAllChange (item: DataProps) {
      if (item.selected) {
        item.checkedItems = item.resourceList
          .map(vals => vals.id)
      } else {
        item.checkedItems = []
      }
      item.isIndeterminate = false
    },
    handleCheckedItemChange (value: string[], item: DataProps) {
      const checkedCount = value.length
      const targetCount = item.resourceList.length
      item.selected = checkedCount === targetCount
      item.isIndeterminate = checkedCount > 0 && checkedCount < targetCount
    },
    saveMenuBtn () {
      console.log(allocateRoleResources)
      const selectedKeys = this.resource
        .map((vals: DataProps) => vals.checkedItems)
        .reduce((p, n) => p.concat(n), [])
      this.$confirm('是否分资源', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await allocateRoleResources({
          roleId: this.roleId,
          resourceIdList: selectedKeys
        })
        if (data.data) {
          this.getRoleResources()
          this.$message.success('操作成功')
        } else {
          this.$message.error('请求异常，请稍后再试')
        }
        this.loadSource()
      }).catch(() => {
        console.clear()
      })
    },
    clearBothInfo () {
      this.resource = this.resource.map((item: DataProps) => {
        item.selected = false
        item.checkedItems = []
        item.isIndeterminate = false
        return item
      })
    }
  },
  mounted () {
    const { roleId } = this.$route.query
    this.roleId = roleId as string
    if (!this.roleId) {
      this.$router.push({ path: '/errors' })
    }
    this.loadSource()
    this.getRoleResources()
  }
})
</script>

<style lang="scss" scoped>
.padding-style {
  padding: 0 16px;
}
.bg-purple-dark {
  border-radius: 4px;
  line-height: 40px;
  background: #d3dce6;
}

.bg-purple-light {
  line-height: 40px;
}

.layout-center-style {
  display: flex;
  justify-content: center;

  .layout-center {
    margin-top: 18px;
    display: flex;
    justify-content: space-between;
    width: 180px;
  }
}
</style>
