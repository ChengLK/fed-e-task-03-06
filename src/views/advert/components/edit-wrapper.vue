<template>
   <el-card class="box-card">
    <div class="info-content-space">
      <el-form size="small" ref="form" :rules="rules" :model="content" label-width="80px">
        <el-form-item label="广告名称" prop="name">
          <el-input v-model="content.name" placeholder="广告名称" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="广告位置">
          <el-select filterable v-model="content.spaceId" placeholder="请选择广告位置">
            <el-option
              v-for="item in spaceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效时间" prop="dateValue">
          <el-date-picker
            v-model="content.dateValue"
            type="daterange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上线/下线">
          <el-radio-group v-model="content.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告图片">
          <div class="">
            <el-upload
              :http-request="httpRequest"
              class="avatar-uploader"
              action="http://eduboss.lagou.com/boss/course/upload"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload">
              <div class="wrapper-content">
                <img v-if="content.img" :src="content.img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-upload>
            <el-tag slot="tip" type="info">建议尺寸：230*230px，JPG、PNG格式，图片小于150K</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="广告链接" prop="link">
          <el-input v-model="content.link" placeholder="广告链接" maxlength="48"></el-input>
        </el-form-item>
        <el-form-item label="广告备注">
          <el-input
            type="textarea"
            resize="none"
            rows="3"
            maxlength="108"
            placeholder="广告备注"
            v-model="content.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 72px;" type="primary" @click="onSubmit">提交</el-button>
          <el-button style="width: 72px;">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { advertSaveOrUpdate, getAdvertById, getAdvertSpaces } from '@/service/adverts.ts'
import { Form } from 'element-ui'
import { uploadChangeFile } from '@/service/course'

export default Vue.extend({
  name: 'AdvertUpdateWrapper',
  props: ['id'],
  data () {
    return {
      content: {
        name: '',
        spaceId: '',
        startTime: '',
        endTime: '',
        status: 1,
        img: '',
        link: '',
        text: '',
        dateValue: []
      },
      rules: {
        name: [
          { required: true, message: '请输入广告名称', trigger: 'blur' }
        ],
        dateValue: [
          { required: true, message: '请选择有效时间', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入广告链接', trigger: 'blur' }
        ]
      },
      spaceOptions: []
    }
  },
  methods: {
    dataCompose (dateValue: number[]) {
      const offset = 28800000
      const [startTime, endTime] = dateValue
      return {
        startTime: new Date(startTime + offset).toISOString(),
        endTime: new Date(endTime + offset).toISOString()
      }
    },
    async onSubmit () {
      (this.$refs.form as Form).validate(async isValid => {
        if (isValid) {
          const query = { startTime: '', endTime: '' }
          if (this.content.dateValue.length) {
            Object.assign(query, this.dataCompose(this.content.dateValue))
          }
          const params = Object.assign(this.content, query, { dateValue: null })
          const { data } = await advertSaveOrUpdate(params)
          if (data.success) {
            console.log(data)
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$router.push('/advert')
          }
        }
      })
    },
    beforeAvatarUpload (file: File) {
      console.log(file)
    },
    async httpRequest (post: { file: File }) {
      const form = new FormData()
      form.append('file', post.file)
      const { data } = await uploadChangeFile(form)
      if (data.data) {
        this.content.img = data.data.name
      }
    },
    async loadSource (id: string) {
      const { data } = await getAdvertById(id)
      if (data.success) {
        const { startTime, endTime } = data.content
        const dateValue = [
          new Date(startTime), new Date(endTime)]
        this.content = Object.assign(data.content, {
          startTime: null,
          endTime: null,
          dateValue: dateValue
        })
      }
    },
    async getAdvertSpaces () {
      const { data } = await getAdvertSpaces()
      if (data.content && Array.isArray(data.content)) {
        this.spaceOptions = data.content
          .map((vals: { name: string; id: string }) => {
            return {
              label: vals.name,
              value: vals.id
            }
          })
      }
    }
  },
  mounted () {
    if (this.id) {
      this.loadSource(this.id)
    }
    this.getAdvertSpaces()
  }
})
</script>

<style scoped lang='scss'>
.info-content-space {
  width: 80%;
  padding-left: 24px;
}

.avatar-uploader {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }

  .avatar {
    width: 128px;
    height: 128px;
    display: inline-block;
  }
}
</style>
