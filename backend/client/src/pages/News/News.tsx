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
import { IPost, IUser } from '../../interfaces/interfaces'
import Axios, { AxiosResponse } from 'axios';
import { myContext } from '../../Context';

import AddPost from './AddPost'
import PostItem from './PostItem'
import { Link } from 'react-router-dom';
import { CrownOutlined } from '@ant-design/icons';


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

const images = [
    {
        src: 'https://i.pinimg.com/originals/e2/bc/e5/e2bce5c32c716244954b3020fe1c695e.jpg'
    },
    {
        src: 'https://i.pinimg.com/originals/e2/bc/e5/e2bce5c32c716244954b3020fe1c695e.jpg'
    }
]

const News: React.FC = () => {
    const ctx = useContext(myContext)
    const [posts, setPosts] = useState<Array<IPost>>([])
    const [status, setStatus] = useState<boolean>(false)

    const [peoples, setPeoples] = useState<Array<IUser>>([])

    useEffect(() => {
        Axios.get('http://localhost:5000/api/news/peoples', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setPeoples(res.data.reverse())
            console.log(res.data)
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
                            <List
                                style={{paddingTop: '1rem'}}
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={peoples}
                                renderItem={item => (
                                    <List.Item>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <CrownOutlined />
                                            <Link style={{ color: 'gold' }} to={`/profile/${item.username}`}>{item.username}</Link>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </div>

                    <div style={{paddingTop: '1rem'}}>
                        <Card>
                            <strong>Photos</strong>
                            <Carousel autoplay style={{paddingTop: '1rem'}}>
                                {images.map((image) => {
                                    return (
                                        <Image 
                                            src={image.src}
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