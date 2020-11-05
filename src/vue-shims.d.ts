import Vue from 'vue'
import Router, { Route } from 'vue-router';

declare module 'vue/types/vue' {
  interface Vue {
    total: number | string;
    currentPage: number | string;
    pageSize: number | string;
    records: any[];
    handleSizeChange: Function;
    handleCurrentChange: Function;
    dataSolve: Function;
  }
}
