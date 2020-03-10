import { createEvent } from 'effector'
import { Token } from './types'

const setToken = createEvent<Token>()

export { setToken }
