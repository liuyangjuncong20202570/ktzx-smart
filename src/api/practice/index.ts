/*
 * @Date: 2024-07-16 11:49:30
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-16 17:49:41
 * @FilePath: \smarttt_ktzx\src\api\practice\index.ts
 */
import request from '../../utils/request.js'
import {PageVO} from './type.js'
// 实验列表
export const practicePage = (data:PageVO) => {
    return request.page.post('/practice/pager', data)
}
// 实验模板
export const getTemplate = () => {
    return request.page.get('/practice/edit/getTemplate')
}