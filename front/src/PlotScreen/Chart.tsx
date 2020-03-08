import React, {createRef, useEffect, useState} from 'react';
import * as d3 from 'd3';

type Signal = Float64Array
type Chart = Array<Signal>

const SIGNALS_COUNT = 12
const signalsRange = [...Array(SIGNALS_COUNT)].map((_, i) => i)

function Chart() {
    let svgRef = createRef<SVGSVGElement>()
    const defaultSignals = signalsRange.map(() => new Float64Array())
    const [signals, setSignals] = useState<Chart>(defaultSignals)
    const [dotsGridUrl, setDotsGridUrl] = useState<string>('')

    useEffect(() => {
        fetch('/A1960')
            .then(response => response.blob())
            .then(blob => new Response(blob))
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => new Float64Array(arrayBuffer))
            .then(concatenatedSignals => {
                // const signalPointsCount = concatenatedSignals.length / SIGNALS_COUNT
                // const signals = signalsRange.map(i => {
                //     const slice = concatenatedSignals.slice(i * signalPointsCount, i * signalPointsCount + signalPointsCount)
                //     console.log(i * signalPointsCount, i * signalPointsCount + signalPointsCount, slice.length)
                //     return new Float64Array(slice)
                // })
                // setSignals(signals)
            })
    }, [])

    useEffect(() => {
        if (svgRef.current) {
            svgRef.current.innerHTML = ''
        }

        // setDotsGridUrl(createDotsGridUrl())

        // const svg = d3.select(svgRef.current)

        // const SIGNAL_POINTS_COUNT = 5000
        // const X_SCALE_FACTOR = 0.5
        // const PADDING = 20

        // const HEIGHT = 600
        // const WIDTH = PADDING + SIGNAL_POINTS_COUNT * X_SCALE_FACTOR + PADDING
        //
        // const BIG_GRID_STEP = 50
        // const SMALL_GRID_STEP = 50

        // for (let signal_i = 0; signal_i < SIGNALS_COUNT; signal_i++) {
        //     if (signals[0].length === 0) {
        //         continue
        //     }
        //     const datum = Array.from(signals[signal_i]).map((x, i) => [PADDING + i * X_SCALE_FACTOR, 25 + signal_i * 50 + -x * 40])
        //     svg.append('path')
        //         .datum(datum)
        //         .attr('fill', 'none')
        //         .attr('stroke', 'black')
        //         .attr("stroke-linejoin", "round")
        //         .attr("stroke-linecap", "round")
        //         // @ts-ignore
        //         .attr("d", d3.line().x(d => d[0]).y(d => d[1]))
        // }
    }, [signals])

    return (
        <svg
            ref={svgRef}
            style={{
                display: 'block',
                background: `url(${dotsGridUrl})`,
            }}
            height="600"
            width="2000"
        />
    )
}

export { Chart }
