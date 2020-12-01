import React, { useState, useEffect, useContext } from 'react'
import { 
    Row, 
    Col, 
    Spin,
    Empty,
    List,
    Card,
    Image
} from 'antd';
import { IPost } from '../../interfaces/interfaces'
import Axios, { AxiosResponse } from 'axios';
import { myContext } from '../../Context';

import AddPost from './AddPost'
import PostItem from './PostItem'


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

    useEffect(() => {
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
                    <p>Popular Author's</p>
                    <div>
                        <p>Photos</p>
                        <List
                            grid={{ gutter: 8, column: 2 }}
                            dataSource={data}
                            renderItem={item => (
                            <List.Item>
                                    <Image 
                                        src="https://i.pinimg.com/originals/e2/bc/e5/e2bce5c32c716244954b3020fe1c695e.jpg"  
                                    />
                            </List.Item>
                            )}
                        />
                    </div>
                    
                    <div>
                        <p>People</p>
                        <List
                            grid={{ gutter: 8, column: 2 }}
                            dataSource={data}
                            renderItem={item => (
                            <List.Item>
                                <Card>
                                    <a>
                                        {item.title}
                                    </a>
                                </Card>
                            </List.Item>
                            )}
                        />
                    </div>

                    <div>
                        <p>Chat's</p>
                        <List
                            grid={{ gutter: 8, column: 2 }}
                            dataSource={chats}
                            renderItem={item => (
                            <List.Item>
                                <Card>
                                    <a>
                                        {item.title}
                                    </a>
                                </Card>
                            </List.Item>
                            )}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default News