import React, { createRef, useEffect } from 'react'
import { useStore } from 'effector-react'
import { plotStore } from './model'
import * as d3 from 'd3'
import { LEADS } from '../Settings/types'
import { frontendSettingsStore, settingsStore } from '../Settings/model'

function Plot() {
    const { signals, graphPaperGridUrl } = useStore(plotStore)
    const { scale, speed, visibleLeads } = useStore(frontendSettingsStore)
    const { sampleRate } = useStore(settingsStore)

    let svgRef = createRef<SVGSVGElement>()

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
                const FIVE_MM_IN_GRID_CELL = 5
                x = ((x / sampleRate) * speed * scale) / FIVE_MM_IN_GRID_CELL

                const CELLS_BETWEEN_SIGNALS = 4
                y =
                    CELLS_BETWEEN_SIGNALS * scale * 0.75 +
                    CELLS_BETWEEN_SIGNALS * lead_i * scale +
                    (-y * 1000) / 2 / scale

                return [scale + x, y]
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
    }, [scale, signals, speed, visibleLeads])

    return (
        <svg
            ref={svgRef}
            style={{
                backgroundImage: `url(${graphPaperGridUrl})`,
                height: '100%',
                width: '100%',
            }}
        />
    )
}

export { Plot }
