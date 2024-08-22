/*
 * @Date: 2024-07-16 11:49:30
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-19 14:13:12
 * @FilePath: \smarttt_ktzx\src\api\practice\index.ts
 */
import request from '../../utils/request.js'
import {PageVO,DefaultParamVO,StudentPageVO,StudentParamVO} from './type.js'
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
export const studentList = (data:StudentPageVO) => {
    return request.page.post(`/practice/student/pager`,data)
}

// 学生实验批改详情
export const studentCorrect = (params:StudentParamVO) => {
    return request.page.get(`/practice/correct/stuDetail`,{params:params})
}
// 批改页-提交批改
export const studentSave = (data) => {
    return request.page.post(`/practice/correct/correct/save`,data)
}
// 批改页-编辑批改
export const practiceUpdate = (data) => {
    return request.page.post(`/practice/edit/update`,data)
}
// 页面权限接口
export const studentWR = () => {
    return request.page.get('/practice/getWR')
}
// 成绩下载
export const practiceDownload = (id) => {
    return request.page.get('/practice/student/download?practiceId=' + id)
}
// 查看学生下载
export const practiceStuDetail = ({ practiceId, stuId }) => {
    return request.page.get('/practice/student/stuDetail?practiceId=' + practiceId + '&stuId=' + stuId)
}