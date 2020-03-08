import React, {useState} from 'react'
import {
    DefaultButton,
    Panel,
    PrimaryButton,
    Stack,
} from 'office-ui-fabric-react';
import { useConstCallback } from '@uifabric/react-hooks';
import { Chart } from './Chart'
import './Signals.css'
import {Settings} from "../../Settings";

const Signals: React.FunctionComponent = () => {
    const [isFilterOpen, setFilterOpen] = useState<boolean>(false)

    const openPanel = useConstCallback(() => setFilterOpen(true));
    const dismissPanel = useConstCallback(() => setFilterOpen(false));
    const onRenderFooterContent = useConstCallback(() => (
        <Stack horizontal tokens={{childrenGap: 6}}>
            <DefaultButton onClick={dismissPanel}>
                Cancel
            </DefaultButton>
            <PrimaryButton onClick={dismissPanel}>
                Apply
            </PrimaryButton>
        </Stack>
    ));

    return (
        <div className="signals">
            <div className="signals__chart">
                <Chart />
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

            <div className="signals__controls">
                <div className="signals__buttons">
                    <Stack horizontal tokens={{ childrenGap: 6 }}>
                        <DefaultButton
                            onClick={() => setFilterOpen(!isFilterOpen)}
                        >
                            Settings
                        </DefaultButton>
                        <PrimaryButton disabled={isFilterOpen}>
                            {'Predict'}
                        </PrimaryButton>
                    </Stack>
                </div>
            </div>
        </div>
    )
}

export { Signals }
