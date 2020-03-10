import { createStore } from 'effector'
import { Token } from './types'
import {setToken} from "./events";

const $token = createStore<Token>(null)
    .on(setToken, (_, token) => token)

export { $token }
