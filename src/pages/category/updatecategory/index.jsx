import React from 'react'
import {Form,Input} from 'antd'
import PropTypes from 'prop-types';


const Item=Form.Item


class UpdateCategory extends React.Component{

  static propTypes={
    categoryName:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  }

  componentWillMount(){
    this.props.setForm(this.props.form)
  }
  componentWillUpdate(){
    this.props.setForm(this.props.form)
  }
  render(){
    const {getFieldDecorator} =this.props.form
    const {categoryName}=this.props
    return (
      <Form>
        <Item>
          {getFieldDecorator('categoryName', {
            initialValue:categoryName,
            rules:[
              {required:true,message:"分类名称必须输入！"}
            ]
          })(
            <Input placeholder="请输入分类名称"/>
          )}
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateCategory)