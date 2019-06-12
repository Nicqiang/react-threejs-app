import React, { Component } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select
} from "antd";
import FormBuilder from "./FromBuilder";
import reqwest from 'reqwest'
import AntdUploadFile from './AntdUploadFile'


function getPath(e){
  console.log("path:"+e)
}


const formMeta = {
  colon: true,
  columns: 1,
  elements: [
    {
      key: "name",
      label: "点云名称",
      tooltip: "name",
      widget: Input,
      required: true
    },
    {
        key: "remark",
        label: "备注",
        widget: Input,
        required: false
      },
    {
        key: "originPath",
        label: "上传点云",
        widget: AntdUploadFile,
        widgetProps: getPath,
        required: true
      }
    ]
};


class PointCloudInfoAddForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.path = "";
  }

  resetForm() {
    this.props.form.resetFields();
  }
  
//   {
//     "name": values['name'],
//     "originPath": values['originPath'],
//     "remark": values['remark']
// }
  handleSubmit(evt) {
    if (evt) evt.preventDefault();
    this.props.form.validateFieldsAndScroll(
      (errors, values) => {
        if (errors) {
          return;
        }
        console.log("Submit form: ", values);
        console.log("name="+values['name'])

        fetch('http://127.0.0.1:8080/api/points',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json;charset=UTF-8'
            },
            body: JSON.stringify(values)

        }).then(res => res.json())
        .then(data => {
            console.log("res-data" + data)
        })

        // reqwest({
        //     url: 'http://127.0.0.1:8080/api/points',
        //     method: 'post',
        //     type: 'json',
        //     processData: false,
        //     contentType: 'application/json',
        //     data: {'name': 'xixi'},
        //     success: () => {
        //     //   message.success('save successfully.');
        //     },
        //     error: () => {
        //     //   message.error('save failed.');
        //     },
        //   });
        
      }
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit}
        layout="horizontal"
        style={{ width: "400px" }}
      >
        <FormBuilder
          meta={formMeta}
          form={this.props.form}
        />
        <div style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>&nbsp; &nbsp;
          <Button onClick={this.resetForm}>Reset</Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(PointCloudInfoAddForm);