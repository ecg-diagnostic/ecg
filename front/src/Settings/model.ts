import { createStore } from 'effector'
import { FloatPrecision, Lead, LEADS, Settings, Speed } from './types'
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

const defaultSettingsState: Settings = {
    floatPrecision: FloatPrecision.Float16,
    lowerFrequencyBound: 0,
    sampleRate: 200,
    upperFrequencyBound: 200,
}

const settingsStore = createStore<Settings>(defaultSettingsState)
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

type FrontendSettingsState = {
    scale: number
    speed: Speed
    visibleLeads: Set<Lead>
}

const defaultFrontendSettingsState: FrontendSettingsState = {
    scale: 5,
    speed: Speed._25mmPerSec,
    visibleLeads: new Set(LEADS),
}

const frontendSettingsStore = createStore<FrontendSettingsState>(
    defaultFrontendSettingsState,
)
    .on(setScale, (state, scale) => ({
        ...state,
        scale,
    }))
    .on(setSpeed, (state, speed) => ({
        ...state,
        speed,
    }))
    .on(toggleVisibleLead, (state, lead) => {
        const visibleLeads = new Set(state.visibleLeads)
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
    .reset(resetSettings)

export { frontendSettingsStore, settingsStore }
