import React, { Component } from "react";
import 'react-dat-gui/build/react-dat-gui.css';
import DatGui, { DatBoolean, DatColor, DatNumber, DatString, DatSelect } from 'react-dat-gui';

class MyGUI extends Component{
    state = {
        data:{
            id: '1',
            pointSize: 0.01,
            isGpu: true,
            color: '#2FA1D6',
            displayType: 'point',
            factory: 0,
            isReload: true,
        }
    }

    handleUpdate = data => {
        this.setState({ data })
        this.props.callResult(this.state.data)
    }

    render() {

        const {data} = this.state

        return (
            <DatGui data={data} onUpdate={this.handleUpdate}>
                <DatString path='id' label='id' />
                <DatNumber path='pointSize' label='pointSize' min={0.0001} max={10} step={0.0001} />
                <DatNumber path='factory' label='factory' min={0} max={1} step={0.01} />
                <DatBoolean path='isGpu' label='isGpu?' />
                <DatColor path='color' label='color' />
                <DatSelect path='displayType' lable='displayType' options={['point', 'line', 'face']} />
                <DatBoolean path='isReload' label='isReload' />
            </DatGui>
        )
    }

}

export default MyGUI