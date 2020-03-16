import { createEffect } from 'effector'
import { FloatPrecision, LEADS, Settings } from '../Settings/types'
import { Token } from '../App/types'

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
        const url = `http://localhost:8001/${token}?${query}`

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

export { fetchSignalsFx }
