import Axios, { AxiosResponse } from 'axios'
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { IUser } from './interfaces/interfaces'

export const myContext = createContext<Partial<IUser>>({})
export default function Context(props: PropsWithChildren<any>) {
    const [user, setUser] = useState<IUser>()

    useEffect(() => {
        Axios.get('http://localhost:5000/api/users/user', {withCredentials: true})
            .then((res: AxiosResponse) => {
                console.log(res)
                setUser(res.data)
            })
    }, [])

    return (
        <myContext.Provider value={user!}>{props.children}</myContext.Provider>
    )
}