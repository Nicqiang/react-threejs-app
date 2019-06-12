import React, { Component } from "react";
import {
  Form,
  Button,
  Upload,
  Icon,
  Input,
  message,
} from 'antd';
import reqwest from 'reqwest';


class PointCloudInfoAddForm extends Component {

  state = {
    fileList: [],
    uploading: false,
    path: '',
  };


  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(err){
        return
      }

      // 先上传文件，完成后再新增数据
      // values.append('originPath', this.state.path)
      if(this.state.path == ''){
        message.warning('please update file')
        return
      }

      console.log("value" + JSON.stringify(values))

      let pointCloudInfo = {
        "name": values['name'],
        "remark": values['remark'],
        "originPath": this.state.path
      }

      console.log(JSON.stringify(pointCloudInfo))

      fetch('http://127.0.0.1:8080/api/points',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json;charset=UTF-8'
            },
            body: JSON.stringify(pointCloudInfo)

        }).then(res => res.json())
        .then(data => {
            this.setState({
              fileList: [],
              uploading: false,
              path: ''
            })
            message.info('save point cloud success')
        });
    });
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
      success: res => {
        console.log("res"+res.data)
        this.setState({
          fileList: [],
          uploading: false,
          path: res.data
        });
        console.log(this.state)
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
    const fileProps = {
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



    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 6 },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入点云名称',
              },
            ],
          })(<Input placeholder="请输入点云名称" />)}
        </Form.Item>

        <Form.Item label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', {
            rules: [
              {
                required: false,
                message: '备注',
              },
            ],
          })(<Input placeholder="备注" />)}
        </Form.Item>
        

        <Form.Item label="点云数据">
          {getFieldDecorator('originPath', {
            valuePropName: 'file',
            getValueFromEvent: this.state.path,
          })(
            <div>
              <Upload {...fileProps}>
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
          )}
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(PointCloudInfoAddForm)