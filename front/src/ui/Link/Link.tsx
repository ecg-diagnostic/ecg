import React, { ReactText } from 'react'
import classNames from 'classnames'
import './Link.css'

enum UnderlineType {
    Dotted,
    Solid,
}

interface LinkProps {
    children: ReactText,
    onClick: (event: any) => void
    to: string,
    underlineType: UnderlineType,
}

function Link(props: LinkProps) {
    const {
        children,
        onClick: handleClick,
        to,
        underlineType,
    } = props

    return (
        <a
            className={classNames('link', {
                'link--dotted': underlineType === UnderlineType.Dotted,
            })}
            onClick={handleClick}
            href={to}
        >
            {children}
        </a>
    )
}

Link.defaultProps = {
    underlineType: UnderlineType.Solid,
}

Link.UnderlineType = UnderlineType

export { Link }
