import React, { Component } from 'react';
import './App.css';

import RecorderControls from './components/RecorderControls';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;



class App extends Component {
  onStartRec = () => {
    console.log('start')
    ipcRenderer.send('start_rec')
  }

  onStopRec = () => {
    console.log('stop')
    ipcRenderer.send('stop_rec')
}
  render() {
    return (
      <div className="App">
        <RecorderControls
          onStartRec={this.onStartRec}
          onStopRec={this.onStopRec}
        />
      </div>
    );  
  }
  
}

export default App;
