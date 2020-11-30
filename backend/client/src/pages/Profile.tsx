import React, { useContext, useEffect } from 'react'
import { myContext } from '../Context'

export default function Profile() {
    const ctx = useContext(myContext)

    useEffect(() => {
        setTimeout(() => {
            console.log('Posts:', ctx.posts)
            if (ctx.posts?.includes(1)) {
                console.log('success')
            }
        }, 1000)
    }, [ctx.posts])

    return (
        <div>
            Hello, <strong>{ctx.username}</strong> !
        </div>
    )
}
