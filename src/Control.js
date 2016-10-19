import React, {Component} from 'react';
import {red500, yellow500, blue500} from 'material-ui/styles/colors';
import Play from 'material-ui/svg-icons/av/play-circle-filled';
import Pause from 'material-ui/svg-icons/av/pause-circle-outline';
import Block from 'material-ui/svg-icons/content/block';
import RaisedButton from 'material-ui/RaisedButton';
import {connect} from 'react-redux';
import Slider from 'material-ui/Slider';
import * as C from './constants';

const stepStyle = {
  position: 'relative',
  top: -8,
  left : 10
}

class Control extends Component {

  render() {
    const {dispatch, ready, step, opts, disabled} = this.props;
    let control;

    if (!ready) {
      control = <Block color={red500} />
    } else if (disabled) {
      control = <Pause onClick={() => dispatch({ type: C.TSNE_STOP })} color={blue500} />
    } else {
      control = <Play onClick={() => dispatch({ type: C.TSNE_RUN })} color={red500} disabled={ready}/>
    }

    return (
      <div style={{maxWidth: 400, margin:'auto'}}>
        <span>Perplexity {opts.perplexity}</span>
        <Slider min={1} max={50} step={1}
           disabled={disabled} 
           value={opts.perplexity}
           onChange={(e, val) => dispatch({ type: C.UPDATE_OPTS, payload:{perplexity:val}})} />
        <span>Epsilon {opts.epsilon}</span>
        <Slider min={1} max={15}
           disabled={disabled} 
           value={opts.epsilon}
           onChange={(e, val) => dispatch({ type: C.UPDATE_OPTS, payload:{epsilon:val}})} />
        <div>
          <div style={{ display: !ready ? 'inline-block' : 'none', marginRight: 10, position:'relative', top:-5 }}>
            <RaisedButton fullWidth={false} label="Initialize" 
              onClick={()=> dispatch({ type: C.GEN_DATA })}
              backgroundColor={blue500} 
            />
          </div>
          {control} 
          <span style={stepStyle}>{step > 0 ? `Step: ${step}` : ''}</span>
        </div>
      </div>
    );
  }
}

const select = (state) => {
  return {
    opts : state.tsneOpts,
    disabled : state.running,
    ready : !!state.data2d,
    step : state.step
  };
}

export default connect(select)(Control);
