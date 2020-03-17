import { createStore, merge, sample } from 'effector'
import { Signals } from './types'
import { setGraphPaperGridUrl } from './events'
import { createGraphPaperGrid } from './graphPaperGrid'
import { defaultFrontendSettingsState, $settings } from '../Settings/model'
import { $token } from '../App/model'
import {
    resetSettings,
    setFloatPrecision,
    setLowerFrequencyBound,
    setSampleRate,
    setUpperFrequencyBound,
} from '../Settings/events'
import { setToken } from '../App/events'
import { fetchSignalsFx } from './effects'

export type PlotState = {
    graphPaperGridUrl: string
    signals: Signals
}

const defaultPlotState: PlotState = {
    graphPaperGridUrl: createGraphPaperGrid(
        defaultFrontendSettingsState.gridSize,
    ),
    signals: Array(12).fill(new Float32Array()),
}

const $plot = createStore<PlotState>(defaultPlotState)
    .on(setGraphPaperGridUrl, (state, svgGridUrl) => ({
        ...state,
        graphPaperGridUrl: svgGridUrl,
    }))
    .on(fetchSignalsFx.done, (state, { result }) => ({
        ...state,
        signals: result,
    }))

sample({
    source: {
        settings: $settings,
        token: $token,
    },
    clock: merge([
        resetSettings,
        setFloatPrecision,
        setLowerFrequencyBound,
        setSampleRate,
        setToken,
        setUpperFrequencyBound,
    ]),
    target: fetchSignalsFx,
})

export { $plot }
