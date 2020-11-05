<template>
  <el-container>
    <el-aside width="auto" class="sidebar">
      <div class="icon-edu-boss">
        <el-avatar style="icon-edu-boss-avatar" shape="square" size="small" :src="require('@/assets/logo.e8b9190b.png')"></el-avatar>
        <transition name="fade-collapse">
          <h1 class="is-collapse-boss" v-show="isCollapse === false">Edu Boss</h1>
        </transition>
      </div>
      <el-menu
        class="el-menu-vertical-demo is-collapse-menu"
        :default-active="isActiveRoute"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        :collapse="isCollapse">
        <el-submenu index="access-wrapper">
          <template slot="title">
            <i class="el-icon-s-operation"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item index="/role">
            <i class="el-icon-s-management"></i><span>角色列表</span>
          </el-menu-item>
          <el-menu-item index="/menu">
            <i class="el-icon-menu"></i><span>菜单列表</span>
          </el-menu-item>
          <el-menu-item index="/resource">
            <i class="el-icon-s-data"></i><span>资源列表</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/course">
          <i class="el-icon-film"></i>
          <span slot="title">课程管理</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-submenu index="advert-wrapper">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>广告管理</span>
          </template>
          <el-menu-item index="/advert">
            <i class="el-icon-s-marketing"></i><span>广告列表</span>
          </el-menu-item>
          <el-menu-item index="/advert-space">
            <i class="el-icon-s-finance"></i><span>广告位列表</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="el-header-left">
          <span class="is-collapse-toggle" @click="toggleCollapse">
            <i :class='[isCollapse ? "el-icon-s-unfold": "el-icon-s-fold"]'></i>
          </span>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/role' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="el-header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar size="small" :src="userInfo.portrait || squareUrl"></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>{{userInfo.userName}}</el-dropdown-item>
              <el-dropdown-item @click.native="logout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserInfo } from '@/service/users.ts'

export default Vue.extend({
  name: 'LayoutPage',
  data () {
    return {
      isCollapse: false,
      squareUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      userInfo: {
        userName: '',
        portrait: ''
      }
    }
  },
  computed: {
    isActiveRoute (): string {
      return this.$route.path
    }
  },
  methods: {
    handleOpen (key: string, keyPath: string) {
      console.log(key, keyPath)
    },
    handleClose (key: string, keyPath: string) {
      console.log(key, keyPath)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    async loadSource () {
      const { data } = await getUserInfo()
      if (data.success) {
        this.userInfo = data.content
      }
    },
    logout () {
      this.$store.commit('setAuth', null)
      this.$router.push({ name: 'login' })
    }
  },
  mounted () {
    this.loadSource()
  }
})
</script>

<style lang="scss" scoped>
.el-container{
  min-height: 100vh;
}

.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-dropdown-link {
    cursor: pointer;
  }

  .el-header-left {
    display: flex;
    align-items: center;

    .is-collapse-toggle {
      cursor: pointer;
      font-size: 20px;
      padding: 10px;
      margin-right: 10px;
    }
  }
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;

  .is-collapse-menu:not(.el-menu--collapse) {
    width: 200px;
  }

  .is-collapse-menu {
    height: calc(100% - 60px);
    text-align: left;
  }

  .icon-edu-boss {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-avatar {
      margin: 10px;
    }
  }
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  min-width: 960px;
}

.el-aside, .el-main {
  overflow: auto;
}

.sidebar{
  position: sticky;
  top: 0;
  max-height: 100vh;
}

.fade-collapse-enter-active, .fade-collapse-leave-active {
  transition: opacity .1s;
}
.fade-collapse-enter, .fade-collapse-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>>
