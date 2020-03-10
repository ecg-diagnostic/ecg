import { createStore } from 'effector'
import { Signals } from './types'
import { setGraphPaperGridUrl, setSignals } from './events'
import { createGraphPaperGrid } from './graphPaperGrid'
import { defaultFrontendSettingsState } from '../Settings/model'

export type PlotState = {
    graphPaperGridUrl: string
    signals: Signals
}

const defaultPlotState: PlotState = {
    graphPaperGridUrl: createGraphPaperGrid(defaultFrontendSettingsState.gridSize),
    signals: Array(12).fill(new Float32Array()),
}

const plotStore = createStore<PlotState>(defaultPlotState)
    .on(setGraphPaperGridUrl, (state, svgGridUrl) => ({
        ...state,
        graphPaperGridUrl: svgGridUrl,
    }))
    .on(setSignals, (state, signals) => ({
        ...state,
        signals,
    }))

export { plotStore }
