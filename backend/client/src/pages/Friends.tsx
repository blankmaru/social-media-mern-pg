import Axios, { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { 
    List,
    Row,
    Col, 
    Button
} from 'antd';
import { IUser } from '../interfaces/interfaces';
import { myContext } from '../Context';
import { follow, unfollow } from '../utils/utils'
import { serverURL } from '../config'

function Friends() {
    const ctx = useContext(myContext)
    const [users, setUsers] = useState<Array<IUser>>([])
    const [following, setFollowing] = useState<Array<IUser>>([])

    useEffect(() => {
        Axios.get(serverURL + '/api/users', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setUsers(res.data.reverse())
        })
        Axios.get(serverURL + `/api/friends/${ctx.id}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                setFollowing(res.data[0].friends.reverse())
                console.log(res.data[0].friends)
            })
    }, [ctx.id])

    return (
        <div>
            <Row>
                <Col span={12}>
                    <h5 style={{color: 'red'}}>Your friends: </h5>
                    <List
                        itemLayout="horizontal"
                        dataSource={following}
                        renderItem={item => ctx.username === item.username 
                            ? null 
                            :  (
                                <List.Item 
                                    style={{
                                        backgroundColor: '#f7f7f7', 
                                        padding: '1rem',
                                        width: '75%',
                                        marginTop: '1rem'}}
                                    >
                                    <List.Item.Meta
                                        title={
                                            <a href={`/profile/username=${item}`}>
                                                {item}
                                            </a>
                                        }
                                        description={item.email}
                                    />
                                    <Button onClick={() => unfollow(item, ctx)}>
                                        UNFOLLOW
                                    </Button>
                                </List.Item>
                        )}
                    />
                </Col>
                <Col span={12}>
                    <h5>Peoples: </h5>
                    <List
                        itemLayout="horizontal"
                        dataSource={users}
                        renderItem={item => 
                            ctx.username === item.username 
                            ? null 
                            :  (
                                <List.Item 
                                    style={{
                                        backgroundColor: '#f7f7f7', 
                                        padding: '1rem',
                                        width: '75%',
                                        marginTop: '1rem'}}
                                    >
                                    <List.Item.Meta
                                        title={
                                            <a href={`/profile/?username=${item.username}`}>
                                                {item.username}
                                            </a>
                                        }
                                        description={item.email}
                                    />
                                    <Button onClick={() => follow(item, ctx)}>
                                        FOLLOW
                                    </Button>
                                </List.Item>
                            )
                        }
                    />
                </Col>
            </Row>
        </div>
    )
}

export default Friends
