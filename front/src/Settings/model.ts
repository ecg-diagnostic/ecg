import { createStore } from 'effector'
import { FloatPrecision, FrontendSettings, Lead, Settings, Speed } from './types'
import {
    resetSettings,
    setFloatPrecision,
    setLineHeightInCells,
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

const gridSize = 20
const defaultFrontendSettingsState: FrontendSettings = {
    color: '#ffa500',
    gridSize,
    lineHeight: 4 * gridSize,
    paddingBottom: 2 * gridSize,
    paddingLeft: gridSize,
    paddingRight: gridSize,
    paddingTop: 3 * gridSize,
    speed: Speed._25mmPerSec,
    visibleLeads: [
        Lead.I,
        Lead.II,
        Lead.III,
        Lead.aVL,
        Lead.aVR,
        Lead.aVF,
        Lead.V1,
        Lead.V2,
        Lead.V3,
        Lead.V4,
        Lead.V5,
        Lead.V6,
    ],
}

const $frontendSettings = createStore<FrontendSettings>(
    defaultFrontendSettingsState,
)
    .on(setGridSize, (state, scale) => ({
        ...state,
        gridSize: scale,
        lineHeight: scale * (state.lineHeight / state.gridSize),
        paddingBottom: scale * (defaultFrontendSettingsState.paddingBottom / gridSize),
        paddingLeft: scale * (defaultFrontendSettingsState.paddingLeft / gridSize),
        paddingRight: scale * (defaultFrontendSettingsState.paddingRight / gridSize),
        paddingTop: scale * (defaultFrontendSettingsState.paddingTop / gridSize),
    }))
    .on(setLineHeightInCells, (state, lineHeightInCells) => ({
        ...state,
        lineHeight: lineHeightInCells * state.gridSize,
    }))
    .on(setSpeed, (state, speed) => ({
        ...state,
        speed,
    }))
    .on(toggleVisibleLead, (state, lead) => {
        const { visibleLeads } = state

        if (visibleLeads.includes(lead)) {
            const set = new Set(visibleLeads)
            set.delete(lead)
            return {
                ...state,
                visibleLeads: Array.from(set),
            }
        }

        return {
            ...state,
            visibleLeads: Array
                .from(new Set<Lead>([...visibleLeads, lead]))
                .sort((a, b) => a - b)
        }
    })
    .on(resetSettings, () => defaultFrontendSettingsState)

export { $frontendSettings, $settings }
