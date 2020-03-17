import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
import { $token } from '../App/model'
import { $abnormalities } from './model'
import { useHistory } from 'react-router-dom'

function AbnormalitiesScreen() {
    const abnormalities = useStore($abnormalities)
    const history = useHistory()
    const token = useStore($token)

    useEffect(() => {
        if (token === null) {
            history.push('/')
        }
    })

    return (
        <div className="abnormalities">
            {Object.entries(abnormalities).map(([a, c]) => (
                <div>{a}: {c}</div>
            ))}
        </div>
    )
}

export { AbnormalitiesScreen }
