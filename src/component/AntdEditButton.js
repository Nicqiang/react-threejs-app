import { Modal, Button, message } from 'antd';
import React, {Component} from 'react'
import AntdEditForm from './AntdEditForm'

class AntdEditButton extends Component {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  updateInfo(values){
      console.log("values="+JSON.stringify(values));
      fetch("http://127.0.0.1:8080/api/points",{
          body: JSON.stringify(values),
          method: "PUT",
          headers: {
              'Content-Type': 'application/json',
          }
      }).then(res => res.json()).then(result =>  {
          console.log("result=" + result);
          if(result.code == 200){
            message.info("update success");
            this.props.reFresh();
          }else{
              message.error("update failed");
          }
      })
  }

  handleOk = () => {
    this.setState({
      ModalText: '编辑',
      confirmLoading: true,
    });
    const values = this.formRef.getItemValue();
    this.updateInfo(values);
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, confirmLoading, ModalText } = this.state;
    return (
      <div >
        <Button type="primary" onClick={this.showModal}>
          编辑
        </Button>
        <Modal
          title="Title"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
        
        <AntdEditForm id={this.props.id}  wrappedComponentRef={(form) => this.formRef = form}/>
        </Modal>
      </div>
    );
  }
}

export default AntdEditButton