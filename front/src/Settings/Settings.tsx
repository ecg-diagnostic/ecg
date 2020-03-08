import React from 'react'
import { useStore } from 'effector-react'
import { DefaultButton, Label, Slider, Stack } from 'office-ui-fabric-react'
import './Settings.css'
import {
    resetSettings,
    setFloatPrecision,
    setLowerFrequencyBound,
    setSampleRate,
    setScale,
    setSpeed,
    setUpperFrequencyBound,
    toggleVisibleLead,
} from './events'
import { FLOAT_PRECISIONS, FloatPrecision, Lead, LEADS, Speed } from './types'
import { frontendSettingsStore, settingsStore } from './model'

function Settings() {
    const { scale, speed, visibleLeads } = useStore(frontendSettingsStore)
    const {
        floatPrecision,
        lowerFrequencyBound,
        sampleRate,
        upperFrequencyBound,
    } = useStore(settingsStore)

    return (
        <Stack tokens={{ childrenGap: 12 }} className="settings">
            <Slider
                value={scale}
                label="Scale"
                max={10}
                min={3}
                onChange={setScale}
                step={1}
                valueFormat={(value: number) => `${value} px/mm`}
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

            <Slider
                value={sampleRate}
                label="Sample rate"
                max={500}
                min={100}
                onChange={setSampleRate}
                step={10}
                valueFormat={(value: number) => `${value} Hz`}
            />

            <Stack>
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

            <Stack>
                <Slider
                    value={lowerFrequencyBound}
                    label="Lower frequency bound"
                    max={50}
                    min={0}
                    onChange={setLowerFrequencyBound}
                    step={1}
                    valueFormat={(value: number) => `${value} Hz`}
                />
                <Slider
                    value={upperFrequencyBound}
                    label="Upper frequency bound"
                    max={200}
                    min={50}
                    onChange={setUpperFrequencyBound}
                    step={10}
                    valueFormat={(value: number) => `${value} Hz`}
                />
            </Stack>

            <DefaultButton onClick={() => resetSettings()}>
                Reset to defaults
            </DefaultButton>
        </Stack>
    )
}

export { Settings }
