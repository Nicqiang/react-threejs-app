import React, {PureComponent} from 'react';
import {Modal, Form, Input, Spin, DatePicker, Button, Icon, Upload} from 'antd';
import _ from 'lodash';
import moment from "moment";

const {Item: FormItem} = Form;


class StrategyReportForm extends PureComponent {

    state = {
        fileData: [],
    }

    /** 文件上传属性 **/
    uploadProps = {
        accept: '.pdf',
        action: "uploadUrl",
        name: 'files',
        onUpload: (fileList) => {
            this.props.onChangeFile(fileList);
        },
        onSuccess: (response) => {
            const {name, url} = response[0];
            const file = {
                uid: -1,
                name: name,
                status: 'done',
                url: url
            };
            this.props.form.setFieldsValue({fileUrl: url});
            this.props.onChangeFile([file]);
        },
        onRemove: () => {
            this.props.onChangeFile([]);
        }
    }


//这个是监听文件变化的
fileChange=(params)=>{
    const {file,fileList}=params;
    if(file.status==='uploading'){
        setTimeout(()=>{
            this.setState({
                percent:fileList.percent    
            })
        },1000)       
    }
}
// 拦截文件上传
beforeUploadHandle=(file)=>{
    this.setState(({fileData})=>({
        fileData:[...fileData,file],
    }))
    return false;
}
// 文件列表的删除
fileRemove=(file)=>{
    this.setState(({fileData})=>{
        const index = fileData.indexOf(file);
        return {
            fileData: fileData.filter((_, i) => i !== index)
        }
    })
}

    render() {
        const {modalVisible, formLoading, confirmLoading, data, onSave, onCancel, form, fileList} = this.props;
        const {getFieldDecorator} = this.props.form;
        const title = '编辑';
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 15},
        };
        const files = this.state.fileData;
        return (
            <Modal
                title={title}
                visible={modalVisible}
                confirmLoading={confirmLoading}
                onOk={() => {
                    form.validateFields((err, values) => {
                        if (!err) {
                          let formData = new FormData();
                          formData.append("file", files[0]);
                          for(let i = 0 ;i<files.length;i++){
                            //dataParament.files.fileList[i].originFileObj 这个对象是我观察 antd的Upload组件发现的里面的originFileObj 对象就是file对象
                            formData.append('files',files[i])
                           }
                           //file以外的对象拼接
                           for(let item in values.length) {
                             if(item !== 'files' && values[item]) {
                                formData.append(item, values[item]);
                             }
                           }
                          fetch(`/questionnaire/admin/strategy/reports`, {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'Authorization': `Bearer ${sessionStorage.accessToken}`,
                            },
                          }).then((response => {
                              if (response.code === 0) {
                                  console.log("=====================", 'OK');
                              } else {
                                  console.log("=====================", 'error');
                              }
                          }));
                          onSave(data);
                        }
                    });
                }}
                onCancel={onCancel}>
                <Form id="postForm">
                    <Spin spinning={formLoading} tip="加载中...">
                       
                        <FormItem label="报告标题" {...formItemLayout}>
                            {
                                getFieldDecorator('title', {
                                    rules: [
                                        {
                                            type: 'string',
                                            required: true,
                                            message: '标题不能为空！',
                                        },
                                    ],
                                    initialValue: _.defaultTo(data.title, ''),
                                })(<Input/>)
                            }
                        </FormItem>
                        <FormItem label="显示时间" {...formItemLayout}>
                            {
                                getFieldDecorator('showTime', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '显示时间不能为空',
                                        },
                                    ],
                                    initialValue: data.showTime ? moment(moment(data.showTime).format('YYYY-MM-DD HH:mm')) : moment(),
                                })( <DatePicker showTime style={{width: 280}} format="YYYY-MM-DD HH:mm"/>)
                            }
                        </FormItem>
                        <FormItem label="指定期数" {...formItemLayout}>
                            {
                                getFieldDecorator('periods', {
                                    rules: [
                                        {
                                            type: 'string',
                                            required: false,
                                            message: '期数',
                                        },
                                    ],
                                    initialValue: _.defaultTo(data.periods, ''),
                                })(<Input/>)
                            }
                        </FormItem>
                        <FormItem labelCol={{span:5}} wrapperCol={{span:15}} label='文件上传'>
                            {getFieldDecorator('files')(
                                <Upload action='路径' 
                                    multiple uploadList 
                                    beforeUpload={this.beforeUploadHandle} 
                                    onChange={this.fileChange} 
                                    onRemove={this.fileRemove} 
                                    fileList={this.state.fileData}>
                                    <Button><Icon type='upload' />上传文件</Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Spin>
                </Form>
            </Modal>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.modalVisible && nextProps.modalVisible) {
            this.props.form.resetFields();
        }
    }
}

export default Form.create()(StrategyReportForm);