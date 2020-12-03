import React, { useState, useEffect, useContext } from 'react'
import { 
    Row, 
    Col, 
    Spin,
    Empty,
    List,
    Card,
    Image,
    Avatar,
    Carousel
} from 'antd';
import { IPost, IUser, IImage, IChat } from '../../interfaces/interfaces'
import Axios, { AxiosResponse } from 'axios';
import { myContext } from '../../Context';
import { serverURL } from '../../config'

import AddPost from './AddPost'
import PostItem from './PostItem'
import { Link } from 'react-router-dom';
import { v4 as uuid4 } from 'uuid'

const News: React.FC = () => {
    const ctx = useContext(myContext)
    const [posts, setPosts] = useState<Array<IPost>>([])
    const [status] = useState<boolean>(false)

    const [peoples, setPeoples] = useState<Array<IUser>>([])
    const [images, setImages] = useState<Array<IImage>>([])
    const [users, setUsers] = useState<Array<IUser>>([])
    const [chats, setChats] = useState<Array<IChat>>([])

    useEffect(() => {
        // Sidebar post users
        Axios.get(serverURL + '/api/news/peoples', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setPeoples(res.data.slice(0, 4))
            console.log(res.data)
        })

        // get all users
        Axios.get(serverURL + '/api/users/', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setUsers(res.data.reverse())
        })

        // get all chats
        Axios.get(serverURL + '/api/chats/', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setChats(res.data.reverse())
        })

        // get recently images
        Axios.get(serverURL + '/api/news/images', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setImages(res.data.images.reverse())
        })

        // get all posts
        Axios.get(serverURL + '/api/posts', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setPosts(res.data.reverse())
        })
    }, [])

    return (
        <div>
            <Row>
                <Col span={18}>
                    {ctx 
                    ? <AddPost />
                    : null
                    }
                    <div>
                        {status
                        ?   <Spin style={{marginTop: '1rem' }} />  
                        :   null
                        }
                        {posts.length < 1
                        ? <Empty style={{ width: '75%', marginTop: '1rem' }} />
                        : posts?.map((item) => {
                            return (
                                <PostItem key={item.id} item={item} />
                            )
                        })}
                    </div>
                </Col>
                <Col span={4}>
        
                    <div>
                        <Card>
                            <strong>Popular Author's</strong>
                            <div style={{paddingTop: '1rem'}}>
                                {peoples.map((item) => {
                                    return (
                                        <div 
                                            key={uuid4()}
                                            style={{
                                                display: 'flex', 
                                                alignItems: 'center'
                                            }}
                                        >
                                            {/* <CrownOutlined /> */}
                                            <Link style={{ color: 'black', fontWeight: 600 }} to={`/profile/${item.username}`}>{item.username}</Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </div>

                    <div style={{paddingTop: '1rem'}}>
                        <Card>
                            <strong>Photos</strong>
                            <Carousel autoplay style={{paddingTop: '1rem'}}>
                                {images.map((image) => {
                                    return (
                                        <Image
                                            width="300"
                                            height="300"
                                            key={uuid4()} 
                                            src={image.image}
                                        />
                                    )
                                })
                                }
                            </Carousel>
                        </Card>
                    </div>
                    
                    <div style={{paddingTop: '1rem'}}>
                        <Card>
                            <strong>People</strong>
                            <List
                                style={{paddingTop: '1rem'}}
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={users}
                                renderItem={item => (
                                    <List.Item>
                                        <Avatar size="large">
                                            <Link style={{color: 'white'}} to={`/profile/?username=${item.username}`}>{item.username}</Link>
                                        </Avatar>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </div>

                    <div style={{paddingTop: '1rem'}}>
                        <Card>
                            <strong>Chat's</strong>
                            <List
                                style={{paddingTop: '1rem'}}
                                grid={{ gutter: 8, column: 2 }}
                                dataSource={chats}
                                renderItem={item => (
                                    <List.Item>
                                        <div>
                                            <Link style={{color: 'black'}} to={`/messenger`}>{item.title}</Link>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default News