import React from 'react';
import { render } from 'react-dom';
import { Jumbotron } from 'react-bootstrap';

import './index.scss';

function App() {
  return (
    <Jumbotron>
      <h1>Node Web App Starter Kit</h1>
      <p>Opinionated starter kit for node web applications using</p>
      <ul>
        <li>ES6</li>
        <li>Babel</li>
        <li>Express</li>
        <li>React</li>
        <li>Bootstrap</li>
        <li>SCSS</li>
        <li>Webpack</li>
        <li>Docker</li>
      </ul>
    </Jumbotron>
  );
}

render(<App />, document.getElementById('reactRoot'));
