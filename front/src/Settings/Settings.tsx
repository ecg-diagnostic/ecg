import React, { useState } from 'react'
import { useStore } from 'effector-react'
import {
    DefaultButton,
    Label,
    Slider,
    Stack,
    Toggle,
} from 'office-ui-fabric-react'
import './Settings.css'
import {
    resetSettings,
    setFloatPrecision,
    setLowerFrequencyBound,
    setSampleRate,
    setGridSize,
    setSpeed,
    setUpperFrequencyBound,
    toggleVisibleLead,
} from './events'
import { FLOAT_PRECISIONS, FloatPrecision, Lead, LEADS, Speed } from './types'
import { $frontendSettings, $settings } from './model'

function Settings() {
    const { gridSize, speed, visibleLeads } = useStore($frontendSettings)
    const {
        floatPrecision,
        lowerFrequencyBound,
        sampleRate,
        upperFrequencyBound,
    } = useStore($settings)

    const [isDeveloperSettings, setDeveloperSettings] = useState<boolean>(false)

    return (
        <Stack tokens={{ childrenGap: 12 }} className="settings">
            <Slider
                value={gridSize}
                label="Zoom"
                max={30}
                min={10}
                onChange={setGridSize}
                step={1}
                valueFormat={(value: number) => `${value * 2} px/cm`}
            />

            <Stack>
                <Label>Horizontal scale</Label>
                <Stack horizontal className="settings__switches">
                    <DefaultButton
                        checked={speed === Speed._25mmPerSec}
                        onClick={() => setSpeed(Speed._25mmPerSec)}
                    >
                        25 mm/s
                    </DefaultButton>
                    <DefaultButton
                        checked={speed === Speed._50mmPerSec}
                        onClick={() => setSpeed(Speed._50mmPerSec)}
                    >
                        50 mm/s
                    </DefaultButton>
                </Stack>
            </Stack>

            <Stack>
                <Label>Visible leads</Label>
                {[
                    [0, 6],
                    [6, 12],
                ].map(interval => (
                    <Stack
                        className="settings__switches"
                        horizontal
                        key={interval.join()}
                    >
                        {LEADS.slice(...interval).map(lead => (
                            <DefaultButton
                                checked={visibleLeads.has(lead)}
                                key={lead}
                                onClick={() => toggleVisibleLead(lead)}
                            >
                                {Lead[lead]}
                            </DefaultButton>
                        ))}
                    </Stack>
                ))}
            </Stack>

            <Stack>
                <Slider
                    value={lowerFrequencyBound}
                    label="Lower frequency bound"
                    max={30}
                    min={0}
                    onChange={setLowerFrequencyBound}
                    step={1}
                    valueFormat={(value: number) => `${value} Hz`}
                />
                <Slider
                    value={upperFrequencyBound}
                    label="Upper frequency bound"
                    max={200}
                    min={30}
                    onChange={setUpperFrequencyBound}
                    step={10}
                    valueFormat={(value: number) => `${value} Hz`}
                />
            </Stack>

            <Toggle
                onText="Hide developer settings"
                offText="Show developer settings"
                onChange={() => setDeveloperSettings(!isDeveloperSettings)}
            />

            {isDeveloperSettings && (
                <Stack>
                    <Slider
                        value={sampleRate}
                        label="Frontend sample rate"
                        max={500}
                        min={100}
                        onChange={setSampleRate}
                        step={10}
                        valueFormat={(value: number) => `${value} Hz`}
                    />

                    <Label>Frontend data transfer float precision</Label>
                    <Stack horizontal className="settings__switches">
                        {FLOAT_PRECISIONS.map(p => (
                            <DefaultButton
                                checked={floatPrecision === p}
                                key={p}
                                onClick={() => setFloatPrecision(p)}
                            >
                                {FloatPrecision[p]}
                            </DefaultButton>
                        ))}
                    </Stack>
                </Stack>
            )}

            <DefaultButton onClick={() => resetSettings()}>
                Reset to defaults
            </DefaultButton>
        </Stack>
    )
}

export { Settings }
