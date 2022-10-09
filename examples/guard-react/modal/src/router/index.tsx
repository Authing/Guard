import * as React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from '../pages/Home'
import Embed from '../pages/Embed'

export default function RouterComponent() {
  return (
    <Router basename="/">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          <Embed />
        </Route>
      </Switch>
    </Router>
  )
}
