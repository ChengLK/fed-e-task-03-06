<template>
  <div class="course-update-wrapper">
    <el-form :model="content" :rules="rules" label-position="left" label-width="100px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <div class="info-content-space">
          <el-form-item label="名称" prop="courseName">
            <el-input v-model="content.courseName" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="">
            <el-input v-model="content.brief" placeholder="简介"></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="content.teacherName" placeholder="讲师姓名"></el-input>
          </el-form-item>
          <el-form-item label="职位">
            <el-input v-model="content.position" placeholder="职位"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="content.description" placeholder="讲师简介"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input v-model="content.previewFirstField" placeholder="课程概述"></el-input>
          </el-form-item>
          <el-form-item label="课程封面">
             <div class="">
              <el-upload
                :http-request="httpRequestImgUrl"
                class="avatar-uploader"
                action="http://eduboss.lagou.com/boss/course/upload"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload">
                <div class="wrapper-content">
                  <img v-if="content.courseImgUrl" :src="content.courseImgUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
              <el-tag slot="tip" type="info">建议尺寸：230*230px，JPG、PNG格式，图片小于150K</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="解锁封面">
            <div class="">
              <el-upload
                ref="cover"
                :http-request="httpRequestListImg"
                class="avatar-uploader"
                action="http://eduboss.lagou.com/boss/course/upload"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload">
                <div class="wrapper-content">
                  <img v-if="content.courseListImg" :src="content.courseListImg" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
              <el-tag slot="tip" type="info">建议尺寸：230*230px，JPG、PNG格式，图片小于150K</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input v-model="content.sortNum" placeholder="课程排序"></el-input>
          </el-form-item>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>销售信息</span>
        </div>
        <div class="info-content-space">
          <el-form-item label="售卖价格">
            <el-input v-model="content.discounts" placeholder="售卖价格"></el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model="content.price" placeholder="商品原价"></el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model="content.sales" placeholder="销量"></el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="content.discountsTag" placeholder="活动标签"></el-input>
          </el-form-item>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>秒杀活动</span>
        </div>
        <div class="info-content-space">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="content.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <div class="activity-course" v-if="content.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="content.beginTime"
                type="datetime"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="content.endTime"
                type="datetime"
                placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input v-model="content.amount" placeholder="秒杀价"></el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input v-model="content.stock" placeholder="秒杀库存"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>课程详情</span>
        </div>
        <div class="info-content-space">
          <mavon-editor v-model="content.courseDescriptionMarkDown"></mavon-editor>
        </div>
        <div class="footer-content">
          <el-button
            type="primary"
            size="small"
            @click="onSubmitSuccess"
            style="width: 120px;">保存</el-button>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import showdown from 'showdown'
import { getCourseById, uploadChangeFile, saveOrUpdateCourse } from '@/service/course.ts'

const Converter = new showdown.Converter()

export default Vue.extend({
  name: 'CourseUpdateWrapper',
  props: ['courseId'],
  data () {
    return {
      content: {
        courseName: '',
        brief: '',
        job: '',
        description: '',
        courseImgUrl: '',
        courseListImg: '',
        status: '1',
        sortNum: '',
        discountsTag: '',
        discounts: '',
        price: '',
        sales: '',
        activityCourse: false,
        beginTime: '',
        endTime: '',
        amount: '',
        stock: '',
        courseDescriptionMarkDown: '',
        teacherDTO: {},
        activityCourseDTO: {}
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入简介', trigger: 'blur' }
        ],
        // teacherName: [
        //   { required: true, message: '请输入讲师姓名', trigger: 'blur' }
        // ],
        job: [
          { required: true, message: '请输入职位', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入讲师简介', trigger: 'blur' }
        ]
      },
      instance: null,
      activityCourseDTO: ['beginTime', 'endTime', 'amount', 'stock'],
      teacherDTO: ['teacherName', 'position', 'description']
    }
  },
  methods: {
    async onSubmitSuccess () {
      if (this.content.activityCourse) {
        for (const prop of this.activityCourseDTO) {
          Reflect.set(this.content.activityCourseDTO, prop, Reflect.get(this.content, prop))
        }
      }
      for (const prop of this.activityCourseDTO) {
        Reflect.defineProperty(this.content, prop, {})
      }
      for (const prop of this.teacherDTO) {
        Reflect.set(this.content.teacherDTO, prop, Reflect.get(this.content, prop))
        Reflect.defineProperty(this.content, prop, {})
      }
      const { data } = await saveOrUpdateCourse(this.content)
      if (data.code === '000000') {
        this.$message.success('操作成功')
        this.$router.push('/course')
      } else {
        this.$message.error('请检查提交信息，重新提交')
      }
    },
    async loadSource () {
      const { data } = await getCourseById(this.courseId)
      if (data.data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { courseDescriptionMarkDown, activityCourseDTO, teacherDTO } = data.data

        if (/^<(\S*?)[^>]*>.*?|<.*? \/>$/.test(courseDescriptionMarkDown)) {
          this.content = {
            ...data.data,
            courseDescriptionMarkDown: Converter.makeMarkdown(courseDescriptionMarkDown).replace('<!-- -->', '')
          }
        } else {
          this.content = data.data
        }
        if (activityCourseDTO) {
          for (const key of this.activityCourseDTO) {
            Reflect.set(this.content, key, activityCourseDTO[key])
          }
        }
        for (const key of this.teacherDTO) {
          Reflect.set(this.content, key, teacherDTO[key])
        }
      }
    },
    beforeAvatarUpload (file: File) {
      console.log(file)
    },
    async httpRequestImgUrl (post: { file: File }) {
      this.httpRequest(post, 'courseImgUrl')
    },
    async httpRequestListImg (post: { file: File }) {
      this.httpRequest(post, 'courseListImg')
    },
    async httpRequest (post: { file: File }, prop: string) {
      const form = new FormData()
      form.append('file', post.file)
      const { data } = await uploadChangeFile(form)
      if (data.data) {
        Reflect.set(this.content, prop, data.data.name)
      }
    }
  },
  mounted () {
    if (this.courseId) {
      this.loadSource()
    }
  }
})
</script>

<style lang="scss" scoped>
.course-update-wrapper {
  .info-content-space {
    padding-left: 20px;
    width: 90%;
  }

  .footer-content {
    display: flex;
    justify-content: center;
    margin-top: 25px;
    width: 90%;
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
}
</style>
