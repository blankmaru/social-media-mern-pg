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
import { IPost, IUser, IImage } from '../../interfaces/interfaces'
import Axios, { AxiosResponse } from 'axios';
import { myContext } from '../../Context';

import AddPost from './AddPost'
import PostItem from './PostItem'
import { Link } from 'react-router-dom';
import { v4 as uuid4 } from 'uuid'


// raw data template
const data = [
    {
      title: 'Geddoku',
    },
    {
      title: 'Trixy',
    },
    {
      title: 'aSSa',
    },
    {
      title: 'FGD2',
    },
];

const chats = [
    {
        title: 'Music',
    },
    {
        title: 'Sport',
    },
    {
        title: 'Adventure',
    },
    {
        title: 'Games',
    },
]

const News: React.FC = () => {
    const ctx = useContext(myContext)
    const [posts, setPosts] = useState<Array<IPost>>([])
    const [status, setStatus] = useState<boolean>(false)

    const [peoples, setPeoples] = useState<Array<IUser>>([])
    const [images, setImages] = useState<Array<IImage>>([])

    useEffect(() => {
        Axios.get('http://localhost:5000/api/news/peoples', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setPeoples(res.data.reverse())
            console.log(res.data)
        })

        Axios.get('http://localhost:5000/api/news/images', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setImages(res.data.images.reverse())
        })

        Axios.get('http://localhost:5000/api/posts', {
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
                                            <Link style={{ color: 'black' }} to={`/profile/${item.username}`}>{item.username}</Link>
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
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item>
                                        <Avatar size="large">
                                            <Link style={{color: 'white'}} to={`/profile/${item.title}`}>{item.title}</Link>
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