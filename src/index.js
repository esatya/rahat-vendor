import React from 'react';
import ReactDOM from 'react-dom';
import App from './modules/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './assets/custom/styles.css';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorkerRegistration.unregister();
reportWebVitals();
