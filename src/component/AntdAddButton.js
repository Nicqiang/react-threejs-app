import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import { Button } from 'antd';

class AntdAddButton extends Component {

    handleClick(e){
        this.props.history.push("/add")
    }


    render() {
        return (
            <Button onclick={this.handleClick}>新增</Button>
        )
    }

}

export default AntdAddButton
