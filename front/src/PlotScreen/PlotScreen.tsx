import React, { useState } from 'react'
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

const PlotScreen: React.FunctionComponent = () => {
    const [isFilterOpen, setFilterOpen] = useState<boolean>(false)

    const openPanel = useConstCallback(() => setFilterOpen(true))
    const dismissPanel = useConstCallback(() => setFilterOpen(false))
    const onRenderFooterContent = useConstCallback(() => (
        <Stack horizontal tokens={{ childrenGap: 6 }}>
            <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
            <PrimaryButton onClick={dismissPanel}>Apply</PrimaryButton>
        </Stack>
    ))

    return (
        <div className="plot-screen">
            <div className="plot-screen__plot">
                <Plot />
            </div>

            <div className="plot-screen__buttons">
                <Stack horizontal tokens={{ childrenGap: 6 }}>
                    <DefaultButton
                        disabled={isFilterOpen}
                        onClick={() => setFilterOpen(true)}
                    >
                        Settings
                    </DefaultButton>
                    <PrimaryButton disabled={isFilterOpen}>
                        Predict
                    </PrimaryButton>
                </Stack>
            </div>

            <Panel
                closeButtonAriaLabel="Close"
                headerText="Settings"
                isFooterAtBottom={true}
                isLightDismiss
                isOpen={isFilterOpen}
                onDismiss={() => setFilterOpen(false)}
                onRenderFooterContent={onRenderFooterContent}
            >
                <Settings />
            </Panel>
        </div>
    )
}

export { PlotScreen }
