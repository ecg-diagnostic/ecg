import React, { useState } from 'react'
import { useStore } from 'effector-react'
import {
    DefaultButton,
    Panel,
    PrimaryButton,
    Stack,
} from 'office-ui-fabric-react'
import { useConstCallback } from '@uifabric/react-hooks'
import './PlotView.css'
import { downloadPlot, resetPlot } from '../Plot/events'
import { Settings } from '../Settings'
import { Plot } from '../Plot'
import { $token } from '../App/model'
import { Redirect, useHistory } from 'react-router-dom'
import { fetchPredictions } from './events'

const PlotView: React.FunctionComponent = () => {
    const history = useHistory()
    const token = useStore($token)
    const [isFilterOpen, setFilterOpen] = useState<boolean>(false)

    const togglePanel = () => setFilterOpen(!isFilterOpen)
    const dismissPanel = useConstCallback(() => setFilterOpen(false))

    const onRenderFooterContent = useConstCallback(() => (
        <Stack horizontal tokens={{ childrenGap: 6 }}>
            <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
        </Stack>
    ))

    function handleClickBack() {
        history.push('/')
        resetPlot()
    }

    if (!token) {
        return <Redirect to="/" />
    }

    return (
        <div className="plot-screen">
            <div className="plot-screen__plot">
                <Plot />
            </div>

            <Stack
                className="plot-screen__buttons"
                horizontal
                tokens={{ childrenGap: 6 }}
            >
                <DefaultButton
                    className="plot-screen__button"
                    iconProps={{ iconName: 'Back' }}
                    onClick={handleClickBack}
                >
                    Back
                </DefaultButton>
                <DefaultButton
                    className="plot-screen__button"
                    iconProps={{ iconName: 'Installation' }}
                    onClick={() => downloadPlot()}
                >
                    Download as image
                </DefaultButton>
                <DefaultButton
                    checked={isFilterOpen}
                    className="plot-screen__button"
                    iconProps={{ iconName: 'FilterSettings' }}
                    onClick={togglePanel}
                >
                    Settings
                </DefaultButton>
                <PrimaryButton
                    className="plot-screen__button--primary"
                    iconProps={{ iconName: 'Health' }}
                    onClick={() => {
                        fetchPredictions()
                        history.push('/predictions')
                    }}
                >
                    Diagnose{' '}
                    <span className="plot-screen__button-subtext">
                        &nbsp;abnormalities
                    </span>
                </PrimaryButton>
            </Stack>

            <Panel
                closeButtonAriaLabel="Close"
                headerText="Settings"
                isBlocking={false}
                isFooterAtBottom={true}
                isLightDismiss
                isOpen={isFilterOpen}
                onDismiss={dismissPanel}
                onRenderFooterContent={onRenderFooterContent}
            >
                <Settings />
            </Panel>
        </div>
    )
}

export { PlotView }
