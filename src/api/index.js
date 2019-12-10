/*包含 n 个接口请求函数的模块 每个函数返回 promise */ 
import ajax from './ajax' 

const BASE=""

// 登陆 
export const reqLogin = (username, password) => ajax(BASE+'/login', {username, password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(BASE+'/manage/user/add', user, 'POST')
