import { createStoreObject, Store } from 'effector'
import { Settings } from '../Settings/types'
import {
    FrontendSettingsState,
    frontendSettingsStore,
    settingsStore,
} from '../Settings/model'
import { PlotState, plotStore } from '../Plot/model'
import { Token } from '../App/types'
import { tokenStore } from '../App/model'

type PlotScreenState = {
    frontendSettings: Store<FrontendSettingsState>
    plot: Store<PlotState>
    settings: Store<Settings>
    token: Store<Token | null>
}

const defaultPlotScreenState: PlotScreenState = {
    frontendSettings: frontendSettingsStore,
    plot: plotStore,
    settings: settingsStore,
    token: tokenStore,
}

const plotScreenStore = createStoreObject<PlotScreenState>(
    defaultPlotScreenState,
)

export { plotScreenStore }
