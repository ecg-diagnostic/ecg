import { createEvent } from 'effector'
import { FloatPrecision, Hz, Lead, Speed, Token } from './types'

const resetSettings = createEvent()
const setFloatPrecision = createEvent<FloatPrecision>()
const setLowerFrequencyBound = createEvent<Hz>()
const setSampleRate = createEvent<Hz>()
const setScale = createEvent<number>()
const setSpeed = createEvent<Speed>()
const setUpperFrequencyBound = createEvent<Hz>()
const toggleVisibleLead = createEvent<Lead>()

export {
    resetSettings,
    setFloatPrecision,
    setLowerFrequencyBound,
    setSampleRate,
    setScale,
    setSpeed,
    setUpperFrequencyBound,
    toggleVisibleLead,
}
