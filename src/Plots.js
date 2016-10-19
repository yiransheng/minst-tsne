import React, {Component} from 'react';
import {connect} from 'react-redux';
import Scatter from './Scatter';
import * as C from './constants';

class Plots extends Component {

  render() {
    const {data, label, dispatch, shouldUpdate, images} = this.props; 
    return (
      <div>
        <Scatter data={data} shouldUpdate={shouldUpdate} images={images}/>
      </div>
    );
  }
}

const select = (state) => {
  return {
    shouldUpdate : state.data2d && state.step % 5 === 0,
    images : state.minst.X,
    data : state.data2d ? {X:state.data2d, Y:state.label} : null
  }
}

export default connect(select)(Plots);
