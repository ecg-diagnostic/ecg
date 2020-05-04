import * as d3 from 'd3'
import { createEffect } from 'effector'
import { saveAs } from 'file-saver'
import {
    FloatPrecision,
    FrontendSettings,
    LEADS,
    Settings,
} from '../Settings/types'
import { Token } from '../App/types'
import { createTile, draw, getDimensions } from './draw'
import { PlotState } from './model'

interface DownloadPlotFxStores {
    frontendSettings: FrontendSettings
    settings: Settings
    plot: PlotState
}

const downloadPlotFx = createEffect({
    handler: (stores: DownloadPlotFxStores): void => {
        const settings = {
            ...stores.frontendSettings,
            ...stores.settings,
        }
        const { signals } = stores.plot
        const svg = (document.createElement('svg') as unknown) as SVGSVGElement

        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        const [height, width] = getDimensions(signals, settings)
        d3
            .select(svg)
            .attr('height', height)
            .attr('width', width)

        draw(svg, signals, settings)

        const canvas = document.createElement('canvas')
        canvas.height = height
        canvas.width = width

        const ctx = canvas.getContext('2d')
        if (!ctx) {
            return
        }

        const blob = new Blob([svg.outerHTML], {
            type: 'image/svg+xml',
        })
        const url = URL.createObjectURL(blob)

        const image = new Image()
        image.onload = () => {
            const tileUrl = createTile({
                color: settings.color,
                gridSize: settings.gridSize,
                patternName: 'tile',
            })
            const tileImage = new Image()
            tileImage.onload = () => {
                const pattern = ctx.createPattern(tileImage, 'repeat')
                if (!pattern) {
                    return
                }

                ctx.fillStyle = '#fff'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = pattern
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                ctx.drawImage(image, 0, 0)
                canvas.toBlob(blob => {
                    if (blob) {
                        saveAs(blob, 'ecg.png')
                    }
                });
            }
            tileImage.src = tileUrl
        }
        image.src = url
    },
})

const fetchSignalsFx = createEffect({
    handler: (params: {
        settings: Settings
        token: Token
    }): Promise<Array<Float32Array> | Array<Float64Array>> => {
        const { settings, token } = params

        if (token === null) {
            throw new Error('empty token')
        }

        const query = new URLSearchParams(Object(settings)).toString()
        const url = `/api/${token}?${query}`

        return fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.blob()
                }
                throw new Error(response.statusText)
            })
            .then(blob => new Response(blob))
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                switch (settings.floatPrecision) {
                    case FloatPrecision.Float32: {
                        const signals = new Float32Array(arrayBuffer)
                        const sliceLength = signals.length / LEADS.length
                        return LEADS.map(i =>
                            signals.subarray(
                                i * sliceLength,
                                i * sliceLength + sliceLength,
                            ),
                        )
                    }
                    case FloatPrecision.Float64: {
                        const signals = new Float64Array(arrayBuffer)
                        const sliceLength = signals.length / LEADS.length
                        return LEADS.map(i =>
                            signals.subarray(
                                i * sliceLength,
                                i * sliceLength + sliceLength,
                            ),
                        )
                    }
                }
                throw new Error(
                    `wrong float precision: ${FloatPrecision.Float64}`,
                )
            })
    },
})

export { downloadPlotFx, fetchSignalsFx }
