import React from 'react';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { Signals } from './Signals';
import './global.css'

initializeIcons()

function App() {
    return (
        <>
            <Signals />
        </>
    );
}

export default App;
