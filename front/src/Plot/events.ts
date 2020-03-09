import { createEvent } from 'effector'
import { createGraphPaperGrid, removeGraphPaperGrid } from './graphPaperGrid'
import { setScale } from '../Settings/events'
import { Signals } from './types'

const setSignals = createEvent<Signals>()
const setGraphPaperGridUrl = createEvent<string>()

setScale.watch(scale => {
    // removeGraphPaperGrid for previous url
    const url = createGraphPaperGrid(scale)
    setGraphPaperGridUrl(url)
})

export { setSignals, setGraphPaperGridUrl }
