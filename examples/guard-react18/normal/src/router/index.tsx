import * as React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from '../pages/Home'
// import Embed from '../pages/Embed'
import Callback from '../pages/Callback'
import Jump from '../pages/Jump'
import Personal from '../pages/Personal'
import TestGuard4 from '../pages/TestGuard4'

export default function RouterComponent() {
  return (
    <Router basename="/">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        {/* <Route exact path="/embed">
          <Embed />
        </Route> */}
        <Route exact path="/jump">
          <Jump />
        </Route>
        <Route exact path="/callback">
          <Callback />
        </Route>
        <Route exact path="/personal">
          <Personal />
        </Route>
        <Route exact path="/test-guard4">
          <TestGuard4 />
        </Route>
      </Switch>
    </Router>
  )
}
