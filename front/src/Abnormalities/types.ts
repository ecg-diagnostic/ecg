export enum Abnormality {
    AtrialFibrillation,
    FirstDegreeAtrioventricularBlock,
    LeftBundleBrunchBlock,
    RightBundleBrunchBlock,
    PrematureAtrialContraction,
    PrematureVentricularContraction,
    STSegmentDepression,
    STSegmentElevated,
}

const abnormalities: ReadonlyArray<Abnormality> = Object.freeze([
    Abnormality.AtrialFibrillation,
    Abnormality.FirstDegreeAtrioventricularBlock,
    Abnormality.LeftBundleBrunchBlock,
    Abnormality.RightBundleBrunchBlock,
    Abnormality.PrematureAtrialContraction,
    Abnormality.PrematureVentricularContraction,
    Abnormality.STSegmentDepression,
    Abnormality.STSegmentElevated,
])

export type Confidence = number
export type Confidences = Array<Confidence>

const abnormalityNames: ReadonlyArray<string> = Object.freeze([
    'Atrial fibrillation (AF)',
    'First-degree atrioventricular block (I-AVB)',
    'Left bundle brunch block (LBBB)',
    'Right bundle brunch block (RBBB)',
    'Premature atrial contraction (PAC)',
    'Premature ventricular contraction (PVC)',
    'ST-segment depression (STD)',
    'ST-segment elevated (STE)',
])

export { abnormalities, abnormalityNames }
