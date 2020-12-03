import Axios, { AxiosResponse } from "axios"
import { IUser } from "src/interfaces/interfaces"
import { serverURL } from '../config'

export const follow = (item: IUser, currentUser: Partial<IUser>) => {
    const friendName: string = `{${item.username}}`

    Axios.put(serverURL + '/api/friends/follow', {
        name: friendName,
        user: currentUser
    }, {
        withCredentials: true
    }).then((res: AxiosResponse) => {
        setTimeout(() => {
            window.location.href = "/"
        }, 500)
    })
}

export const unfollow = (item: IUser, currentUser: Partial<IUser>) => {
    const friendName: string = `${item}`

    Axios.put(serverURL + '/api/friends/unfollow', {
        name: friendName,
        user: currentUser
    }, {
        withCredentials: true
    }).then((res: AxiosResponse) => {
        setTimeout(() => {
            window.location.href = "/"
        }, 500)
    })
}