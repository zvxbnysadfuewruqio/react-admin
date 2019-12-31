import React from 'react'
import { Card ,Button,Icon,Table,message,Modal} from 'antd';
import LinkButton from '../../components/link-button'
import {reqCategorys,reqCategoryAdd,reqCategoryUpdate} from '../../api'

import AddCategory from './addcategory'
import UpdateCategory from './updatecategory'

//品类管理路由
export default class Category extends React.Component{
  state={
    categorys:[],//一级分类数组
    subCategorys:[],//二级分类数组
    loading:false,//是否正在获取数据
    parentId:"0",//当前显示的分类的父类ID
    parentName:'',//当前显示的分类的父类名称
    showStatus: 0,//添加/更新的框是否显示   0都不显示 1显示添加  2显示更新
  }
  componentDidMount(){
    this.getCategorys()
  }
  componentWillMount(){
    this.initColumns()
  }

  //异步获取分类列表数据
  getCategorys=async (parentId)=>{
    parentId=parentId||this.state.parentId
    this.setState({loading:true})
    const res=await reqCategorys(parentId)
    this.setState({loading:false})
    if(res.status===0){
      if(parentId==="0"){
        this.setState({categorys:res.data})
      }else{
        this.setState({subCategorys:res.data})
      }
    }else{
      message.error('获取分类列表失败')
    }
  }
  //隐藏确认框
  hideModal=()=>{
    message.error("操作取消！")
    this.setState({
      showStatus:0
    })
    
    // if(this.form){
    //   //清除输入数据
    //   this.form.resetFields()   
    // }
  }

  //显示添加框
  showAdd=()=>{
    this.setState({
      showStatus:1
    })
  }
  //显示修改框
  showUpdate=(category)=>{
    this.category=category
    this.setState({
      showStatus:2
    })
  }

  //添加分类
  addCategory=async ()=>{
    // if(!this.form){
    //   return false
    // }
    console.log(this.form.getFieldsValue())

    this.form.validateFields(async (err,values)=>{
      if(!err){
        this.setState({
          showStatus:0
        })
        const {parentId,categoryName}=values

        // if(!(parentId&&categoryName)){
        //   return false
        // }
        //清除输入数据
        this.form.resetFields()
        const res=await reqCategoryAdd(parentId,categoryName)
        if(res.status===0){
          if(parentId===this.state.parentId){
            this.getCategorys()
          }else if(parentId==="0"){
            this.getCategorys("0")
          }
          message.success("添加成功！")
        }
      }
    })
  }

  //更新分类
  updateCategory=async ()=>{
    console.log(this.form.getFieldsValue())
    const categoryId=this.category._id
    // if(!this.form){
    //   return false
    // }
    this.form.validateFields(async (err,values)=>{
      if(!err){
        this.setState({
          showStatus:0
        })
        const {categoryName}=values
        // console.log(categoryName)
        // if(!categoryName){
        //   return false
        // }
        //清除输入数据
        this.form.resetFields()
        const res=await reqCategoryUpdate(categoryId,categoryName)
        if(res.status===0){
          this.getCategorys()
          message.success("修改成功！")
        }
      }
    })
  }

  //显示二级分类列表
  showSubCategorys=(category)=>{
    this.setState({parentId:category._id,parentName:category.name},()=>{
      this.getCategorys()
    })
  }

  //显示一级分类列表
  showCategorys=()=>{
    this.setState({parentId:"0",parentName:'',subCategorys:[]})
  }

  //初始化Table的列
  initColumns=()=>{
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width:300,
        render: (category) => (
          <span>
            <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
            {this.state.parentId==="0"?<LinkButton onClick={()=>this.showSubCategorys(category)}>查看子分类</LinkButton>:null}
          </span>
        ),
      }
    ];
  }
  render(){
    //读取状态数据
    const {categorys,loading,subCategorys,parentId,parentName,showStatus}=this.state
    //读取指定的分类
    const category=this.category||{}
    //card的左侧
    const title=parentId==="0"?'一级分类列表':(
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type="arrow-right" style={{marginRight:10}}/>
        <span>{parentName}</span>
      </span>
    )
    //card的右侧
    const extra=(
      <Button type="primary" onClick={this.showAdd}>
        <Icon type="plus"/>
        添加
      </Button>
    )  
    return (
      <Card title={title} extra={extra} style={{width:"100%"}}>
        <Table dataSource={parentId==="0"?categorys:subCategorys} columns={this.columns} rowKey="_id" bordered 
        pagination={{defaultPageSize:5,showQuickJumper:true}} loading={loading}/>
        <Modal
          title="添加分类"
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <AddCategory categorys={categorys} parentId={parentId} setForm={(form)=>{this.form=form}}/>
        </Modal>
        <Modal
          title="修改分类"
          visible={showStatus===2}
          onOk={this.updateCategory}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <UpdateCategory categoryName={category.name} setForm={(form)=>{this.form=form}}/>
        </Modal>
      </Card>
    )
  }
}