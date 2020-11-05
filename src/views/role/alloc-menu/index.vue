<template>
  <div class="alloc-menu-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="search">
          分配权限
        </div>
        <div class="search-call">
        </div>
      </div>
      <div>
        <el-tree
          ref="tree"
          :data="MenuNodes"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="selectedKeys"
          :props="defaultProps">
          </el-tree>
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
import { Tree } from 'element-ui'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/service/access.ts'

interface MenuProps {
  id: string;
  selected: boolean;
  subMenuList: MenuProps[];
}

export default Vue.extend({
  name: 'allocMenuPage',
  data () {
    return {
      MenuNodes: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      selectedKeys: [] as string[],
      roleId: ''
    }
  },
  methods: {
    async loadSource () {
      const { data } = await getMenuNodeList()
      if (data.data) {
        this.MenuNodes = data.data
      }
    },
    clearBothInfo () {
      (this.$refs.tree as Tree).setCheckedKeys([])
    },
    saveMenuBtn () {
      const selectedKeys = (this.$refs.tree as Tree)
        .getCheckedKeys()
      this.$confirm('是否分配菜单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await allocateRoleMenus({
          roleId: this.roleId,
          menuIdList: selectedKeys
        })
        if (data.data) {
          this.getRoleMenus()
          this.$message.success('操作成功')
        } else {
          this.$message.error('请求异常，请稍后再试')
        }
        this.loadSource()
      }).catch(() => {
        console.clear()
      })
    },
    async getRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.data && Array.isArray(data.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataWrappers: any[] = data.data
          .map((menu: MenuProps) => {
            return (menu.subMenuList || [])
              .filter(item => item.selected)
              .map(item => item.id)
              .concat(menu.selected ? [menu.id] : [])
          })
        const result = dataWrappers
          .filter(item => item.length)
          .reduce((p, n) => p.concat(n), [])
        this.selectedKeys = result
      }
    }
  },
  mounted () {
    this.roleId = this.$route
      .query.roleId as string
    if (!this.roleId) {
      this.$router.push({ path: '/errors' })
    }
    this.loadSource()
    this.getRoleMenus()
  }
})
</script>

<style lang="scss" scoped>
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
