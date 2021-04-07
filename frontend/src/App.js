import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.less';
import Dashboard from './components/Dashboard';
import OverallAnalytics from './components/OverallAnalytics';
import FoodAnalytics from './components/FoodAnalytics';

function App() {
  return (
    <div className="App">
        <Switch>
          <Route path="/OverallAnalytics" component={OverallAnalytics} />
          <Route path="/FoodAnalytics" component={FoodAnalytics} />
          <Route path="/" component={Dashboard} />
        </Switch>
    </div>
  );
}

export default App;
