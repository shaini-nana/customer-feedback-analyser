import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.less';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
        <Switch>
          <Route path="/" component={Dashboard} />
        </Switch>
    </div>
  );
}

export default App;
