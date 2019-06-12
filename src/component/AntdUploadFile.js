import React, {Component} from 'react'
import { Upload, message, Button, Icon } from 'antd';
import 'antd/dist/antd.css';
import reqwest from 'reqwest';


class AntdUploadFile extends Component{


    state = {
        fileList: [],
        uploading: false,
        path: 'xixixi',
      };
      
    
    
      handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('file', file);
        });
    
        this.setState({
          uploading: true,
        });
    
        // You can use any AJAX library you like
        reqwest({
          url: 'http://127.0.0.1:8080/file/upload',
          method: 'post',
          processData: false,
          data: formData,
          success: () => {
            this.setState({
              fileList: [],
              uploading: false,
            });
            this.handleThisValue()
            message.success('upload successfully.');
          },
          error: () => {
            this.setState({
              uploading: false,
            });
            message.error('upload failed.');
          },
        });
      };

    

    render() {
        const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </div>
    );
    }
}

export default AntdUploadFile