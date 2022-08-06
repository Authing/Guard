import * as React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Callback from '../pages/Callback'
import Jump from '../pages/Jump'
import Personal from '../pages/Personal'

export default function RouterComponent() {
  return (
    <Router basename="/">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/jump">
          <Jump />
        </Route>
        <Route exact path="/callback">
          <Callback />
        </Route>
        <Route exact path="/personal">
          <Personal />
        </Route>
      </Switch>
    </Router>
  )
}
