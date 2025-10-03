import request from '../utils/request.js'
// 学生列表
export const jobList = (data) => {
    return request.page.post('/my/paper/pager', data)
}
// 作业详情
export const answerDetail = (id) => {
    return request.page.get('/my/paper/answer/detail?testId=' + id)
}
// 作业统计
export const answerSummary = () => {
    return request.page.get('/my/paper/answer/summary')
}
// 保存作业
export const answerSave = (data) => {
    return request.page.post('/my/paper/answer/save', data)
}
// 提交作业
export const answerSubmit = (data) => {
    return request.page.post('/my/paper/answer/submit', data)
}
// 问卷列表
export const queFormList = (data) => {
    return request.page.post('/my/queForm/pager', data)
}