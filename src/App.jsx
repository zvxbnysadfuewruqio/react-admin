// 应用的根组件
import React from 'react';

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'


export default function App(){
  return (
    <Router>
      <Switch>{/*只匹配一个路由*/}
        <Route path="/login/" component={Login}/>
        <Route path="/" component={Admin}/>
      </Switch>
    </Router>
  )
}
