import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'
import { ResultsView } from '../ResultsView'
import { FileUploadView } from '../FileUploadView'
import { PlotScreen } from '../PlotView'
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
                    <PlotScreen />
                </Route>
                <Route exact path="/abnormalities">
                    <ResultsView />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export { App }
