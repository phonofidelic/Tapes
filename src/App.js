import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Recorder from './components/Recorder';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
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
        <Recorder
          onStartRec={this.onStartRec}
          onStopRec={this.onStopRec}
        />
      </div>
    );  
  }
  
}

export default App;
