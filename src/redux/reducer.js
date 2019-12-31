import {SET_HRAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER} from './action-types'
import {combineReducers} from 'redux'

import storageUtils from '../utils/storageUtils'


const initHeadTitle="首页2"
function headTitle(state=initHeadTitle,action){
  switch(action.type){
    case SET_HRAD_TITLE:
      return action.data
    default:
      return state
  }
}

const inituser=storageUtils.getUser()
function user(state=inituser,action){
  switch(action.type){
    case RECEIVE_USER:
      return action.user
    case SHOW_ERROR_MSG:
      const errorMsg=action.errorMsg
      return {...state,errorMsg}
    case RESET_USER:
      return inituser
    default:
      return state
  }
}


export default combineReducers({
  headTitle,
  user
})