import React from 'react'
import { useStore } from 'effector-react'
import {plotStore} from "./model";

function Plot() {
    const {
        svgGridUrl,
    } = useStore(plotStore)

    return (
        <svg style={{
            backgroundImage: `url(${svgGridUrl})`,
            height: '100%',
            width: '100%',
        }} />
    )
}

export { Plot }
