import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/" component={Dashboard} />
      </Switch>
    </ThemeProvider>
  );
};

export default App;
