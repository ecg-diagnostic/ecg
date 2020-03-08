import React from 'react';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { PlotScreen } from './PlotScreen';
import './global.css'

initializeIcons()

function App() {
    return (
        <>
            <PlotScreen />
        </>
    );
}

export default App;
