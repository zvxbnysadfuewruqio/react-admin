import React from 'react'
import './index.less'
/*
  左侧导航组件
*/ 
export default class Header extends React.Component{

  render(){
    return (
      <div className='header'>
        <div className="header-top">
          <span>欢迎，admin</span>
          <a href="https://www.baidu.com/">退出</a>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">首页</div>
          <div className="header-bottom-right">
            <span>2019-12-11</span>
            <img src="https://dss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/home/img/qrcode/zbios_09b6296.png" alt="天气"/>
            <span>晴</span>
          </div>
        </div>
      </div>
    )
  }
}