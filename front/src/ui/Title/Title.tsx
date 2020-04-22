import React from 'react'
import './Title.css'

interface TitleProps {
    children: string
}

function Title(props: TitleProps) {
    const { children } = props

    return (
        <div className="title">
            {children}
        </div>
    )
}

export { Title }
