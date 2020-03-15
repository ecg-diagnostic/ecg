import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
import { $token } from '../App/model'
import { $settings } from '../Settings/model'
import { fetchAbnormalitiesFx } from './effects'
import { $abnormalities } from './model'
import { Abnormality, abnormalityNames } from './types'

function Abnormalities() {
    const confidences = useStore($abnormalities)
    const settings = useStore($settings)
    const token = useStore($token)

    useEffect(() => {
        fetchAbnormalitiesFx({ settings, token })
    }, [])

    return (
        <div className="abnormalities">
            [0, 0.09, 0.02, 0.01, 0.98, 0.41, 0.04, 0.02]
        </div>
    )
}

export { Abnormalities }
