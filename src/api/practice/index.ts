/*
 * @Date: 2024-07-16 11:49:30
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-19 14:13:12
 * @FilePath: \smarttt_ktzx\src\api\practice\index.ts
 */
import request from '../../utils/request.js'
import {PageVO,DefaultParamVO} from './type.js'
// 实验列表
export const practicePage = (data:PageVO) => {
    return request.page.post('/practice/pager', data)
}
// 实验模板
export const getTemplate = () => {
    return request.page.get('/practice/edit/getTemplate')
}

// kwa模版
export const kwaTree = () => {
    return request.page.get('/practice/edit/kwa/tree')
}

// 保存实验
export const savePractice = (data:DefaultParamVO) => {
    return request.page.post('/practice/edit/add',data)
}

// 删除实验
export const delPractice = (data:string[]) => {
    return request.page.post('/practice/delete',data)
}

// 发布实验
export const publishPractice = (id:string) => {
    return request.page.get(`/practice/publish?practiceId=${id}`,)
}

// 实验详情
export const practiceDetail = (id:string) => {
    return request.page.get(`/practice/edit/detail?practiceId=${id}`,)
}

// 学生实验
export const studentList = (id:string) => {
    return request.page.get(`/practice/student/list?practiceId=${id}`,)
}