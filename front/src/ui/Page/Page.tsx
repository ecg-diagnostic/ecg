import React, { ReactNode } from 'react'
import './Page.css'

interface PageProps {
    children: ReactNode,
    title: string,
}

function Page(props: PageProps) {
    const {
        children,
        title,
    } = props

    return (
        <div className="page">
            <div className="page__panel">
                <h1 className="page__title">
                    {title}
                </h1>
                <div className="page__children">
                    {children}
                </div>
            </div>
        </div>
    )
}

export { Page }
