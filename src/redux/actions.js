import {SET_HRAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER} from './action-types'

import {reqLogin} from '../api'
import storageUtils from '../utils/storageUtils'

export const setHeadTitle=headtitle=>({type:SET_HRAD_TITLE,data:headtitle})

export const receiveUser=user=>({type:RECEIVE_USER,user})

export const logout=()=>{
  storageUtils.removeUser()
  return {type:RESET_USER}
}

export const showErrorMsg=errorMsg=>({type:SHOW_ERROR_MSG,errorMsg})



//登录的异步

export const login=(username,password)=>{
  return async dispatch=>{
    const res= await reqLogin(username,password)
    if(res.status===0){
      const user = res.data

      storageUtils.saveUser(user)
      dispatch(receiveUser(user))
    }else{
      const msg=res.msg
      dispatch(showErrorMsg(msg))
    }
  }
}