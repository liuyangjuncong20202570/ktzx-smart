import request from '../utils/request.js'
// 添加课堂题目
export const addClassroomLib = (data) => {
    return request.page.post('/classroomLib/add', data)
}
// 课堂kwa
export const classroomLibKwaMap = () => {
    return request.page.get('/classroomLib/kwa/map')
}
// 课堂添加kwa
export const classroomLibKwaTree = () => {
    return request.page.get('/classroomLib/kwa/tree')
}
// 课堂题型
export const classroomLibType = () => {
    return request.page.get('/classroomLib/type/list')
}
// 课堂列表
export const classroomLibList = (data) => {
    return request.page.post('/classroomLib/pager', data)
}
// 复制题目
export const classroomLibCopy = (data) => {
    return request.page.get('/classroomLib/copy?id=' + data)
}
// 删除题目
export const classroomLibDel = (data) => {
    return request.page.post('/classroomLib/delete', data)
}
// 编辑题目
export const classroomLibEdit = (data) => {
    return request.page.post('/classroomLib/update', data)
}
// 获取课程题型设定
export const classroomLibTypeList = () => {
    return request.page.get('/classroomLib/type/list')
}
// 获取课程保存题型设定
export const classroomLibTypeSetStatus = (data) => {
    return request.page.post('/classroomLib/type/setStatus', data)
}

// 获取课程题型同步列表
export const classroomLibSyncPager = (data) => {
    return request.page.post('/classroomLib/sync/pager', data)
}
// 接收审批
export const classroomLibSyncAccept = (data) => {
    return request.page.post('/classroomLib/sync/accept', data)
}
// 获取课程保存题型设定
export const classroomLibSyncReject = (data) => {
    return request.page.post('/classroomLib/sync/reject', data)
}

export const login = () => {
    return request.fork.get('/login?loginName=test1&pwd=123456&catelog=2&loginway=1&roleId=516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21&obsId=2c918af681fa6ea7018209a505c30672&userType=teacher')
}