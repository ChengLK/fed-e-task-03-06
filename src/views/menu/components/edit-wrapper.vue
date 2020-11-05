<template>
  <el-card class="box-card">
    <div class="info-content-space">
      <el-form size="small" label-position="left" ref="form" :rules="rules" :model="content" label-width="80px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="content.name" placeholder="菜单名称" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="content.href" placeholder="菜单路径" maxlength="48"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="content.parentId" placeholder="上级菜单">
            <el-option label="无上级菜单" :value="-1"></el-option>
            <el-option
              v-for="item in itmesByMenu"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="content.description" placeholder="描述" maxlength="48"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="content.icon" placeholder="前端图标" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="content.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="content.orderNum" placeholder="排序" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 98px;" type="primary" @click="onSubmit">提交</el-button>
          <el-button style="width: 98px;" v-if="isVisible" @click="resetState">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script lang="ts">
import { getRoleContent, menuSaveOrUpdate } from '@/service/access'
import Vue from 'vue'
import { Form } from 'element-ui'
const OriginByCreate = () => {
  return {
    name: '',
    href: '',
    parentId: -1,
    description: '',
    icon: '',
    shown: true,
    orderNum: ''
  }
}

const origin = OriginByCreate()

export default Vue.extend({
  name: 'EditWrapper',
  props: {
    id: {
      type: String,
      default: '-1'
    }
  },
  data () {
    return {
      content: origin,
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入前端图标', trigger: 'blur' }
        ],
        orderNum: [
          { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' }
        ]
      },
      itmesByMenu: []
    }
  },
  computed: {
    isVisible (): boolean {
      const fullPath: string = this.$route.fullPath
      return fullPath.includes('create-menu')
    }
  },
  methods: {
    onSubmit () {
      (this.$refs.form as Form).validate(isValid => {
        if (isValid) {
          this.$confirm('是否提交数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            const { data } = await menuSaveOrUpdate(this.content)
            if (data.data) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.$router.push('/menu')
            }
          }).catch(() => console.clear())
        }
      })
    },
    resetState () {
      this.content = OriginByCreate()
    },
    async loadSource (id: string) {
      const { data } = await getRoleContent(id)
      if (data.data) {
        const { menuInfo, parentMenuList } = data.data
        if (menuInfo) this.content = menuInfo
        this.itmesByMenu = parentMenuList || []
      }
    }
  },
  mounted () {
    if (this.id) {
      this.loadSource(this.id)
    }
  }
})
</script>

<style lang="scss" scoped>
.info-content-space {
  width: 80%;
  padding-left: 24px;
}
</style>
