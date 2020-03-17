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

export type Confidence = number
export type Confidences = Array<Confidence>
