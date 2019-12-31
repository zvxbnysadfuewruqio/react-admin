import React from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import {connect} from 'react-redux'

import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
// import memoryUtils from '../../utils/memoryUtils.js'

import {formateDate} from '../../utils/dateUtils'
import AddRole from './addrole'

import AuthForm from './authform'

//角色路由
class Role extends React.Component{

  constructor(props){
    super(props)

    this.auth=React.createRef()
    this.state={
        roles:[],
        role:{},
        loading:false,
        showStatus:0
      }

  }
  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    this.getRoles()
  }


  getRoles=async ()=>{
    const res=await reqRoles()
    if(res.status===0){
      const roles=res.data
      this.setState({roles})
    }
  }

  //隐藏确认框
  hideModal=()=>{
    message.error("操作取消！")
    if(this.form){
      //清除输入数据
      this.form.resetFields()   
    }
    this.setState({
      showStatus:0
    })
  }

  //显示添加框
  showAdd=()=>{
    this.setState({
      showStatus:1
    })
  }
  //显示修改框
  showUpdate=()=>{
    this.setState({
      showStatus:2
    })
  }

  //添加角色
  addRole=async ()=>{
    this.form.validateFields(async (err,values)=>{
      if(!err){
        this.setState({
          showStatus:0
        })
        const {roleName}=values
        //清除输入数据
        this.form.resetFields()
        const res=await reqAddRole(roleName)
        if(res.status===0){
          this.setState(state=>({
            roles:[...state.roles,res.data]
          }))
          message.success("添加成功！")
        }else{
          message.error("添加失败！")
        }
      }
    })
  }
  //修改角色权限
  updateRole=async ()=>{
    const role=this.state.role
    this.setState({
      showStatus:0
    })

    const menus=this.auth.current.getMenus()
    console.log(menus)
    role.menus=menus


    let setrole={
      menus,
      _id:role._id,
      auth_time:Date.now(),
      auth_name:this.props.user.username
    }


    const res=await reqUpdateRole(setrole)
    if(res.status===0){
      this.getRoles()
      message.success("设置角色权限成功！")
    }else{
      message.error("设置角色权限失败！")
    }
  }

  //显示添加框
  showAdd=()=>{
    this.setState({
      showStatus:1
    })
  }
  //显示修改框
  showUpdate=()=>{
    this.setState({
      showStatus:2
    })
  }

  onRow=role => {
    return {
      onClick: event => {
        this.setState({role})
      }, // 点击行
    };
  }

  //初始化Table的列
  initColumns=()=>{
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render:formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render:auth_time=>formateDate(auth_time)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }

  render(){
    const {roles,loading,role,showStatus}=this.state
    //card的左侧
    const title=(
      <span>
        <Button type="primary" style={{marginRight:10}} onClick={this.showAdd}>创建角色</Button>
        <Button type="primary" disabled={!role._id} onClick={this.showUpdate}>设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title} style={{width:"100%"}}>
        <Table dataSource={roles} columns={this.columns} rowKey="_id" bordered 
          pagination={{
            defaultPageSize:3,
            showQuickJumper:true,
            showSizeChanger:true,
            onChange:(page, pageSize)=>{
              // console.log(page, pageSize)
              // this.getProducts(page)
            },
            onShowSizeChange:(current, size)=>{
              // console.log(current, size)
            }
          }} 
          loading={loading}
          rowSelection={{
            type:'radio',
            selectedRowKeys:[role._id],
            onSelect:(role)=>{
              this.setState({role})
            }
          }}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={showStatus===1}
          onOk={this.addRole}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <AddRole setForm={(form)=>{this.form=form}}/>
        </Modal>
        <Modal
          title="设置角色权限"
          visible={showStatus===2}
          onOk={this.updateRole}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <AuthForm ref={this.auth} role={role}/>
        </Modal>
      </Card>
    )
  }
}

export default connect(
  state=>({user:state.user}),
  {}
)(Role)