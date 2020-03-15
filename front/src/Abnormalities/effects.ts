import { createEffect } from 'effector'
import { Token } from '../App/types'
import { Settings } from '../Settings/types'

const fetchAbnormalitiesFx = createEffect({
    handler: (params: {
        settings: Settings
        token: Token
    }): Promise<Array<number>> => {
        const { settings, token } = params

        if (token === null) {
            throw new Error(`empty token`)
        }

        const query = new URLSearchParams(Object(settings)).toString()
        const url = `http://localhost:8001/abnormalities/${token}?${query}`

        return fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(response.statusText)
            })
            .then(response => response as Array<number>)
    },
})

export { fetchAbnormalitiesFx }
