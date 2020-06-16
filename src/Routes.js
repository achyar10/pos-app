import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Auth from './components/auth'
import Home from './components/home'
import Login from './components/login'
// import Logout from './components/logout'

const Routes = () => (

    <Router>
        <Switch>
            <Route path="/login" component={Login} />
            <Auth>
                <Route path="/" exact component={Home} />
            </Auth>
        </Switch>
    </Router>
)

export default Routes