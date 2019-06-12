import React, {Component} from 'react';

import AntdUploadFile from './AntdUploadFile'


class UploadFileParent extends Component{

    handleValue2(e){
        console.log("handle vlaue = " + e)
    }


    render () {
        return (
            <AntdUploadFile  handleValue={this.handleValue2.bind(this)}/>
        )
    }
}

export default UploadFileParent