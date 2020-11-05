<template>
  <div class="login-wrapper">
    <div class="header-align">
      <h1>Edu boss-管理系统</h1>
    </div>
    <div class="el-form-wrapper">
      <el-card class="box-card">
        <div slot="header" class="clearfix-header">
          <span>登录</span>
        </div>
        <el-form
          ref="form"
          class="el-form-login"
          label-position="top"
          label-width="80px"
          :model="formAlign"
          :rules="rules">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formAlign.phone" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" show-password v-model="formAlign.password" maxlength="16"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%;" :loading="isLoading" type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { login } from '@/service/users.ts'

export default Vue.extend({
  name: 'LoginPage',
  data () {
    return {
      formAlign: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]{1}\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      },
      isLoading: false
    }
  },
  methods: {
    onSubmit () {
      (this.$refs.form as Form)
        .validate(async (valid: boolean) => {
          if (valid) {
            this.isLoading = true
            const { data } = await login(this.formAlign)
            if (data.success) {
              this.$store.commit('setAuth', data.content)
              this.isLoading = false
              const { redirect = '/role' } = this.$route.query
              this.$router.push({ path: redirect as string })
            } else {
              this.$message({
                message: data.message,
                type: 'warning',
                showClose: true,
                onClose: () => {
                  this.isLoading = false
                }
              })
            }
          }
        })
    }
  }
})
</script>

<style lang="scss" scoped>
.login-wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;

  .header-align {
    margin: 50px 0px;
    font-size: 1.2rem;
  }

  .el-form-login {
    width: 320px;
  }

  .clearfix-header {
    font-weight: 600;
    font-size: 1.2rem;
  }
}
</style>
