import React, { useContext } from 'react'
import { myContext } from '../Context'

export default function Profile() {
    const ctx = useContext(myContext)

    return (
        <div>
            Hello, <strong>{ctx.username}</strong> !
        </div>
    )
}
