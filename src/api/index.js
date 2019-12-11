/*包含 n 个接口请求函数的模块 每个函数返回 promise */ 
import jsonp from 'jsonp'
import ajax from './ajax' 

const BASE=""

// 登陆 
export const reqLogin = (username, password) => ajax(BASE+'/login', {username, password}, 'POST')

//添加用户
export const reqAddUser = (user) => ajax(BASE+'/manage/user/add', user, 'POST')

//jsonp获取天气
export const reqWeather=(city)=>{
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  return new Promise((resolve, reject) => {
    jsonp(url,{},(error, data)=>{
      if (!error && data.status === 'success') { 
        const {dayPictureUrl, weather} = data.results[0].weather_data[0] 
        resolve({dayPictureUrl, weather}) 
      } else { 
        alert('获取天气信息失败') 
      }
    })
  })
}