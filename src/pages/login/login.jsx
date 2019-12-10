import React from 'react'
import {Redirect} from 'react-router-dom'
import './login.less'
import logo from '../../assets/images/logo.png'

import { Form, Icon, Input, Button ,message} from 'antd';

import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'


class Login extends React.Component{
  handleSubmit=(e)=>{
    e.preventDefault();
    const form=this.props.form
    form.validateFields(async (err, values) => {
      if (!err) {
        //校验成功
        const {username,password}=values
        // console.log('提交: ', username,password);
        const res= await reqLogin(username,password)
        if(res.status===0){
          message.success('登录成功')
          memoryUtils.user = res.data
          storageUtils.saveUser(res.data)
          //跳转到管理界面
          this.props.history.replace('/')
        }else{
          message.error(res.msg)
        }
      }else{
        //校验失败
        console.log(err);
      }
    });
  }

  /*** 自定义表单的校验规则 */
  validator=(rule, value, callback)=>{
    // console.log(rule, value) 
    const length = value && value.length 
    const pwdReg = /^[a-zA-Z0-9_]+$/ 
    if (!value) { // callback 如果不传参代表校验成功，如果传参代表校验失败，并且会提示错误 
      callback('必须输入密码') 
    } else if (length < 4) { 
      callback('密码必须大于 4 位') 
    } else if (length > 12) { 
      callback('密码必须小于 12 位') 
    } else if (!pwdReg.test(value)) { 
      callback('密码必须是英文、数组或下划线组成') 
    } else { 
      callback() // 必须调用 callback 
    }
  }

  render(){
    const user=memoryUtils.user
    console.log(user)
    if(user._id){
      return <Redirect to='/'/>
    }

    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true,whitespace:true, message: '请输入用户名!' },
                  {min:4,message: '最少输入4位!'},
                  {max:12,message: '最多输入12位!'},
                  {pattern:/^[a-zA-Z0-9_]+$/,message: '用户名必须是英文、数组或下划线 组成!'}
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [ // 自定义表单校验规则 
                  {validator: this.validator}
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);
export default WrappedNormalLoginForm