import React from 'react'

import {List, Icon, Card} from 'antd'
import LinkButton from '../../../components/link-button'
import {reqCategory} from "../../../api"
import {BASE_IMG_URL} from '../../../utils/constats'

const Item=List.Item



export default class ProductDetail extends React.Component{
  state={
    cName1:'',//一级分类名称
    cName2:"",//二级分类名称
  }

  componentDidMount(){
    this.getCategory()
  }

  getCategory=async ()=>{
    const {pCategoryId,categoryId}=this.props.location.state
    if(pCategoryId==="0"){//一级分类下的
      const res= await reqCategory(categoryId)
      const cName1=res.data.name
      this.setState({cName1})
    }else{//二级分类下的

      const res=await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
      const cName1=res[0].data.name
      const cName2=res[1].data.name
      this.setState({cName1,cName2})
    }
  }

  render(){

    //读取state携带来的数据
    const {name,desc,price,detail,imgs}=this.props.location.state

    const {cName1,cName2}=this.state

    //card的左侧
    const title=(
      <span>
        <LinkButton> <Icon type="arrow-left" style={{color:'green',marginRight:15,fontSize:20}} onClick={()=>this.props.history.goBack()}/></LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} style={{width:"100%"}} className="product-detail">
        <List>
          <Item>
            <span className="left">商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格:</span>
            <span>{price}</span>
          </Item>
          <Item>
            <span className="left">所属分类:</span>
            <span>{cName1}{cName2?"--->"+cName2:''}</span>
          </Item>
          <Item>
            <span className="left">商品图片:</span>
            <span>
              {
                imgs.map(item=><img className="product-img" key={item} src={BASE_IMG_URL+item} alt={item}/>)
              }
            </span>
          </Item>
          <Item>
            <span className="left">商品详情:</span>
            <div dangerouslySetInnerHTML={{__html: detail}}></div>
          </Item>
        </List>
      </Card>
    )
  }
}