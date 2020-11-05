<template>
  <div class="sections-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{content.courseName}}</span>
        <el-button type="primary" size="small" @click="createContent">添加章节</el-button>
      </div>
      <div class="info-content-space">
        <el-tree
         node-key="id"
         :expand-on-click-node="false"
         :data="isTreeWrapper">
          <div class="custom-tree-node inner" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span class="actions">
              <el-button
                @click="editContent(data)"
                size="mini">
                编辑
              </el-button>
              <el-button
                @click="updateContent(data)"
                size="mini">
                {{data.children ? '添加课时' : '上传视频'}}
              </el-button>
              <el-button
                @click="updateRowStatus(data)"
                size="mini">
                {{dataStatus[data.status]}}
              </el-button>
            </span>
          </div>
        </el-tree>
      </div>
    </el-card>
    <el-dialog
      title="章节信息"
      :visible.sync="dialogItemVisible"
      width="50%"
      :before-close="handleCloseItem">
      <div class="section-wrapper">
        <el-form ref="sectionForm" :rules="sectionRules" size="small" :model="section" label-width="100px">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="section.courseName" maxlength="24" placeholder="课程名称" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="章节名称" prop="sectionName">
            <el-input v-model="section.sectionName" maxlength="24" placeholder="章节名称"></el-input>
          </el-form-item>
          <el-form-item label="章节描述">
            <el-input type="textarea" maxlength="48" :rows="2" resize="none" v-model="section.description" placeholder="章节描述"></el-input>
          </el-form-item>
          <el-form-item label="章节排序" prop="orderNum">
            <el-input v-model="section.orderNum" placeholder="章节排序">
              <template slot="append">数字控制排序，数字越大越靠后</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseItem">取 消</el-button>
        <el-button size="small" type="primary" @click="saveOrUpdateSection">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="课时基本信息"
      :visible.sync="dialogDtoVisible"
      width="50%"
      :before-close="handleCloseDto">
      <div class="course-wrapper">
        <el-form ref="courseForm" :rules="courseRules" size="small" :model="course" label-width="100px">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="course.courseName" maxlength="24" placeholder="课程名称" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="章节名称" prop="sectionName">
            <el-input v-model="course.sectionName" maxlength="24" disabled="disabled" placeholder="章节名称"></el-input>
          </el-form-item>
          <el-form-item label="课时名称" prop="theme">
            <el-input v-model="course.theme" maxlength="24" placeholder="课时名称"></el-input>
          </el-form-item>
          <el-form-item label="时长" prop="duration">
            <el-input v-model="course.duration" maxlength="4" placeholder="时长">
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
           <el-form-item label="是否开放试听" prop="isFree">
            <el-switch
              v-model="course.isFree"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item label="课时排序" prop="orderNum">
            <el-input v-model="course.orderNum" placeholder="课时排序">
              <template slot="append">数字控制排序，数字越大越靠后</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseDto">取 消</el-button>
        <el-button size="small" type="primary" @click="contentSaveOrUpdate">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改状态"
      :visible.sync="dialogStatusVisible"
      width="30%"
      :before-close="handleCloseStatus">
      <div>
        <span style="line-height: 42px;">
          当前状态：{{dataStatus[statusContent.cookieStatus]}}
        </span>
        <el-form :model="statusContent" size="small">
          <el-form-item label="状态变更为">
            <el-select v-model="statusContent.status" placeholder="请选择">
              <el-option
                v-for="(item, key) in dataStatus"
                :key="key"
                :label="item"
                :value="key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseStatus">取 消</el-button>
        <el-button size="small" type="primary" @click="handleUpdateStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Form } from 'element-ui'
import { getCourseById, getSectionAndLesson, contentSaveOrUpdate, saveOrUpdateSection } from '@/service/course.ts'
interface Props {
  id: string;
  sectionName: string;
  status: number | string;
  lessonDTOS: { id: string; theme: string; status: number }[];
}

interface WrapperProps extends Props {
  id: string;
  description: string;
  orderNum: string;
  courseId?: string;
  sectionId?: string;
  theme?: string;
  duration?: string;
  isFree?: boolean;
}

interface ItemProps {
  id: string;
  label: string;
  wrapper: WrapperProps;
  status: number;
  sectionName: string;
  children?: ItemProps[];
}

const OriginOsaWrapper = {
  id: '',
  status: '',
  courseId: '',
  courseName: '',
  sectionName: '',
  description: '',
  orderNum: ''
}

const OriginCsaWrapper = {
  id: '',
  sectionId: '',
  status: '',
  isFree: false,
  courseId: '',
  courseName: '',
  sectionName: '',
  theme: '',
  duration: '',
  orderNum: ''
}

