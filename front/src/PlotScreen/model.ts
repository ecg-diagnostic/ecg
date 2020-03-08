import { createStore, createStoreObject, Store } from 'effector'
import {Settings, Token} from '../Settings/types'
import {
    FrontendSettingsState,
    frontendSettingsStore,
    settingsStore,
} from '../Settings/model'
import {PlotState, plotStore} from '../Plot/model'

const tokenStore = createStore<Token>('')

type PlotScreenState = {
    frontendSettings: Store<FrontendSettingsState>,
    plot: Store<PlotState>,
    settings: Store<Settings>,
    token: Store<Token>,
}

const defaultPlotScreenState: PlotScreenState = {
    frontendSettings: frontendSettingsStore,
    plot: plotStore,
    settings: settingsStore,
    token: tokenStore,
}

const plotScreenStore = createStoreObject<PlotScreenState>(defaultPlotScreenState)

export { plotScreenStore }
