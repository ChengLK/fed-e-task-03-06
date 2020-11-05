import { Message } from 'element-ui'
import Vue from 'vue'

const DataApplyMixin = Vue.extend({
  data () {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      records: []
    }
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataSolve (data: { data: any }, pageSize: number | string) {
      if (data.data) {
        const { records = [], total = 0, current = 1, size = pageSize } = data.data
        this.total = total
        this.pageSize = size
        this.currentPage = current
        this.records = records
      } else {
        Message.error('请求错误，请稍后再试')
      }
    }
  }
})

export {
  DataApplyMixin
}
