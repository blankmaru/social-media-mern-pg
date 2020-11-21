import Axios, { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, List } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { myContext } from '../Context'
import { IUser } from '../interfaces/interfaces'

export default function Admin() {
    const ctx = useContext(myContext)
    const [users, setUsers] = useState<Array<IUser>>()

    useEffect(() => {
        Axios.get('http://localhost:5000/api/users/getAllUsers', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setUsers(res.data)
        })
    }, [])

    const deleteUser = (userId: string) => {
        Axios.post('http://localhost:5000/api/users/deleteUser', {
            id: userId
        }, {
            withCredentials: true
        })
    }

    return (
        <div>
            <h2>Users: </h2>
            <List
                itemLayout="horizontal"
                dataSource={users}
                renderItem={(item: IUser) => (
                    <List.Item>
                        <List.Item.Meta
                            title={<strong>{item.username}</strong>}
                        />
                        {ctx.username === item.username ? null : <Button onClick={() => deleteUser(item.id)}><DeleteOutlined /></Button>}
                    </List.Item>
                )}
            />
        </div>
    )
}
