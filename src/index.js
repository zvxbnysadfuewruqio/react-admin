// 入口文件

import React from 'react';
import ReactDOM from 'react-dom';
// import 'antd/dist/antd.css';
// import storageUtils from './utils/storageUtils' 
// import memoryUtils from './utils/memoryUtils'
import store from './redux/store'
import {Provider} from 'react-redux'


import App from './App'

ReactDOM.render(
<Provider store={store}>
  <App/>
</Provider>, document.getElementById('root'));
