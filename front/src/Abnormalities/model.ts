import { createStore } from 'effector'
import { fetchAbnormalitiesFx } from './effects'
import { resetAbnormalities } from './events'
import { abnormalities, Abnormality, Confidence } from './types'

type AbnormalitiesState = Map<Abnormality, Confidence>

const defaultState: AbnormalitiesState = new Map<Abnormality, Confidence>()
abnormalities.forEach(a => defaultState.set(a, 0))

const $abnormalities = createStore<AbnormalitiesState>(defaultState)
    .on(fetchAbnormalitiesFx.done, (_, { result: confidences }) => {
        const state: AbnormalitiesState = new Map<Abnormality, Confidence>()
        abnormalities.forEach((a, i) => defaultState.set(a, confidences[i]))
        return state
    })
    .on(resetAbnormalities, () => defaultState)

export { $abnormalities }
