import * as React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from '../pages/Home'

export default function RouterComponent() {
  return (
    <Router basename="/">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}
