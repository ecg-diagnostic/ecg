import React from 'react'
import './Note.css'

interface NoteProps {
    children: React.ReactNode
}

function Note(props: NoteProps) {
    const { children } = props

    return (
        <p className="note">
            {children}
        </p>
    )
}

export { Note }
