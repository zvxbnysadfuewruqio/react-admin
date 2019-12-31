import React from 'react'
// import {Link} from 'react-router-dom'
import { Card ,Button,Icon,Input,Table,Select,message} from 'antd';
import LinkButton from '../../../components/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from "../../../api"


const Option=Select.Option

export default class ProductHome extends React.Component{
  state={
    products:[],//商品的数组
    total:0,//商品总数量
    loading:false,
    searchName:'',//搜索的关键字
    searchType:'productName',//搜索的类型
    current:1
  }

  componentWillMount(){
    this.initColumns()
  }
  componentDidMount(){
    this.getProducts(1)
  }

  updateStatus=async (productId,status)=>{
    const {current}=this.state
    const res=await reqUpdateStatus(productId,status)
    if(res.status===0){
      this.getProducts(current)
      message.success("更新商品状态成功！")

    }
  }

  getProducts=async (pageNum)=>{
    // console.log(pageNum)
    // this.pageNum=pageNum
    this.setState({loading:true,current:pageNum})
    const {searchName,searchType}=this.state
    let res
    if(searchName){
      // pageNum=1
      res=await reqSearchProducts(pageNum,3,searchName,searchType)
    }else{
      res=await reqProducts(pageNum,3)
    }
    this.setState({loading:false})
    if(res.status===0){
      const {total,list}=res.data
      this.setState({
        total,
        products:list
      })
    }
  }

  //初始化Table的列
  initColumns=()=>{
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render:(price)=>"￥"+price
      },
      {
        title: '状态',
        width:100,
        // dataIndex: 'status',
        render:(product)=>{
          const {_id,status}=product
          const newstatus=status===1?2:1
          return (
            <span>
              <Button type="primary" onClick={()=>{this.updateStatus(_id,newstatus)}}>{status===1?'下架':'上架'}</Button>
              <span>{status===1?'在售':'已下架'}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width:100,
        render:(product)=>{
          return (
            <span>
              <LinkButton onClick={()=>this.props.history.push("/product/detail",product)}>详情</LinkButton>
              <LinkButton onClick={()=>this.props.history.push("/product/addupdate",product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ];
  }

  render(){
    const {products,total,loading,searchName,searchType,current} =this.state
    //card的左侧
    const title=(
      <span>
        <Select value={searchType} style={{width:"150px"}} onChange={value=>this.setState({searchType:value})}>
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input placeholder="关键字" style={{width:"150px",margin:"0 15px"}} value={searchName} onChange={e=>this.setState({searchName:e.target.value})}/>
        <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button>
      </span>
    )
    //card的右侧
    const extra=(
      <Button type="primary" onClick={()=>this.props.history.push("/product/addupdate")}>
        <Icon type="plus"/>
        添加
      </Button>
    )
    return (
      <Card title={title} extra={extra} style={{width:"100%"}}>
        <Table dataSource={products} columns={this.columns} rowKey="_id" bordered 
        pagination={{
          defaultPageSize:3,
          showQuickJumper:true,
          total,
          current,
          onChange:this.getProducts,
          }} 
        loading={loading}/>
      </Card>
    )
  }
}