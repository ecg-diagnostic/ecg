import { createEvent } from 'effector'
import { Signals } from './types'

const setSignals = createEvent<Signals>()
const setGraphPaperGridUrl = createEvent<string>()

export { setSignals, setGraphPaperGridUrl }
