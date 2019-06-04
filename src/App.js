import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Navigation from 'components/Navigation';
import Recorder from 'components/Recorder';
import Storage from 'components/Storage';
import Settings from 'components/Settings';

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
          </Switch>
        </div>
      </div>
    );  
  }
  
}

export default App;
