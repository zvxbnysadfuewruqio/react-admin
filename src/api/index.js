/*包含 n 个接口请求函数的模块 每个函数返回 promise */ 
import jsonp from 'jsonp'
import {message} from 'antd'
import ajax from './ajax' 

const BASE=""

// 登陆 
export const reqLogin = (username, password) => ajax(BASE+'/login', {username, password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(BASE+'/manage/user/add', user, 'POST')

//获取分类列表   一级、二级
export const reqCategorys=(parentId)=>ajax(BASE+'/manage/category/list', {parentId})

//添加分类
export const reqCategoryAdd=(parentId,categoryName)=>ajax(BASE+'/manage/category/add', {parentId,categoryName}, 'POST')

//更新分类
export const reqCategoryUpdate=(categoryId,categoryName)=>ajax(BASE+'/manage/category/update', {categoryId,categoryName}, 'POST')

//添加、更改商品
export const reqProductAddUpdate=(product)=>ajax(BASE+'/manage/product/'+(product._id?"update":"add"), product, 'POST')

//获取商品分页列表
export const reqProducts=(pageNum,pageSize)=>ajax(BASE+'/manage/product/list', {pageNum,pageSize})

//搜索商品分类列表
export const reqSearchProducts=(pageNum,pageSize,searchName,searchType)=>ajax(BASE+'/manage/product/search', {pageNum,pageSize,[searchType]:searchName})

//根据分类ID获取分类
export const reqCategory=(categoryId)=>ajax(BASE+'/manage/category/info', {categoryId})

//对商品进行上架/下架处理
export const reqUpdateStatus=(productId,status)=>ajax(BASE+'/manage/product/updateStatus', {productId,status}, 'POST')

//删除图片
export const reqDeleteImg=(name)=>ajax(BASE+'/manage/img/delete', {name}, 'POST')

//获取所有角色列表
export const reqRoles=()=>ajax(BASE+'/manage/role/list')

//新增角色
export const reqAddRole=(roleName)=>ajax(BASE+'/manage/role/add', {roleName}, 'POST')

//更新角色(给角色设置权限)
export const reqUpdateRole=(role)=>ajax(BASE+'/manage/role/update', role, 'POST')

//获取所有用户列表
export const reqUsers=()=>ajax(BASE+'/manage/user/list')

//删除用户
export const reqDeleteUsers=(userId)=>ajax(BASE+'/manage/user/delete',{userId},'POST')

//添加、修改用户
export const reqAddUpdateUsers=(user)=>ajax(BASE+'/manage/user/'+(user._id?"update":"add"),user,'POST')


//jsonp获取天气
export const reqWeather=(city)=>{
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  return new Promise((resolve, reject) => {
    jsonp(url,{},(error, data)=>{
      if (!error && data.status === 'success') { 
        const {dayPictureUrl, weather} = data.results[0].weather_data[0] 
        resolve({dayPictureUrl, weather}) 
      } else { 
        message.error('获取天气信息失败') 
      }
    })
  })
}