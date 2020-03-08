import React, {useState} from 'react'
import {
    DefaultButton,
    Label,
    Panel,
    PrimaryButton,
    Slider,
    Stack,
} from 'office-ui-fabric-react';
import { useConstCallback } from '@uifabric/react-hooks';
import { Chart } from './Chart'
import './Signals.css'

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
                <Stack tokens={{ childrenGap: 12 }} className="settings">
                    <Stack>
                        <Label>Horizontal scale</Label>
                        <Stack horizontal className="signals__switches">
                            <DefaultButton checked>25 mm/s</DefaultButton>
                            <DefaultButton>50 mm/s</DefaultButton>
                        </Stack>
                    </Stack>

                    <Slider
                        className="signals__frequency-slider"
                        defaultValue={500}
                        label="Sample rate"
                        max={500}
                        min={100}
                        step={10}
                        valueFormat={(value: number) => `${value} Hz`}
                    />

                    <Stack>
                        <Label>Frontend data transfer float precision</Label>
                        <Stack horizontal className="signals__switches">
                            <DefaultButton>float16</DefaultButton>
                            <DefaultButton>float32</DefaultButton>
                            <DefaultButton checked>float64</DefaultButton>
                        </Stack>
                    </Stack>

                    <Stack>
                        <Label>Visible leads</Label>
                        <Stack horizontal className="signals__switches">
                            <DefaultButton>{'I'}</DefaultButton>
                            <DefaultButton checked>{'II'}</DefaultButton>
                            <DefaultButton checked>{'III'}</DefaultButton>
                            <DefaultButton>{'aVL'}</DefaultButton>
                            <DefaultButton>{'aVR'}</DefaultButton>
                            <DefaultButton>{'aVF'}</DefaultButton>
                        </Stack>

                        <Stack horizontal className="signals__switches">
                            <DefaultButton>{'V1'}</DefaultButton>
                            <DefaultButton>{'V2'}</DefaultButton>
                            <DefaultButton>{'V3'}</DefaultButton>
                            <DefaultButton>{'V4'}</DefaultButton>
                            <DefaultButton>{'V5'}</DefaultButton>
                            <DefaultButton checked>{'V6'}</DefaultButton>
                        </Stack>
                    </Stack>

                    <Stack>
                        <Slider
                            className="signals__frequency-slider"
                            defaultValue={5}
                            label="Lower frequency bound"
                            max={50}
                            min={1}
                            step={1}
                            valueFormat={(value: number) => `${value} Hz`}
                        />
                        <Slider
                            className="signals__frequency-slider"
                            defaultValue={80}
                            label="Upper frequency bound"
                            max={200}
                            min={50}
                            step={10}
                            valueFormat={(value: number) => `${value} Hz`}
                        />
                    </Stack>

                    <DefaultButton>Reset to defaults</DefaultButton>
                </Stack>
            </Panel>

            <div className="signals__controls">
                <div className="signals__buttons">
                    <Stack horizontal tokens={{ childrenGap: 6 }}>
                        <DefaultButton onClick={() => setFilterOpen(!isFilterOpen)}>
                            Settings
                        </DefaultButton>
                        <PrimaryButton disabled={isFilterOpen}>{'Predict'}</PrimaryButton>
                    </Stack>
                </div>
            </div>
        </div>
    )
}

export { Signals }
