import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";

import Header from './components/Header';
import RecorderControls from './components/RecorderControls';
import Settings from './components/Settings';

import './App.css';

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
        <Header />
        <div>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <RecorderControls
                  onStartRec={this.onStartRec}
                  onStopRec={this.onStopRec}
                />
              )}
            />
            <Route
              path="/settings"
              render={() => (
                <Settings />
              )}
            />
          </Switch>
        </div>
      </div>
    );  
  }
  
}

export default App;
