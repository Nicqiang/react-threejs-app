
import React, {Component} from 'react'
import { Table, Button, Icon } from 'antd';
import 'antd/dist/antd.css';
import reqwest from 'reqwest'
import moment from 'moment'; 
import AntdDeleteButton from './AntdDeleteButton'
import AntdEditButton from './AntdEditButton'
import {Link } from "react-router-dom";


class AntdRequestTable extends Component {
  constructor(props){
    super(props)
    this.reFreshPage = this.reFreshPage.bind(this);
  }

  state = {
    data: [],
    pagination: {},
    loading: false,
  };
    
    
      componentDidMount() {
        this.fetch();
      }

      reFreshPage(){
        this.fetch();

      }
    
      handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
          pagination: pager,
        });
        this.fetch({
          results: pagination.pageSize,
          page: pagination.current
        });
      };
    
      fetch = (params = {}) => {
        console.log('params:', params);
        this.setState({ loading: true });
        reqwest({
          url: 'http://127.0.0.1:8080/api/points',
          method: 'get',
          data: {
            results: 10,
            ...params,
          },
          type: 'json',
        }).then(data => {
          const pagination = { ...this.state.pagination };
          // Read total count from server
          // pagination.total = data.totalCount;
          // console.log(data)
        //   console.log(moment(1370001284000).format("YYYY-MM-DD HH:mm:ss"))
          pagination.total = data.total;
          this.setState({
            loading: false,
            data: data.data,
            pagination,
          });
        });
      };
    
      render() {
        

        const columns = [
          {
            title: '点云名称',
            dataIndex: 'name',
          //   sorter: true,
          //   render: name => `${name.first} ${name.last}`,
            width: '10%',
          },
          {
            title: '点数',
            dataIndex: 'pointNum',
          //   filters: [{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }],
            width: '5%',
          },
          {
              title: '文件路径',
              dataIndex: 'originPath',
            //   filters: [{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }],
              width: '15%',
            },
          {
            title: '上传时间',
            dataIndex: 'createTime',
          //   render: createTime => {moment(1370001284000).format("YYYY-MM-DD HH:mm:ss")}
            render: createTime => moment(createTime).format("YYYY-MM-DD HH:mm:ss")
          },
          {
              title: '修改时间',
              dataIndex: 'modifyTime',
              render: modifyTime => moment(modifyTime).format("YYYY-MM-DD HH:mm:ss")
          },
          {
              title: '备注',
              dataIndex: 'remark',
            //   sorter: true,
            //   render: name => `${name.first} ${name.last}`,
              width: '10%',
            },
          {
              title: '编辑',
              dataIndex: 'id',
              render: id => 
                <div>
                  <AntdEditButton id={id} reFresh={this.reFreshPage}/>
                  <AntdDeleteButton id={id} reFresh={this.reFreshPage}/> <span> </span>
                  <Button type='primary'><Link to='/operator'>点云操作</Link></Button>
                </div>,
              width: '20%',
          }
        ];

        return (
          <Table
            columns={columns}
            rowKey={record => record.id}
            dataSource={this.state.data}
            bordered
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        );
      }
    

}

export default AntdRequestTable;
