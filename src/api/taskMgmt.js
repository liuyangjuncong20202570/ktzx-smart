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
// 获取所有学期信息
export const queFormDel = (data) => {
    return request.page.post('/paper/delete', data)
}
// 预览页-试卷详情
export const previewDetail = (id) => {
    return request.page.get('/paper/preview/detail?id=' + id)
}
// 组卷页-搜索题库试题
export const teskSearch = (data) => {
    return request.page.post('/paper/edit/search', data)
}
// 组卷页-搜索题库试题
export const searchToPaper = (data) => {
    return request.page.post('/paper/edit/searchToPaper', data)
}

// 组卷页-全量保存
export const taskSave = (data) => {
    return request.page.post('/paper/edit/save', data)
}
// 组卷页-批量删除试题
export const taskdel = (data) => {
    return request.page.post('/paper/edit/delete', data)
}
// 试卷复制
export const taskCopy = (id) => {
    return request.page.get('/paper/copy?id=' + id)
}
// 试卷发布
export const taskPublish = (id) => {
    return request.page.get('/paper/publish?paperId=' + id)
}
// 试卷加锁
export const taskLock = (id) => {
    return request.page.get('/paper/lock?id=' + id)
}
// 试卷解锁
export const taskUnlock = (id) => {
    return request.page.get('/paper/unlock?id=' + id)
}
// 学生列表
export const studentList = (id) => {
    return request.page.get('/paper/student/student/list?paperId=' + id)
}
// 批改页-学生作业详情
export const correctDetail = ({ stuId, testId }) => {
    return request.page.get(`/paper/correct/detail?stuId=${stuId}&testId=${testId}`)
}