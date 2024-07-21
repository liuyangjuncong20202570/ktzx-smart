import request from '../utils/request.js'
// 学生列表
export const jobList = (data) => {
    return request.page.post('/my/paper/pager', data)
}

export const answerDetail = (id) => {
    return request.page.get('/my/paper/answer/detail?testId=' + id)
}