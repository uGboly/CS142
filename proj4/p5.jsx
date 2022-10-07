import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header/Header';
import ToolBarRouter from './components/toolBarRouter/ToolBarRouter';

ReactDOM.render(
  <div> <Header/><ToolBarRouter /></div>,
  document.getElementById('reactapp'),
);
