import React, { useState } from 'react'
import { useStore } from 'effector-react'
import {
    DefaultButton,
    Panel,
    PrimaryButton,
    Stack,
} from 'office-ui-fabric-react'
import { useConstCallback } from '@uifabric/react-hooks'
import './PlotScreen.css'
import { Settings } from '../Settings'
import { Plot } from '../Plot'
import { $token } from '../App/model'
import { Redirect, useHistory } from 'react-router-dom'

const PlotScreen: React.FunctionComponent = () => {
    const history = useHistory()
    const token = useStore($token)
    const [isFilterOpen, setFilterOpen] = useState<boolean>(false)

    const openPanel = useConstCallback(() => setFilterOpen(true))
    const dismissPanel = useConstCallback(() => setFilterOpen(false))

    const onRenderFooterContent = useConstCallback(() => (
        <Stack horizontal tokens={{ childrenGap: 6 }}>
            <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
        </Stack>
    ))

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
                    disabled={isFilterOpen}
                    onClick={() => history.push('/')}
                >
                    Back
                </DefaultButton>
                <DefaultButton
                    className="plot-screen__button"
                    iconProps={{ iconName: 'Installation' }}
                    disabled
                >
                    Download as image
                </DefaultButton>
                <DefaultButton
                    className="plot-screen__button"
                    disabled={isFilterOpen}
                    iconProps={{ iconName: 'FilterSettings' }}
                    onClick={openPanel}
                >
                    Settings
                </DefaultButton>
                <PrimaryButton
                    className="plot-screen__button--primary"
                    disabled={isFilterOpen}
                    iconProps={{ iconName: 'Health' }}
                    onClick={() => history.push('/abnormalities')}
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

export { PlotScreen }
