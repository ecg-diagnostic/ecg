import { createStore } from 'effector'
import { FloatPrecision, Settings, Speed } from './types'
import { resetSettings, setToken } from './events'

const defaultSettingsState: Settings = {
    floatPrecision: FloatPrecision.Float16,
    lowerFrequencyBound: 0,
    sampleRate: 200,
    upperFrequencyBound: 200,
}

const settingsStore = createStore<Settings>(defaultSettingsState)
    .on(setToken, (state, token) => ({
        token,
        ...state,
    }))
    .reset(resetSettings)

type FrontendSettingsState = {
    scale: number,
    speed: Speed,
    visibleLeads: Array<boolean>,
}

const defaultFrontendSettingsState: FrontendSettingsState = {
    scale: 5,
    speed: Speed._25mmPerSec,
    visibleLeads: Array(3).fill(4),
}

const frontendSettingsStore = createStore<FrontendSettingsState>(defaultFrontendSettingsState)

export {
    frontendSettingsStore,
    settingsStore,
}
