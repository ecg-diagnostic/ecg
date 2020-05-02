import { createEvent } from 'effector'

const resetPlot = createEvent()
const setGraphPaperGridUrl = createEvent<string>()

export {
    resetPlot,
    setGraphPaperGridUrl,
}
