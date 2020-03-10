import { createEvent } from 'effector'
import { Token } from './types'
import { FloatPrecision, LEADS } from '../Settings/types'
import { settingsStore } from '../Settings/model'
import { setSignals } from '../Plot/events'

function fetchSignals(token: Token | null) {
    if (token === null) {
        return
    }

    const settings = settingsStore.getState()
    const query = new URLSearchParams(Object(settings)).toString()
    const url = `http://localhost:8001/${token}?${query}`

    fetch(url)
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
        })
        .then(signals => setSignals(signals))
}

const setToken = createEvent<Token>()
setToken.watch(fetchSignals)

export { fetchSignals, setToken }
