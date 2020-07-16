import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// import Auth from './components/auth'
import Home from './components/home'
import Login from './components/login'
import PrivateRoute from './middlewares/PrivateRoute'

const Routes = () => (

    <Router>
        <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path="/" exact component={Home} />
        </Switch>
    </Router>
)

export default Routes