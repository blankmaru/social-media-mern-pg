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

function Friends() {
    const ctx = useContext(myContext)
    const [users, setUsers] = useState<Array<IUser>>([])
    const [following, setFollowing] = useState<Array<IUser>>([])

    useEffect(() => {
        setFollowing(ctx.friends!)
        Axios.get('http://localhost:5000/api/users', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setUsers(res.data.reverse())
        })
    }, [ctx.friends])

    const follow = (item: IUser) => {
        Axios.put('http://localhost:5000/api/friends', {
            friend: item,
            user: ctx
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            console.log(res.data)
        })
    }

    return (
        <div>
            <Row>
                <Col span={12}>
                    <h3 style={{color: 'red'}}>Your friends: </h3>
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
                                            <a href={`/profile/${item.username}`}>
                                                {item.username}
                                            </a>
                                        }
                                        description={item.email}
                                    />
                                    <Button>
                                        UNFOLLOW
                                    </Button>
                                </List.Item>
                        )}
                    />
                </Col>
                <Col span={12}>
                    <h3>Peoples: </h3>
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
                                            <a href={`/profile/${item.username}`}>
                                                {item.username}
                                            </a>
                                        }
                                        description={item.email}
                                    />
                                    <Button onClick={() => follow(item)}>
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
