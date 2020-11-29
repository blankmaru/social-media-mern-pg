import React, { useContext, useEffect } from 'react'
import { myContext } from '../Context'

export default function Profile() {
    const ctx = useContext(myContext)

    useEffect(() => {
        
    }, [])

    return (
        <div>
            Hello, <strong>{ctx.username}</strong> !
        </div>
    )
}
