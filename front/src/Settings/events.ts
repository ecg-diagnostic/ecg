import { createEvent } from 'effector'
import { FloatPrecision, Hz, Lead, Speed } from './types'

const resetSettings = createEvent()
const setFloatPrecision = createEvent<FloatPrecision>()
const setLowerFrequencyBound = createEvent<Hz>()
const setSampleRate = createEvent<Hz>()
const setGridSize = createEvent<number>()
const setSpeed = createEvent<Speed>()
const setUpperFrequencyBound = createEvent<Hz>()
const toggleVisibleLead = createEvent<Lead>()

export {
    resetSettings,
    setFloatPrecision,
    setLowerFrequencyBound,
    setSampleRate,
    setGridSize,
    setSpeed,
    setUpperFrequencyBound,
    toggleVisibleLead,
}