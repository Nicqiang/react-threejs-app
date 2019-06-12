import React from 'react';
import logo from './logo.svg';
import './App.css';
import ThreeMap from './component/ThreeMap'
import AntdRequestTable from './component/AntdRequestTable'
import PointCloudInfoAddForm from './component/PointCloudInfoAddForm'
import PointCloudOperator from './component/PointCloudOperator'
import { Route, Link,Switch } from "react-router-dom";
import { Menu, Icon } from 'antd';
import 'antd/dist/antd.css';

const RequestTable = () => <AntdRequestTable />;
const Add = () => <PointCloudInfoAddForm/>;
const Earth = () => <ThreeMap />
const Operator = () => <PointCloudOperator />


const Header = () => (

  // state = {
  //   current: 'mail',
  // }

  // handleClick = e => {
  //   console.log('click ', e);
  //   this.setState({
  //     current: e.key,
  //   })
  // }

  <header>
    <nav>
    <Menu mode="horizontal">
        <Menu.Item key="list">
          <Link to='/list'><Icon type="appstore" theme="twoTone" />点云管理</Link>
        </Menu.Item>
        <Menu.Item key="add">
          <Link to='/add'><Icon type="plus-circle" theme="twoTone" />新增</Link>
        </Menu.Item>

        <Menu.Item key="earth">
          <Link to='/earth'><Icon type="plus-circle" theme="twoTone" />地球</Link>
        </Menu.Item>

        <Menu.Item key="operator" disabled>
          <Link to='/operator'><Icon type="plus-circle" theme="twoTone" />点云操作</Link>
        </Menu.Item>
        
      </Menu>
      {/* <ul>
        <li><Link to='/list'>table</Link></li>
        <li><Link to='/add'>add</Link></li>
      </ul> */}
    </nav>
  </header>
)


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/list' component={RequestTable}/>
      <Route path='/add' component={Add}/>
      <Route path='/earth' component={Earth}/>
      <Route path='/operator' component={Operator}/>
    </Switch>
  </main>
)


function App() {
  return (
    <div>
      <Header />
      <Main />
    </div>
    // <Router>
    //     <div>
    //       <ul id="menu">
    //         <li>
    //           <Link to="/list">列表</Link>
    //         </li>
    //         <li>
    //           <Link to="/add">添加</Link>
    //         </li>
    //       </ul>

    //       <div id="page-container">
    //         <Route path="/list" component={RequestTable} />
    //         <Route path="/add" component={Add} />
    //       </div>
    //     </div>
    //   </Router>
  );
}

export default App;
