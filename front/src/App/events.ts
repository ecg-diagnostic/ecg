import { createEvent } from 'effector'
import { Token } from './types'
import { LEADS } from '../Settings/types'
import { settingsStore } from '../Settings/model'
import { setSignals } from '../Plot/events'

const setToken = createEvent<Token>()

setToken.watch(token => {
    const settings = settingsStore.getState()
    console.log('settings', settings)

    fetch(`http://localhost:8001/${token}`, {
        method: 'GET',
    })
        .then(response => response.blob())
        .then(blob => {
            console.log('blob.size', blob.size)
            return new Response(blob)
        })
        .then(response => response.arrayBuffer())
        // .then(arrayBuffer => new Float64Array(arrayBuffer))
        // .then(concatenatedSignals => {
        //     const signalPointsCount = concatenatedSignals.length / LEADS.length
        //     const signals = LEADS.map(i => {
        //         const slice = concatenatedSignals.slice(
        //             i * signalPointsCount,
        //             i * signalPointsCount + signalPointsCount,
        //         )
        //         return new Float64Array(slice)
        //     })
        //
        //     console.log('signals', signals)
        //     setSignals(signals)
        // })
})

setToken('a89a78f5-badf-4dfb-8364-b59650eba538')

export { setToken }
