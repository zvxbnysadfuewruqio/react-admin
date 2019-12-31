import React from 'react'
import {withRouter} from "react-router-dom"
import { Modal ,message} from 'antd';
import './index.less'
import {formateDate} from "../../utils/dateUtils.js"
// import memoryUtils from "../../utils/memoryUtils.js"
import {reqWeather} from '../../api/index'
// import menuList from '../../config/menuConfig'
// import storageUtils from '../../utils/storageUtils'
import LinkButton from '../../components/link-button'
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'

const { confirm } = Modal;

/*
  左侧导航组件
*/ 
class Header extends React.Component{
  state={
    currentTime:formateDate(Date.now()),//当前时间字符串
    dayPictureUrl:'',//天气的图片
    weather:'',//天气的文本
  }
  componentDidMount(){
    //启动定时器
    this.getTime()

    //获取天气
    this.getWeather()
  }
  componentWillUnmount(){
    //消除定时器
    clearInterval(this.intervalId)
  }
  getTime=()=>{
    //每隔一秒更新时间
    this.intervalId=setInterval(() => {
      const currentTime=formateDate(Date.now())
      this.setState({currentTime})
    }, 1000);
  }
  // getTitle=()=>{
  //   //得到当前路径
  //   const path = this.props.location.pathname 
  //   let title
  //   menuList.forEach(item=>{//如果当前item对象的key与当前路径一样
  //     if(item.key=== path){
  //       title=item.title
  //     }else if(item.children){
  //       const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0)
  //       if(cItem){
  //         title=cItem.title
  //       }
  //     }
  //   })
  //   return title
  // }
  logout=(e)=>{
    e.preventDefault()
    confirm({
      title: '确定要退出登录吗?',
      onOk:()=>{
        this.props.logout()
        message.success('退出成功');
      },
      onCancel:()=>{
        message.error('取消');
      },
    });
  }
  getWeather=async ()=>{
    //调用接口获取数据
    const {dayPictureUrl, weather}=await reqWeather("杭州")
    console.log(dayPictureUrl, weather)
    //更新状态
    this.setState({dayPictureUrl, weather})
  }
  render(){
    const {currentTime,dayPictureUrl,weather}=this.state
    const username=this.props.user.username
    //得到当前的title
    // const title=this.getTitle()
    const title=this.props.headTitle
    return (
      <div className='header'>
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="天气"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state=>({headTitle:state.headTitle,user:state.user}),
  {logout}
)(withRouter(Header))