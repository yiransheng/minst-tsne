import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './App.css';

import Plots from './Plots'; 
import Control from './Control';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="App">
          <h1>T-SNE Visualization of MINST Data (Sampled)</h1>
          <p>t-SNE is a useful algorithm for visualizing high-dimensional data</p>
          <p>The visualization below applies it on MINST dataset. Mouse over points to see raw handwritten digit image.</p>
          <hr />
          <Control />
          <Plots />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
