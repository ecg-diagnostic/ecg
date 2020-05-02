import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'
import { PredictionsView } from '../PredictionsView'
import { FileUploadView } from '../FileUploadView'
import { PlotView } from '../PlotView'
import './App.css'

initializeIcons()

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <FileUploadView />
                </Route>
                <Route exact path="/plot">
                    <PlotView />
                </Route>
                <Route exact path="/predictions">
                    <PredictionsView />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export { App }
