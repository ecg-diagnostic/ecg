import { createStore, sample } from 'effector'
import { $token } from '../App/model'
import { fetchAbnormalities } from '../PlotScreen/events'
import { $settings } from '../Settings/model'
import { fetchAbnormalitiesFx } from './effects'
import { resetAbnormalities } from './events'
import { Abnormality, Confidence } from './types'

type AbnormalitiesState = {
    [Abnormality.AtrialFibrillation]: Confidence,
    [Abnormality.FirstDegreeAtrioventricularBlock]: Confidence,
    [Abnormality.LeftBundleBrunchBlock]: Confidence,
    [Abnormality.RightBundleBrunchBlock]: Confidence,
    [Abnormality.PrematureAtrialContraction]: Confidence,
    [Abnormality.PrematureVentricularContraction]: Confidence,
    [Abnormality.STSegmentDepression]: Confidence,
    [Abnormality.STSegmentElevated]: Confidence,
}

const defaultState: AbnormalitiesState = {
    [Abnormality.AtrialFibrillation]: 0,
    [Abnormality.FirstDegreeAtrioventricularBlock]: 0,
    [Abnormality.LeftBundleBrunchBlock]: 0,
    [Abnormality.RightBundleBrunchBlock]: 0,
    [Abnormality.PrematureAtrialContraction]: 0,
    [Abnormality.PrematureVentricularContraction]: 0,
    [Abnormality.STSegmentDepression]: 0,
    [Abnormality.STSegmentElevated]: 0,
}

const $abnormalities = createStore<AbnormalitiesState>(defaultState)
    .on(fetchAbnormalitiesFx.done, (_, { result: confidences }) => {
        return {
            [Abnormality.AtrialFibrillation]: confidences[Abnormality.AtrialFibrillation],
            [Abnormality.FirstDegreeAtrioventricularBlock]: confidences[Abnormality.FirstDegreeAtrioventricularBlock],
            [Abnormality.LeftBundleBrunchBlock]: confidences[Abnormality.LeftBundleBrunchBlock],
            [Abnormality.RightBundleBrunchBlock]: confidences[Abnormality.RightBundleBrunchBlock],
            [Abnormality.PrematureAtrialContraction]: confidences[Abnormality.PrematureAtrialContraction],
            [Abnormality.PrematureVentricularContraction]: confidences[Abnormality.PrematureVentricularContraction],
            [Abnormality.STSegmentDepression]: confidences[Abnormality.STSegmentDepression],
            [Abnormality.STSegmentElevated]: confidences[Abnormality.STSegmentElevated],
        }
    })
    .on(resetAbnormalities, () => defaultState)

sample({
    source: {
        settings: $settings,
        token: $token,
    },
    clock: fetchAbnormalities,
    target: fetchAbnormalitiesFx,
})

export { $abnormalities }
