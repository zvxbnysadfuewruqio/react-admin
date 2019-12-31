import React from 'react'
import {Form,Input,Tree} from 'antd'
import PropTypes from 'prop-types';

import menuList from '../../../config/menuConfig.js'


const Item=Form.Item

const { TreeNode } = Tree;


class AuthForm extends React.Component{

  static propTypes={
    role:PropTypes.object.isRequired
  }

  constructor(props){
    super(props)

    const {menus}=this.props.role
    this.state={
      checkedKeys:menus
    }

  }

  componentWillMount(){
    this.treeNodes=this.getTreeNodes(menuList)
  }

  componentWillReceiveProps(nextProps){
    const {menus}=nextProps.role
    this.setState({
      checkedKeys:menus
    })
  }

  getMenus=()=>this.state.checkedKeys


  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  getTreeNodes=(menuList)=>{
    return menuList.reduce((pre,item)=>{
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children?this.getTreeNodes(item.children):null}
        </TreeNode>
      )
      return pre
    },[])
  }
  render(){
    const {role}=this.props
    const {checkedKeys}=this.state
    const formItemLayout = {
      labelCol: {
        span:4
      },
      wrapperCol: {
        span:15
      },
    };
    return (
      <div>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}

export default AuthForm