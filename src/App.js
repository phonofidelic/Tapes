import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";

import Header from './components/Header';
import RecorderControls from './components/RecorderControls';
import Settings from './components/Settings';

import './App.css';

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: { savePath: localStorage.getItem('savePath') || null }
    }
  }

  componentDidMount() {
    ipcRenderer.on('select_dir', (e, dirPath) => {
      console.log('dirPath:', dirPath)
      localStorage.setItem('savePath', dirPath)
    })
  }

  handleStartRec = () => {
    console.log('start')
    ipcRenderer.send('start_rec')
  }

  handleStopRec = () => {
    console.log('stop')
    const savePath = localStorage.getItem('savePath')
    ipcRenderer.send('stop_rec', savePath)
  }

  handleOpenDirSelect = () => {
    ipcRenderer.send('open_dir_select')
  }

  render() {
    const { settings } = this.state;
    return (
      <div className="App">
        <Header />
        <div>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <RecorderControls
                  handleStartRec={this.handleStartRec}
                  handleStopRec={this.handleStopRec}
                />
              )}
            />
            <Route
              path="/settings"
              render={() => (
                <Settings
                  settings={settings}
                  handleOpenDirSelect={this.handleOpenDirSelect}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    );  
  }
  
}

export default App;
