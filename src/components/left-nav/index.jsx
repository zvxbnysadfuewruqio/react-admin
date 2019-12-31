import React from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu, Icon } from 'antd';
import "./index.less"
import logo from '../../assets/images/logo.png'

import menuList from '../../config/menuConfig'
// import memoryUtils from '../../utils/memoryUtils.js'
import {connect} from 'react-redux'
import {setHeadTitle} from '../../redux/actions.js'

const { SubMenu } = Menu;
/*
  左侧导航组件
*/ 
class LeftNav extends React.Component{

  hasAuth=(item)=>{
    const key=item.key
    const menus=this.props.user.role.menus
    const username=this.props.user.username

    if(username==='admin'||item.isPublic||menus.indexOf(key)!==-1){
      return true
    }else if(item.children){
      return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
    }


    return false
  }

  //根据menu的数据数组生成对应的标签数组
  // 使用 map() + 递归
  getMenuNodes=(menuList)=>{
    // 得到当前请求的 path 
    const path = this.props.location.pathname
    return menuList.map(item=>{
      if(!item.children){
        return(
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      }else{
        // 如果当前请求路由与当前菜单的某个子菜单的 key 匹配, 将菜单的 key 保存为 openKey 
        if(item.children.find(cItem => path.indexOf(cItem.key)===0)) { this.openKey = item.key }
        return(
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
    })
  }

  //根据menu的数据数组生成对应的标签数组
  // 使用 reduce() + 递归
  getMenuNodes1=(menuList)=>{
    // 得到当前请求的 path 
    const path = this.props.location.pathname
    return menuList.reduce((pre,item)=>{
      if(this.hasAuth(item)){
        if(!item.children){

          if(item.key===path||path.indexOf(item.key)===0){
            this.props.setHeadTitle(item.title)
          }
          pre.push(
            <Menu.Item key={item.key}>
              <Link to={item.key} onClick={()=>this.props.setHeadTitle(item.title)}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        }else{
          pre.push(
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes1(item.children)}
            </SubMenu>
          )
          // 如果当前请求路由与当前菜单的某个子菜单的 key 匹配, 将菜单的 key 保存为 openKey 
          if(item.children.find(cItem => path.indexOf(cItem.key)===0)) { this.openKey = item.key }
        }
      }
      return pre
    },[])
  }

  componentWillMount() { // this.menuNodes = this.getMenuNodes(menuConfig) 
    this.menuNodes = this.getMenuNodes1(menuList) 
  }
  
  render(){
    let path = this.props.location.pathname 
    const openKey = this.openKey
    if(path.indexOf('/product')===0){
      path='/product'
    }
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
    )
  }
}
export default connect(
  state=>({user:state.user}),
  {setHeadTitle}
)(withRouter(LeftNav))