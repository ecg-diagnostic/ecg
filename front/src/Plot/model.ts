import { createStore, merge, sample } from 'effector'
import { Signals } from './types'
import { downloadPlot, resetPlot } from './events'
import { $frontendSettings, $settings } from '../Settings/model'
import { $token } from '../App/model'
import {
    resetSettings,
    setFloatPrecision,
    setLowerFrequencyBound,
    setSampleRate,
    setUpperFrequencyBound,
} from '../Settings/events'
import { setToken } from '../App/events'
import { downloadPlotFx, fetchSignalsFx } from './effects'

export type PlotState = {
    signals: Signals
}

const defaultPlotState: PlotState = {
    signals: Array(12).fill(new Float32Array()),
}

const $plot = createStore<PlotState>(defaultPlotState)
    .on(fetchSignalsFx.done, (state, { result }) => ({
        ...state,
        signals: result,
    }))
    .reset(resetPlot)

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

sample({
    source: {
        frontendSettings: $frontendSettings,
        settings: $settings,
        plot: $plot,
    },
    clock: downloadPlot,
    target: downloadPlotFx,
})

export { $plot }
