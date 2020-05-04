import * as d3 from 'd3'
import { FrontendSettings, Settings } from '../Settings/types'
import { Signals } from './types'

interface DrawGridSettings {
    color: string
    gridSize: number
    patternName: string
}

type DrawSettings = FrontendSettings & Settings

function drawGrid(
    svgElement: SVGSVGElement | null,
    settings: DrawGridSettings,
): void {
    const pattern = d3
        .select(svgElement)
        .append('defs')
        .append('pattern')
        .attr('id', settings.patternName)
        .attr('height', settings.gridSize)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', settings.gridSize)

    const dotRadius = settings.gridSize / 50
    const start = settings.gridSize / 5
    const step = settings.gridSize / 5

    for (let i = start; i < settings.gridSize; i += step) {
        for (let j = start; j < settings.gridSize; j += step) {
            pattern
                .append('circle')
                .attr('cy', i)
                .attr('cx', j)
                .attr('r', dotRadius)
                .attr('fill', settings.color)
        }
    }

    const topLeft = [0, 0]
    const topRight = [settings.gridSize, 0]
    const bottomRight = [settings.gridSize, settings.gridSize]
    const bottomLeft = [0, settings.gridSize]

    pattern
        .append('path')
        .datum([topLeft, topRight, bottomRight, bottomLeft, topLeft])
        .attr('fill', 'none')
        .attr('stroke', settings.color)
        .attr('stroke-width', dotRadius)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        // @ts-ignore
        .attr('d', d3.line())
}

function createTile(settings: DrawGridSettings): string {
    const tileElement = (document.createElement(
        'svg',
    ) as unknown) as SVGSVGElement
    tileElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    drawGrid(tileElement, settings)
    d3.select(tileElement)
        .attr('height', settings.gridSize)
        .attr('width', settings.gridSize)
        .append('rect')
        .attr('height', settings.gridSize)
        .attr('width', settings.gridSize)
        .attr('fill', `url(#${settings.patternName})`)

    const blob = new Blob([tileElement.outerHTML], {
        type: 'image/svg+xml',
    })

    return URL.createObjectURL(blob)
}

function draw(
    svgElement: SVGSVGElement | null,
    signals: Signals,
    settings: DrawSettings,
    withGrid = true,
): void {
    const {
        gridSize,
        lineHeight,
        paddingLeft,
        paddingTop,
        sampleRate,
        speed,
        visibleLeads,
    } = settings

    const svg = d3.select(svgElement).attr('fill', '#fff')
    const [height, width] = getDimensions(signals, settings)

    svg.append('rect')
        .attr('height', height)
        .attr('width', width)

    if (withGrid) {
        const patternName = 'grid'
        drawGrid(svgElement, {
            color: settings.color,
            gridSize: settings.gridSize,
            patternName,
        })
        svg.attr('fill', `url(#${patternName})`)
    }

    visibleLeads.forEach((lead, line_idx) => {
        const datum = Array.from(signals[lead]).map((y, x) => {
            const offsetTop = lineHeight * line_idx
            const stepX = (speed * gridSize) / 5

            x = paddingLeft + (x / sampleRate) * stepX
            y = paddingTop + offsetTop - y * 2 * gridSize

            return [x, y]
        })

        svg.append('path')
            .datum(datum)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            // @ts-ignore
            .attr('d', d3.line())
    })
}

function getDimensions(
    signals: Signals,
    s: Settings & FrontendSettings,
): [number, number] {
    const seconds = signals[0].length / s.sampleRate
    const innerHeight = (s.visibleLeads.length - 1) * s.lineHeight
    const innerWidth = seconds * (s.speed / 5) * s.gridSize
    const height = s.paddingTop + innerHeight + s.paddingBottom
    const width = s.paddingLeft + innerWidth + s.paddingRight
    return [height, width]
}

export { createTile, draw, drawGrid, getDimensions }
