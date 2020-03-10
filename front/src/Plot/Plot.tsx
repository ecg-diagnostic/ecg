import React, { createRef, useEffect } from 'react'
import { useStore } from 'effector-react'
import { $plot } from './model'
import * as d3 from 'd3'
import { LEADS } from '../Settings/types'
import { $frontendSettings, $settings } from '../Settings/model'

function Plot() {
    const { signals, graphPaperGridUrl } = useStore($plot)
    const { gridSize, speed, visibleLeads } = useStore($frontendSettings)
    const { sampleRate } = useStore($settings)
    let svgRef = createRef<SVGSVGElement>()

    const FIVE_MM_IN_GRID_CELL = 5
    const CELLS_BETWEEN_SIGNALS = 4

    const topPadding = 0.75 * gridSize * CELLS_BETWEEN_SIGNALS
    const interLeadPadding = 11 * gridSize * CELLS_BETWEEN_SIGNALS
    const bottomPadding = 0.5 * gridSize * CELLS_BETWEEN_SIGNALS
    const svgHeight = topPadding + interLeadPadding + bottomPadding

    const seconds = signals[0].length / sampleRate
    const svgWidth = 2 * gridSize + seconds * (speed / 5) * gridSize

    useEffect(() => {
        if (svgRef.current) {
            svgRef.current.innerHTML = ''
        }

        const svg = d3.select(svgRef.current)

        let lead_i = 0
        LEADS.forEach(lead => {
            if (!visibleLeads.has(lead)) {
                return
            }

            const datum = Array.from(signals[lead]).map((y, x) => {
                x = ((x / sampleRate) * speed * gridSize) / FIVE_MM_IN_GRID_CELL

                y =
                    CELLS_BETWEEN_SIGNALS * gridSize * 0.75 +
                    CELLS_BETWEEN_SIGNALS * lead_i * gridSize +
                    // (-y * 1000) / 2 / gridSize
                    -y * 2 * gridSize

                return [gridSize + x, y]
            })
            lead_i++

            svg.append('path')
                .datum(datum)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr(
                    'd',
                    // @ts-ignore
                    d3
                        .line()
                        .x(d => d[0])
                        .y(d => d[1]),
                )
        })
    }, [gridSize, sampleRate, signals, speed, svgRef, visibleLeads])

    return (
        <svg
            ref={svgRef}
            style={{
                backgroundImage: `url(${graphPaperGridUrl})`,
                backgroundSize: `${gridSize}px`,
                display: 'block',
                minHeight: '100%',
                minWidth: '100%',
            }}
            height={svgHeight}
            width={svgWidth}
        />
    )
}

export { Plot }
