import React, { createRef, useEffect } from 'react'
import { useStore } from 'effector-react'
import { $frontendSettings, $settings } from '../Settings/model'
import { createTile, draw, getDimensions } from './draw'
import { $plot } from './model'
import './Plot.css'

function Plot() {
    const svgRef = createRef<SVGSVGElement>()
    const settings = {
        ...useStore($frontendSettings),
        ...useStore($settings),
    }
    const { signals } = useStore($plot)
    const [height, width] = getDimensions(signals, settings)

    useEffect(() => {
        if (svgRef.current) {
            svgRef.current.innerHTML = ''
        }
        draw(svgRef.current, signals, settings)
    }, [svgRef, settings, signals])

    const tileObjectUrl = createTile({
        color: settings.color,
        gridSize: settings.gridSize,
        patternName: 'grid',
    })

    return (
        <svg
            className="plot"
            height={height}
            ref={svgRef}
            style={{ backgroundImage: `url(${tileObjectUrl})` }}
            width={width}
        />
    )
}

export { Plot }
