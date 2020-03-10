import { createStore } from 'effector'
import { FloatPrecision, Lead, LEADS, Settings, Speed } from './types'
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

const defaultSettingsState: Settings = {
    floatPrecision: FloatPrecision.Float32,
    lowerFrequencyBound: 5,
    sampleRate: 200,
    upperFrequencyBound: 190,
}

const $settings = createStore<Settings>(defaultSettingsState)
    .on(setFloatPrecision, (state, floatPrecision) => ({
        ...state,
        floatPrecision,
    }))
    .on(setLowerFrequencyBound, (state, lowerFrequencyBound) => ({
        ...state,
        lowerFrequencyBound,
    }))
    .on(setSampleRate, (state, sampleRate) => ({
        ...state,
        sampleRate,
    }))
    .on(setUpperFrequencyBound, (state, upperFrequencyBound) => ({
        ...state,
        upperFrequencyBound,
    }))
    .reset(resetSettings)

export type FrontendSettingsState = {
    gridSize: number,
    speed: Speed,
    visibleLeads: Set<Lead>,
}

export const defaultFrontendSettingsState: FrontendSettingsState = {
    gridSize: 20,
    speed: Speed._25mmPerSec,
    visibleLeads: new Set(LEADS),
}

const $frontendSettings = createStore<FrontendSettingsState>(
    defaultFrontendSettingsState,
)
    .on(setGridSize, (state, scale) => ({
        ...state,
        gridSize: scale,
    }))
    .on(setSpeed, (state, speed) => ({
        ...state,
        speed,
    }))
    .on(toggleVisibleLead, (state, lead) => {
        const { visibleLeads } = state

        if (visibleLeads.has(lead)) {
            visibleLeads.delete(lead)
        } else {
            visibleLeads.add(lead)
        }

        return {
            ...state,
            visibleLeads,
        }
    })
    .on(resetSettings, () => defaultFrontendSettingsState)

export { $frontendSettings, $settings }
