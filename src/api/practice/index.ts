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
    return request.page.post(`/practice/correct/save`,data)
}
// 批改页-编辑批改
export const practiceUpdate = (data) => {
    return request.page.post(`/practice/edit/update`,data)
}
// 修改校验接口
export const practiceUpdateChecking = (data) => {
    return request.page.post(`/practice/edit/updateChecking`,data)
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
// 列表页-排序向下
export const sortPractice = (id: string) => {
    return request.page.get('/practice/downward?practiceId=' + id )
}
// 列表页-排序向上
export const sortPracticeUp = (id: string) => {
    return request.page.get('/practice/upward?practiceId=' + id )
}
// 列表页-批量复制
export const batchCopy = (data) => {
    return request.page.post(`/practice/copy`,data)
}
// 批改页-上一页
export const prePageApi = (practiceId:string,stuId:string) => {
    return request.page.get('/practice/correct/previous?practiceId=' + practiceId + '&stuId=' + stuId)
}
// 批改页-下一页
export const nextPageApi = (practiceId:string,stuId:string) => {
    return request.page.get('/practice/correct/next?practiceId=' + practiceId + '&stuId=' + stuId)
}
// 批改页-下一页
export const nextPageApi1 = (practiceId:string) => {
    return request.page.get('/practice/correct/next?practiceId=' + practiceId)
}
// 退回
export const fallBackApi = (data) => {
    return request.page.get('/practice/student/fallback',{params:data})
}
// 批改页-合成附件图片
export const synthesisImgApi = (data) => {
    return request.page.get('/practice/correct/genImg',{params:data})
}
// 下载所有成绩
export const downLoadAllApi = () => {
    return request.page.get('/practice/student/download/all')
}
// 停止实验
export const stopPractice = (id:string) => {
    return request.page.get('/practice/stop?practiceId=' + id)
}
// 重新发布实验
export const rePublishPractice = (id:string) => {
    return request.page.get('/practice/rePublish?practiceId=' + id)
}
// 成绩列表
export const scoreList = (data:StudentPageVO) => {
    return request.page.post(`/practice/score/pager`,data)
}
// 有效实验列表
export const validPracticeList = () => {
    return request.page.get(`/practice/score/map`)
}

// 获取下载信息
export function getDownloadInfo(practiceId) {
    return request.page.get('/practice/download/info?practiceId=' + practiceId)
}

// 启动下载任务
export function startDownload(data) {
    return request.page.post(`/practice/download/start`,data)
}

// 设置学生是否可以查看批改详情
export function setStuCanReadCorrect(data: {
  practiceId: string | number;
  can: number;
}) {
    return request.page.get(`/practice/student/setStuCanReadCorrect`,{params:data})
}