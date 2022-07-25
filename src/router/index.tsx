import * as React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Login from 'src/pages/Login'
import Callback from 'src/pages/Callback'
import Personal from 'src/pages/Personal'

export default function RouterComponent () {
  return (
    <Router basename='/'>
      <Switch>
      <Route exact path='/'>
          <Login />
        </Route>
        <Route exact path='/callback'>
          <Callback />
        </Route>
        <Route exact path='/personal'>
          <Personal />
        </Route>
      </Switch>
    </Router>
  )
}