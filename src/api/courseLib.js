import request from '../utils/request.js'
// 添加课堂题目
export const addCourseLib = (data) => {
    return request.page.post('/courseLib/add', data)
}
// 课堂kwa
export const courseLibKwaMap = () => {
    return request.page.get('/courseLib/kwa/map')
}
// 课堂添加kwa
export const courseLibKwaTree = () => {
    return request.page.get('/courseLib/kwa/tree')
}
// 课堂题型
export const courseLibType = () => {
    return request.page.get('/courseLib/type/list')
}
// 课堂列表
export const courseLibList = (data) => {
    return request.page.post('/courseLib/pager', data)
}
// 获得题型列表
export const courseLibTypeList = () => {
    return request.page.get('/courseLib/type/list')
}
// 复制题目
export const courseLibCopy = (data) => {
    return request.page.get('/courseLib/copy?id=' + data)
}
// 删除题目
export const courseLibDel = (data) => {
    return request.page.post('/courseLib/delete', data)
}
// 编辑题目
export const courseLibEdit = (data) => {
    return request.page.post('/courseLib/update', data)
}

export const login = () => {
    return request.fork.get('/login?loginName=test1&pwd=123456&catelog=2&loginway=1&roleId=516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21&obsId=2c918af681fa6ea7018209a505c30672&userType=teacher')
}