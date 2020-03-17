import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'
import { AbnormalitiesScreen } from '../Abnormalities'
import { UploadScreen } from '../Landing'
import { PlotScreen } from '../PlotScreen'
import './App.css'

initializeIcons()

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <UploadScreen />
                </Route>
                <Route exact path="/plot">
                    <PlotScreen />
                </Route>
                <Route exact path="/abnormalities">
                    <AbnormalitiesScreen />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export { App }
