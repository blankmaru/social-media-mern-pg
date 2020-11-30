import React, { useState, useEffect, useContext } from 'react'
import { 
    Row, 
    Col, 
    Spin,
    Empty,
} from 'antd';
import { IPost } from '../../interfaces/interfaces'
import Axios, { AxiosResponse } from 'axios';
import { myContext } from '../../Context';

import AddPost from './AddPost'
import PostItem from './PostItem'


const News: React.FC = () => {
    const ctx = useContext(myContext)
    const [posts, setPosts] = useState<Array<IPost>>()
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
                <Col span={20}>
                    {ctx 
                    ? <AddPost />
                    : null
                    }
                    <div>
                        {status
                        ?   <Spin style={{marginTop: '1rem' }} />  
                        :   null
                        }
                        {posts?.length === undefined
                        ? <Empty style={{ width: '75%', marginTop: '1rem' }} />
                        : posts?.map((item) => {
                            return (
                                <PostItem item={item} />
                            )
                        })}
                    </div>
                </Col>
                <Col span={2}>
                    <p>Popular Author's</p>
                    <p>Photos</p>
                    <p>People</p>
                    <p>Chat's</p>
                </Col>
            </Row>
        </div>
    )
}

export default News