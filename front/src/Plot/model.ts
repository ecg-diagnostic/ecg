import { createStore } from 'effector'
import { Signals } from './types'
import { setSvgGridUrl } from './events'
import { createSvgGrid } from './createSvgGrid'
import { defaultFrontendSettingsState } from '../Settings/model'

export type PlotState = {
    svgGridUrl: string,
    signals: Signals,
}

const defaultPlotState: PlotState = {
    svgGridUrl: createSvgGrid(defaultFrontendSettingsState.scale),
    signals: Array(12).fill(new Float32Array()),
}

const plotStore = createStore<PlotState>(defaultPlotState).on(
    setSvgGridUrl,
    (state, svgGridUrl) => ({
        ...state,
        svgGridUrl,
    }),
)

export { plotStore }
