import React from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductDetail from './product-detail'
import ProductAddUpdate from './product-addupdata'

import "./product.less"



//商品路由
export default class Product extends React.Component{

  render(){
    return (
      <Switch>
        <Route path="/product" component={ProductHome} exact/>
        <Route path="/product/detail" component={ProductDetail}/>
        <Route path="/product/addupdate" component={ProductAddUpdate}/>
        <Redirect to="/product/"/>
      </Switch>
    )
  }
}