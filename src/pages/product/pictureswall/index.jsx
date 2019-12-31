import React from 'react'
import { Upload, Icon, Modal ,message} from 'antd';
import PropTypes from 'prop-types';

import {BASE_IMG_URL} from '../../../utils/constats'

import {reqDeleteImg} from '../../../api'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  constructor(props){
    super(props)
    let fileList=[]
    const {imgs}=this.props
    if(imgs&&imgs.length>0){
      fileList=imgs.map((item,index)=>({
        uid:-index,
        name:item,
        status:'done',
        url:BASE_IMG_URL+item
      }))
    }

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList
    };
  }



  static propTypes={
    imgs:PropTypes.array
  }

  getImgs=()=>{
    //获取图片名的数组
    return this.state.fileList.map(file=>file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({file, fileList }) => {
    if(file.status==='done'){
      const res=file.response
      if(res.status===0){
        message.success("图片上传成功！")
        const {name,url}=res.data
        const file=fileList[fileList.length-1]
        file.name=name
        file.url=url
      }else{
        message.error("图片上传失败!")
      }
    }else if(file.status==='removed'){
      const res= await reqDeleteImg(file.name)
      if(res.status===0){
        message.success("图片删除成功！")
      }else{
        message.error("图片删除失败!")
      }
    }
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          accept='image/*'
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 9 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall