import React, { Component } from "react";
import {
  Form,
  Button,
  Upload,
  Icon,
  Input,
  message,
} from 'antd';
// import fetch from 'node-fetch';
import reqwest from 'reqwest';
// import { async } from "q";


class AntdEditForm extends Component {

    state = {
        name: '',
        remark: ''
    }


    componentDidMount(){
        this.getData();
    }

    getData() {
        fetch('http://127.0.0.1:8080/api/points/' + this.props.id).then(res => res.json()).then(data => {
        if(data.code == 200){
            let initData = data.data;
            this.setState({
                name: initData.name,
                remark: initData.remark,
                data: initData
                
            })
            
            console.log("finshed fetch")
            }
        });
    }
    // getData();

    getItemValue() {
        let dataJson = this.state.data;
        const v = this.props.form.getFieldsValue();
    
        dataJson['name'] = v['name'];
        dataJson['remark'] = v['remark'];
        return dataJson;
        
    }

    render() {
    
        const {form} = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 12 },
            };
        
        // console.log("initData="+JSON.stringify(initData));
        return (
            <Form {...formItemLayout} >
                <Form.Item label="名称" {...formItemLayout}>
                    {getFieldDecorator('name', {
                    initialValue: this.state.name,
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
                    initialValue: this.state.remark,
                    rules: [
                        {
                        required: false,
                        message: '备注',
                        },
                    ],
                    })(<Input placeholder="备注" />)}
                </Form.Item>
            </Form>
            );
  }
}

export default Form.create()(AntdEditForm)