export default Vue.extend({
  name: 'SectionsPage',
  props: ['id', 'courseName'],
  data () {
    return {
      isTreeWrapper: [],
      dialogItemVisible: false,
      dialogDtoVisible: false,
      dialogStatusVisible: false,
      dataStatus: {
        0: '已隐藏',
        1: '待更新',
        2: '已更新'
      },
      statusContent: {
        status: '',
        id: '',
        data: {} as Props,
        cookieStatus: '',
        isDTOS: false
      },
      section: Object.assign({}, OriginOsaWrapper),
      content: {
        id: '',
        courseName: ''
      },
      sectionRules: {
        courseName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' }
        ],
        sectionName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' }
        ],
        orderNum: [
          { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' }
        ]
      },
      course: Object.assign({}, OriginCsaWrapper),
      courseRules: {
        courseName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' }
        ],
        sectionName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' }
        ],
        theme: [
          { required: true, message: '请输入课时名称', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '请输入时长', trigger: 'blur' },
          { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' }
        ],
        orderNum: [
          { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async loadSource () {
      const { data } = await getSectionAndLesson(this.id)
      if (data.data && Array.isArray(data.data)) {
        this.isTreeWrapper = data.data.map((vals: Props) => {
          return {
            id: vals.id,
            label: vals.sectionName,
            wrapper: vals,
            status: vals.status,
            sectionName: vals.sectionName,
            children: (vals.lessonDTOS || []).map(lessonDTO => {
              return {
                id: lessonDTO.id,
                label: lessonDTO.theme,
                wrapper: lessonDTO,
                status: lessonDTO.status,
                sectionName: vals.sectionName
              }
            })
          }
        })
      }
    },
    editContent (data: ItemProps) {
      if (data.children) {
        this.section = Object.assign(this.section, data.wrapper)
        this.dialogItemVisible = true
      } else {
        const { sectionName } = data
        const { courseId, id, theme, sectionId, orderNum, duration, isFree } = data.wrapper
        this.course = Object.assign(this.course,
          { courseName: this.content.courseName, orderNum, duration, isFree },
          { courseId, sectionName, sectionId: sectionId, id: id, theme: theme })
        this.dialogDtoVisible = true
      }
    },
    createContent () {
      this.section = Object.assign({
      }, OriginOsaWrapper, {
        courseName: this.content.courseName,
        courseId: this.content.id
      })
      this.dialogItemVisible = true
    },
    async saveOrUpdateSection () {
      (this.$refs.sectionForm as Form).validate(async (isValid) => {
        if (isValid) {
          const { data } = await saveOrUpdateSection(this.section)
          if (data.code === '000000') {
            this.loadSource()
            this.$message.success('操作成功')
          }
          this.dialogItemVisible = false
        }
      })
    },
    updateContent (data: ItemProps) {
      if (data.children) {
        const { sectionName } = data
        const { courseId, id } = data.wrapper
        this.course = Object.assign({}, OriginCsaWrapper,
          { courseName: this.content.courseName },
          { courseId, sectionName, sectionId: id })
        this.dialogDtoVisible = true
      } else {
        console.log(data)
      }
    },
    contentSaveOrUpdate () {
      (this.$refs.courseForm as Form).validate(async isValid => {
        if (isValid) {
          const { data } = await contentSaveOrUpdate({
            ...this.course,
            durationNum: this.course.duration
          })
          if (data.code === '000000') {
            this.loadSource()
            this.$message.success('操作成功')
          }
          this.dialogDtoVisible = false
        }
      })
    },
    updateRowStatus (data: ItemProps) {
      const status = data.status.toString()
      this.statusContent = {
        id: data.id,
        data: data.wrapper,
        status: status,
        cookieStatus: status,
        isDTOS: Reflect.has(data, 'children')
      }
      this.dialogStatusVisible = true
    },
    handleCloseItem () {
      this.dialogItemVisible = false
    },
    handleCloseDto () {
      this.dialogDtoVisible = false
    },
    handleCloseStatus () {
      this.dialogStatusVisible = false
    },
    async handleUpdateStatus () {
      const callback = this.statusContent.isDTOS
        ? saveOrUpdateSection : contentSaveOrUpdate
      const { id, status } = this.statusContent
      // eslint-disable-next-line standard/no-callback-literal
      const { data } = await callback({ id, status })
      if (data.code === '000000') {
        this.loadSource()
        this.$message.success('操作成功')
      }
      this.dialogStatusVisible = false
    },
    async loadContent () {
      const { data } = await getCourseById(this.id)
      if (data.data) {
        this.content = data.data
        this.section.courseName = data.data.courseName
      }
    }
  },
  mounted () {
    this.loadSource()
    this.loadContent()
  }
})
</script>

<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  align-items: center;
  padding: 5px 0;
}
</style>
