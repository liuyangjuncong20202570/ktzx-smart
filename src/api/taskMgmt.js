import request from '../utils/request.js'
// 新建试卷
export const addPaper = (data) => {
    return request.page.post('/paper/add', data)
}
// 试卷列表
export const taskList = (data) => {
    return request.page.post('/paper/pager', data)
}

// 获取当前学期
export const getTermCurrent = () => {
    return request.term.get('/current')
}
// 获取所有学期信息
export const getTermAll = () => {
    return request.term.get('/all')
}