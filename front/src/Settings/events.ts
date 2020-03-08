import { createEvent } from 'effector'
import { FloatPrecision, Hz, Speed, Token } from './types'

const resetSettings = createEvent()
const setFloatPrecision = createEvent<FloatPrecision>()
const setLowerFrequencyBound = createEvent<Hz>()
const setSampleRate = createEvent<Hz>()
const setScale = createEvent<number>()
const setSpeed = createEvent<Speed>()
const setToken = createEvent<Token>()
const setUpperFrequencyBound = createEvent<Hz>()
const toggleVisibleLead = createEvent<number>()

export {
    resetSettings,
    setFloatPrecision,
    setLowerFrequencyBound,
    setSampleRate,
    setScale,
    setSpeed,
    setToken,
    setUpperFrequencyBound,
    toggleVisibleLead,
}
