import { createStore } from 'effector'
import { Token } from './types'
import {setToken} from "./events";

const tokenStore = createStore<Token | null>(null)
    .on(setToken, (_, token) => token)

export { tokenStore }
