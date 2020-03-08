import { createEvent } from 'effector'
import { createSvgGrid } from './createSvgGrid'
import { setPixelsInGridCell } from '../Settings/events'

const setSvgGridUrl = createEvent<string>()

setPixelsInGridCell.watch(pixelsInGridCell => {
    const svgGridUrl = createSvgGrid(pixelsInGridCell)
    setSvgGridUrl(svgGridUrl)
})

export { setSvgGridUrl }
