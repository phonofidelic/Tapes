import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";

import Header from 'components/Header';
import Recorder from 'components/Recorder';
import Settings from 'components/Settings';

import './App.css';

class App extends Component {
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
                <Recorder />
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
