import React, {createRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import { axisBottom, axisLeft } from 'd3-axis'

type Signal = Float64Array
type Signals = Array<Signal>

const SIGNALS_COUNT = 12
Array.from({length: 4}, (_, i) => i)
const signalsRange = [...Array(SIGNALS_COUNT)].map((_, i) => i)

function Signals() {
    let svgRef = createRef<SVGSVGElement>()
    const defaultSignals = signalsRange.map(() => new Float64Array())
    const [signals, setSignals] = useState<Signals>(defaultSignals)
    const [dotsGridUrl, setDotsGridUrl] = useState<string>('')

    useEffect(() => {
        fetch('/A1960')
            .then(response => response.blob())
            .then(blob => new Response(blob))
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => new Float64Array(arrayBuffer))
            .then(concatenatedSignals => {
                const signalPointsCount = concatenatedSignals.length / SIGNALS_COUNT
                const signals = signalsRange.map(i => {
                    const slice = concatenatedSignals.slice(i * signalPointsCount, i * signalPointsCount + signalPointsCount)
                    console.log(i * signalPointsCount, i * signalPointsCount + signalPointsCount, slice.length)
                    return new Float64Array(slice)
                })
                setSignals(signals)
            })
    }, [])

    useEffect(() => {
        if (svgRef.current) {
            svgRef.current.innerHTML = ''
        }

        setDotsGridUrl(createDotsGridUrl())
        console.log('dotsGridUrl', dotsGridUrl)




        const svg = d3.select(svgRef.current)

        const SIGNAL_POINTS_COUNT = 5000
        const X_SCALE_FACTOR = 0.5
        const PADDING = 10

        const HEIGHT = 600
        const WIDTH = PADDING + SIGNAL_POINTS_COUNT * X_SCALE_FACTOR + PADDING

        const BIG_GRID_STEP = 50
        const SMALL_GRID_STEP = 50

        for (let signal_i = 0; signal_i < SIGNALS_COUNT; signal_i++) {
            if (signals[0].length === 0) {
                continue
            }
            const datum = Array.from(signals[signal_i]).map((x, i) => [PADDING + i * X_SCALE_FACTOR, 20 + signal_i * 50 + -x * 100])
            svg.append('path')
                .datum(datum)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                // @ts-ignore
                .attr("d", d3.line().x(d => d[0]).y(d => d[1]))
        }
    }, [signals])

    return (
        <>
            <svg
                ref={svgRef}
                style={{ background: `url(${dotsGridUrl})` }}
                height="600"
                width="2000"
            />
        </>
    )
}

function createDotsGridUrl(size: number = 30, color: string = '#ffa500') {
    const dotsGridElement = document.createElement('svg')
    dotsGridElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const dotsGrid = d3.select(dotsGridElement)
        .attr('height', size)
        .attr('width', size)

    for (let i = size / 5; i < size; i += size / 5) {
        for (let j = size / 5; j < size; j += size / 5) {
            dotsGrid.append('circle')
                .attr('cy', i)
                .attr('cx', j)
                .attr('r', size / 50)
                .attr('fill', color)
        }
    }

    dotsGrid.append('path')
        .datum([[0, 0], [size, 0], [size, size], [0, size], [0, 0]])
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr("stroke-width", size / 50)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        // @ts-ignore
        .attr("d", d3.line().x(d => d[0]).y(d => d[1]))

    const blob = new Blob([dotsGridElement.outerHTML], {type: 'image/svg+xml'});
    return URL.createObjectURL(blob);
}

export { Signals }
