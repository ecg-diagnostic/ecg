export type Hz = number
export type Token = string

export enum FloatPrecision {
    Float16 = 16,
    Float32 = 32,
    Float64 = 64,
}

export enum Speed {
    _25mmPerSec,
    _50mmPerSec
}

export type Settings = {
    floatPrecision: FloatPrecision,
    lowerFrequencyBound: Hz,
    sampleRate: Hz,
    upperFrequencyBound: Hz,
}
