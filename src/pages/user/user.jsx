import React from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import LinkButton from '../../components/link-button'
import {formateDate} from '../../utils/dateUtils'
import {reqUsers,reqDeleteUsers,reqAddUpdateUsers} from '../../api'
import AddUpdateUser from './addupdateuser'


//用户路由
export default class User extends React.Component{
  state={
    users:[],
    roles:[],
    loading:false,
    showStatus:false
  }

  componentDidMount(){
    this.getUsers()
  }

  componentWillMount(){
    this.initColumns()
  }

  getUsers=async ()=>{
    const res=await reqUsers()
    if(res.status===0){
      this.initRoleNames(res.data.roles)
      this.setState({
        users:res.data.users,
        roles:res.data.roles,
      })
    }
  }

  initRoleNames=(roles)=>{
    this.roleNames= roles.reduce((pre,role)=>{
      pre[role._id]=role.name
      return pre
    },{})
  }

  showAdd=()=>{
    this.user=null
    this.setState({showStatus:true})
  }

  showUpdate=(user)=>{
    this.user=user
    this.setState({showStatus:true})
  }

  showDelete=(user)=>{
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk:async()=>{
        const res=await reqDeleteUsers(user._id)
        if(res.status===0){
          message.success(`删除${user.username}成功`)
          this.getUsers()
        }
      }
    });
  }

  addUpdateUser=()=>{
    this.form.validateFields(async (err,values)=>{
      if(!err){
        this.setState({
          showStatus:false
        })
        //清除输入数据
        this.form.resetFields()
        if(this.user){
          values._id=this.user._id
        }


        const res=await reqAddUpdateUsers(values)
        if(res.status===0){
          this.getUsers()
          message.success(`${this.user?'修改':"添加"}成功！`)
        }else{
          message.error(`${this.user?'修改':"添加"}失败！`)
        }
      }
    })
  }

  //初始化Table的列
  initColumns=()=>{
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render:formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render:role_id=>this.roleNames[role_id]
      },
      {
        title: '操作',
        render:(user)=>(
          <span>
            <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={()=>this.showDelete(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }
  render(){
    const {users,loading,showStatus,roles}=this.state
    const user=this.user||{}
    //card的左侧
    const title=(
      <span>
        <Button type="primary" style={{marginRight:10}} onClick={this.showAdd}>创建用户</Button>
      </span>
    )
    return (
      <Card title={title} style={{width:"100%"}}>
        <Table dataSource={users} columns={this.columns} rowKey="_id" bordered 
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
        />
        <Modal
          title={user._id?'修改用户':'添加用户'}
          visible={showStatus}
          onOk={this.addUpdateUser}
          onCancel={()=>this.setState({showStatus:false})}
          okText="确认"
          cancelText="取消"
        >
          <AddUpdateUser roles={roles} user={user} setForm={(form)=>{this.form=form}}/>
        </Modal>
      </Card>
    )
  }
}