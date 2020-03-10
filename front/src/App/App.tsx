import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'
import { Landing } from '../Landing'
import { PlotScreen } from '../PlotScreen'
import './App.css'

initializeIcons()

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <Landing />
                </Route>
                <Route exact path="/plot">
                    <PlotScreen />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export { App }
