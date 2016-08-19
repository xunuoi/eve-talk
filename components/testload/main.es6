import appBoot from './app_boot'

import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyAwesomeReactComponent from './MyAwesomeReactComponent';

import DatePickerExampleSimple from './DatePicker'
import CardExampleWithAvatar from './card'

const App = () => (
  <MuiThemeProvider>
    <DatePickerExampleSimple />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('karat_app')
);