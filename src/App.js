import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Navigation from 'components/Navigation';
import Recorder from 'components/Recorder';
import Storage from 'components/Storage';
import Settings from 'components/Settings';
import Workspace from 'components/Workspace';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <div>
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Recorder />}
            />
            <Route 
              path="/storage"
              render={() => <Storage />}
            />
            <Route
              path="/settings"
              render={() => <Settings />}
            />
            <Route
              path="/open"
              render={() => <Workspace />}
            />
            <Route
              render={() => <Recorder />}
            />
          </Switch>
        </div>
      </div>
    );  
  }
  
}

export default App;
