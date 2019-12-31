import React from 'react'
// import Qs from 'qs'

import {Form, Icon, Card,Input,Cascader ,Button, message} from 'antd'
import LinkButton from '../../../components/link-button'
import PicturesWall from '../pictureswall'
import RichTextEditor from '../richtexteditor'
import {reqCategorys,reqProductAddUpdate} from "../../../api"


const Item=Form.Item
const { TextArea } = Input;

class ProductAddUpdate extends React.Component{
  constructor(props){
    super(props)

    this.pw=React.createRef()
    this.editor=React.createRef()

  }

  state = {
    options:[],
  };

  componentDidMount(){
    this.getCategorys("0")
  }

  componentWillMount(){
    const product=this.props.location.state
    this.isUpdate=!!product
    this.product=product||{}
  }

  getCategorys=async (parentId)=>{
    const res=await reqCategorys(parentId)
    if(res.status===0){
      if(parentId==="0"){
        this.initOptions(res.data)
      }else{
        return res.data
        // this.setState({subCategorys:res.data})
      }
    }else{
      // message.error('获取分类列表失败')
    }
  }

  initOptions=async (categorys)=>{
    const {isUpdate,product}=this
    const {pCategoryId}=product

    const options=categorys.map(item=>({
      value: item._id,
      label: item.name,
      isLeaf:false,
    }))

    if(isUpdate&&pCategoryId!=="0"){
      const subCategorys=await this.getCategorys(pCategoryId)
      const childOptions=subCategorys.map(item=>({
        value: item._id,
        label: item.name,
        isLeaf:true,
      }))

      const targetOption=options.find(option=>option.value===pCategoryId)

      targetOption.children=childOptions
      
    }

    this.setState({options})
  }


  submit=()=>{
    //提交表单验证
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {name,desc,categoryIds,price}=values

        let pCategoryId,categoryId

        if(categoryIds.length===1){
          pCategoryId="0"
          categoryId=categoryIds[0]
        }else{  
          pCategoryId=categoryIds[0]
          categoryId=categoryIds[1]
        }
        const imgs=this.pw.current.getImgs()
        const detail=this.editor.current.getDetail()

        const product={name,desc,price,imgs,detail,pCategoryId,categoryId}


        if(this.isUpdate){
          product._id=this.product._id
        }

        const res = await reqProductAddUpdate(product)

        if(res.status===0){
          message.success(`${this.isUpdate?"更新":"添加"}商品成功！`)
        }

      }
    });
  }

  validatePrice=(rule, value, callback)=>{
    if(value*1>0){
      callback()
    }else{
      callback("价格必须大于0")
    }
  } 

  // onChange = (value, selectedOptions) => {
  //   console.log(value, selectedOptions);
  // };

  loadData =async selectedOptions => {
    
    const targetOption = selectedOptions[0];
    
    targetOption.loading = true;

    const subCategorys=await this.getCategorys(targetOption.value)
    targetOption.loading = false;
    if(subCategorys&&subCategorys.length>0){
      const childOptions=subCategorys.map(item=>({
        value: item._id,
        label: item.name,
        isLeaf:true,
      }))
      targetOption.children=childOptions
    }else{
      targetOption.isLeaf=true
    }
    // // load options lazily
    
    this.setState({
      options: [...this.state.options],
    });
  };

  render(){
    const {getFieldDecorator}=this.props.form
    const {isUpdate,product}=this
    const {pCategoryId,categoryId,imgs,detail}=product

    //用来接收级联分类ID
    const categoryIds=[]
    if(isUpdate){
      if(pCategoryId==="0"){
        categoryIds.push(categoryId)
      }else{
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: {
        span:2
      },
      wrapperCol: {
        span:8
      },
    };

    //card的左侧
    const title=(
      <span>
        <LinkButton> <Icon type="arrow-left" style={{color:'green',marginRight:15,fontSize:20}} onClick={()=>this.props.history.goBack()}/></LinkButton>
        <span>{isUpdate?"修改商品":"添加商品"}</span>
      </span>
    )
    return (
      <Card title={title} style={{width:"100%"}} className="product-addupdate">
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {
              getFieldDecorator('name',{
                initialValue:product.name,
                rules:[
                  {
                    required:true,message:'必须输入商品名称！'
                  }
                ]
              })(<Input placeholder="请输入商品名称"/>)
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc',{
                initialValue:product.desc,
                rules:[
                  {
                    required:true,message:'必须输入商品描述！'
                  }
                ]
              })(<TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }}/>)
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price',{
                initialValue:product.price,
                rules:[
                  {
                    required:true,message:'必须输入商品价格！'
                  },{
                    validator:this.validatePrice
                  }
                ]
              })(<Input type="number" placeholder="请输入商品价格" prefix="￥" addonAfter="元"/>)
            }
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryIds',{
                initialValue:categoryIds,
                rules:[
                  {
                    required:true,message:'必须选择商品分类！'
                  }
                ]
              })(<Cascader
                placeholder="请指定商品分类"
                options={this.state.options}
                loadData={this.loadData}
                // onChange={this.onChange}
                // changeOnSelect
              />)
            }
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label="商品详情" labelCol={{span:2}} wrapperCol={{span:20}}>
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)