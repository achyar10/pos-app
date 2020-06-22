import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './index.css'
import rootReducer from './reducers/rootReducer'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const store = createStore(rootReducer)

ReactDOM.render(<Provider store={store}><Routes /></Provider>, document.getElementById('root'));
serviceWorker.unregister();
