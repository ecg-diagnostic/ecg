import { createEvent } from 'effector'
import { createSvgGrid } from './createSvgGrid'
import { setScale } from '../Settings/events'
import { Signals } from './types'

const setSignals = createEvent<Signals>()
const setSvgGridUrl = createEvent<string>()

setScale.watch(scale => {
    const svgGridUrl = createSvgGrid(scale)
    setSvgGridUrl(svgGridUrl)
})

export { setSignals, setSvgGridUrl }
