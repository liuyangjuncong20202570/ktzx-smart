    import request from '../utils/request.js'
// 学生实验列表
export const practiceList = (data) => {
    return request.page.post('/my/practice/pager', data)
}
// 学生实验详情
export const stuDetail = (id) => {
    return request.page.get('/my/practice/answer/stuDetail?practiceId=' + id)
}
// 提交实验
export const practiceSubmit = (data) => {
    return request.page.post('/my/practice/answer/submit', data)
}
// 保存实验
export const practiceSave = (data) => {
    return request.page.post('/my/practice/answer/save', data)
}
