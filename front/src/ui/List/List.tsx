import React, { ReactNode } from 'react'
import './List.css'

enum ListType {
    OrderedList,
    UnorderedList,
}

interface ListProps {
    children: ReactNode
    listType: ListType
}

function List(props: ListProps) {
    const { children, listType } = props

    const wrappedChildren = React.Children.map(children, child => (
        <li>{child}</li>
    ))

    switch (listType) {
        case ListType.OrderedList:
            return <ol className="list">{wrappedChildren}</ol>
        case ListType.UnorderedList:
            return <ul className="list">{wrappedChildren}</ul>
        default:
            throw new Error(`unknown type: ${listType}`)
    }
}

List.ListType = ListType

export { List }
