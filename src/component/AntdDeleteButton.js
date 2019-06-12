
import React, {Component} from 'react'
import { Popconfirm, message,Button} from 'antd';
import reqwest from 'reqwest';



class AntdDeleteButton extends Component{

     confirm() {
         this.deleteInfo(this.props.id)
      }
      
      cancel() {
        message.error('点击了取消');
      }

      deleteInfo(id){
          console.log("delete id="+ id)
          fetch('http://127.0.0.1:8080/api/points/'+id,{
            method: 'DELETE'

        }).then(res => res.json())
        .then(data => {
            if(data.code == 200){
                message.success("删除成功")
                this.props.reFresh();
              }else{
                  message.error("删除失败:"+data.errMsg)
              }
        });
      }
      
      
      render() {
          return (
              <Button type='primary'>
                <Popconfirm title="确定要删除吗？" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)}>
                    <a href="#">删除</a>
                </Popconfirm>
             </Button>
          )
      }
    

}

export default AntdDeleteButton

