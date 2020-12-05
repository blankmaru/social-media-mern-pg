import Axios, { AxiosResponse } from "axios"

export const serverURL = 'http://localhost:5000'

export const logOut = () => {
    Axios.get('http://localhost:5000/api/users/logout', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data.success === true) {
                window.location.href = "/"
            }
        })
}
