import { createStore, sample } from 'effector'
import { $token } from '../App/model'
import { fetchPredictions } from '../PlotView/events'
import { $settings } from '../Settings/model'
import { fetchPredictionsFx } from './effects'
import { resetPredictions } from './events'

export enum Abnormality {
    AtrialFibrillation,
    FirstDegreeAtrioventricularBlock,
    LeftBundleBrunchBlock,
    RightBundleBrunchBlock,
    PrematureAtrialContraction,
    PrematureVentricularContraction,
    STSegmentDepression,
    STSegmentElevated,
    Normal,
}

type Confidence = number

interface Prediction {
    abnormality: Abnormality,
    confidence: Confidence,
    name: string,
}

interface PredictionsState {
    loading: boolean;
    mostConfidentPrediction: Prediction;
    results: Array<Prediction>;
}

const defaultState: PredictionsState = {
    loading: true,
    mostConfidentPrediction: {
        abnormality: Abnormality.Normal,
        confidence: 0,
        name: 'Normal ECG',
    },
    results: [
        {
            abnormality: Abnormality.AtrialFibrillation,
            confidence: 0,
            name: 'Atrial fibrillation',
        },
        {
            abnormality: Abnormality.FirstDegreeAtrioventricularBlock,
            confidence: 0,
            name: 'First-degree atrioventricular block',
        },
        {
            abnormality: Abnormality.LeftBundleBrunchBlock,
            confidence: 0,
            name: 'Left bundle brunch block',
        },
        {
            abnormality: Abnormality.RightBundleBrunchBlock,
            confidence: 0,
            name: 'Right bundle brunch block',
        },
        {
            abnormality: Abnormality.PrematureAtrialContraction,
            confidence: 0,
            name: 'Premature atrial contraction',
        },
        {
            abnormality: Abnormality.PrematureVentricularContraction,
            confidence: 0,
            name: 'Premature ventricular contraction',
        },
        {
            abnormality: Abnormality.STSegmentDepression,
            confidence: 0,
            name: 'ST-segment depression',
        },
        {
            abnormality: Abnormality.STSegmentElevated,
            confidence: 0,
            name: 'ST-segment elevated',
        },
        {
            abnormality: Abnormality.Normal,
            confidence: 0,
            name: 'Normal ECG',
        },
    ],
}

const $predictions = createStore<PredictionsState>(defaultState)
    .on(fetchPredictionsFx.done, (state, payload) => {
        const results = state.results.map((result, i) => ({
            ...result,
            confidence: payload.result[i],
        }))

        const mostConfidentResult = results
            .sort((r1, r2) => r2.confidence - r1.confidence)[0]
        console.log('results', results)
        console.log('most confident', mostConfidentResult)

        return {
            loading: false,
            results,
            mostConfidentPrediction: mostConfidentResult,
        }
    })
    .reset(resetPredictions)

sample({
    source: {
        settings: $settings,
        token: $token,
    },
    clock: fetchPredictions,
    target: fetchPredictionsFx,
})

export { $predictions }
