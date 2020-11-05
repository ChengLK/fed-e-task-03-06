import { QueryProps } from '@/types/index.ts'
import request from './request'
interface UpdateProps {
  id?: string| number;
  courseName: string;
}

interface MinProps {
  id: string;
  status: string | number;
  [prop: string]: any;
}

const getQueryCourses = (payload: QueryProps = { currentPage: 1, pageSize: 10 }) => {
  return request.post('/boss/course/getQueryCourses', payload)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveOrUpdateCourse = (payload: any) => {
  return request.post('/boss/course/saveOrUpdateCourse', payload)
}

const courseChangeState = (params: { courseId: string; status: string }) => {
  return request.get('/boss/course/changeState', { params })
}

const uploadChangeFile = (payload: FormData) => {
  return request.post('/boss/course/upload', payload)
}

const getCourseById = (courseId: string) => {
  return request.get(`/boss/course/getCourseById?courseId=${courseId}`)
}

const getSectionAndLesson = (courseId: string) => {
  return request.get(`/boss/course/section/getSectionAndLesson?courseId=${courseId}`)
}

const contentSaveOrUpdate = (payload: MinProps) => {
  return request.post('/boss/course/lesson/saveOrUpdate', payload)
}

const saveOrUpdateSection = (payload: MinProps) => {
  return request.post('/boss/course/section/saveOrUpdateSection', payload)
}

export {
  saveOrUpdateCourse,
  getQueryCourses,
  courseChangeState,
  uploadChangeFile,
  getCourseById,
  getSectionAndLesson,
  contentSaveOrUpdate,
  saveOrUpdateSection
}
