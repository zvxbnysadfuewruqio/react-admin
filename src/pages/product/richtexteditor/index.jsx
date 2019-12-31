import React, { Component } from 'react';
import { EditorState, convertToRaw ,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import PropTypes from 'prop-types';


import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"


export default class RichTextEditor extends Component {

  constructor(props){
    super(props)
    const detail = this.props.detail 
    let editorState 
    if(detail) { // 如果传入才需要做处理 
      const blocksFromHtml = htmlToDraft(detail) 
      const { contentBlocks, entityMap } = blocksFromHtml 
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap) 
      editorState = EditorState.createWithContent(contentState) 
    } else { 
      editorState = EditorState.createEmpty() 
    }

    // 初始化状态 
    this.state = { editorState }
  }

  static propTypes={
    detail:PropTypes.string
  }

  onEditorStateChange= (editorState) => {
    
    this.setState({
      editorState,
    });
  };

  getDetail=()=>{
    //返回html格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  uploadImageCallBack=(file)=>{
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manage/img/upload');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          const url=response.data.url
          resolve({data:{link:url}});
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{minHeight: 250, border: '1px solid #000', padding: '0 10px'}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            // inline: { inDropdown: true },
            // list: { inDropdown: true },
            // textAlign: { inDropdown: true },
            // link: { inDropdown: true },
            // history: { inDropdown: true },
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}