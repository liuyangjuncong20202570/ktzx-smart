import request from '../utils/request.js'
// 问卷列表
export const queFormPager = (data) => {
    return request.page.post('/queForm/pager', data)
}
// 新建问卷
export const queFormEdit = (data) => {
    return request.page.post('/queForm/edit/add', data)
}
// 删除问卷
export const queFormDel = (data) => {
    return request.page.post('/queForm/delete', data)
}
// 编辑问卷
export const queFormUpdate = (data) => {
    return request.page.post('/queForm/edit/update', data)
}
// 题型列表
export const queFormTypeList = () => {
    return request.page.get('/queForm/edit/type/list')
}
// 编辑页问卷详情
export const queFormDetail = (id) => {
    return request.page.get('/queForm/edit/detail?id='+id)
}
// 删除题目
export const deleteTopic = (data) => {
    return request.page.post('/queForm/edit/deleteTopic', data)
}
// 编辑页-发布问卷
export const quePublish = (id) => {
    return request.page.get('/queForm/edit/publish?qfId='+id)
}
// 学生列表页-学生列表
export const queStudentList = (id) => {
    return request.page.get('/queForm/student/list?qfId='+id)
}
// 问卷预览
export const queStudentDetail = (id) => {
    return request.page.get('/queForm/student/detail?qfId='+id)
}