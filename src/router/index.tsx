import * as React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Callback from '../pages/Callback'
import Personal from '../pages/Personal'
import Jump from '../pages/Jump'

export default function RouterComponent () {
  return (
    <Router basename='/'>
      <Switch>
      <Route exact path='/'>
          <Home />
        </Route>
        <Route exact path='/login'>
          <Login />
        </Route>
        <Route exact path='/callback'>
          <Callback />
        </Route>
        <Route exact path='/personal'>
          <Personal />
        </Route>
        <Route exact path='/jump'>
          <Jump />
        </Route>
      </Switch>
    </Router>
  )
}
