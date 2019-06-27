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
    let params = new URLSearchParams(window.location.search);
    console.log('params, view:', params.get('view'))
    const view = params.get('view');
    const recordingId = params.get('id');

    return (
      <div className="App">
        <Navigation />
        <div>
        { view === 'workspace' ?

          <Workspace />

          :

          <Switch>
            <Route 
              path="/storage"
              render={() => <Storage />}
            />
            <Route
              path="/settings"
              render={() => <Settings />}
            />
            <Route
              render={() => <Recorder />}
            />
          </Switch>

        }
        </div>
      </div>
    );  
  }
  
}

export default App;