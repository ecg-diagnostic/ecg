export type Hz = number

export enum FloatPrecision {
    Float32 = 32,
    Float64 = 64,
}

export const FLOAT_PRECISIONS: Array<FloatPrecision> = [
    FloatPrecision.Float32,
    FloatPrecision.Float64,
]

export type Settings = {
    floatPrecision: FloatPrecision
    lowerFrequencyBound: Hz
    sampleRate: Hz
    upperFrequencyBound: Hz
}

export enum Speed {
    _25mmPerSec,
    _50mmPerSec,
}

export enum Lead {
    I,
    II,
    III,
    aVL,
    aVR,
    aVF,
    V1,
    V2,
    V3,
    V4,
    V5,
    V6,
}

export const LEADS: Array<Lead> = [
    Lead.I,
    Lead.II,
    Lead.III,
    Lead.aVL,
    Lead.aVR,
    Lead.aVF,
    Lead.V1,
    Lead.V2,
    Lead.V3,
    Lead.V4,
    Lead.V5,
    Lead.V6,
]
