import React, { useState, useEffect, useContext } from 'react'
import { 
    Row, 
    Col,
    Form, 
    Input, 
    Button,
    Card,
    Divider,
    Spin
} from 'antd';
import {
    FileImageOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons'
import { IPost } from '../interfaces/interfaces'
import Axios, { AxiosResponse } from 'axios';
import { myContext } from '../Context';
import Dropzone from 'react-dropzone';

const { Meta } = Card;

const News: React.FC = () => {
    const ctx = useContext(myContext)
    const [posts, setPosts] = useState<Array<IPost>>()
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [status, setStatus] = useState<boolean>(false)

    useEffect(() => {
        Axios.get('http://localhost:5000/api/posts', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setPosts(res.data.reverse())
        })
    }, [])

    const submit = () => {
        Axios.post('http://localhost:5000/api/posts', {
            title,
            content,
            author: ctx
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            console.log(res.data)
            window.location.href = '/'
        })
    }

    const deletePost = (id: string) => {
        Axios.delete(`http://localhost:5000/api/posts/${id}`)
            .then((res: AxiosResponse) => {
                setStatus(true)
                setTimeout(() => {
                    window.location.href = "/"
                }, 1000)
            })
    }

    const onDrop = (files: File) => {

    }

    return (
        <div>
            <Row>
                <Col span={20}>
                    {ctx 
                    ?   <Card style={{width: '75%', padding: '1rem'}} hoverable>
                            <h2>Create New Post</h2>
                                <Form className="login-form">
                                    <Form.Item>
                                        <Input
                                            placeholder="Title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Input
                                            placeholder="Content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item style={{display: 'flex'}}>
                                        <Button onClick={submit} type="primary" htmlType="submit">
                                            ADD
                                        </Button>
                                            <Dropzone onDrop={() => onDrop}>
                                                {({getRootProps, getInputProps}) => (
                                                    <section style={{marginTop: '1rem'}}>
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            <Button>
                                                                <FileImageOutlined type="upload" />
                                                            </Button>
                                                        </div>
                                                    </section>
                                                )}
                                            </Dropzone>
                                    </Form.Item>
                                </Form>
                        </Card>
                    : null
                    }
                    <div>
                        {status
                        ?   <Spin style={{marginTop: '1rem'}} />  
                        :   null
                        }
                        {posts?.map((item) => {
                            return (
                                <Card
                                    hoverable
                                    style={{ width: '75%', marginTop: '1rem' }}
                                    key={item.id}
                                >
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <div>
                                            {item.author.username} 
                                            <p style={{color: 'gray'}}>
                                                @{item.author.username}
                                            </p>
                                        </div>
                                        {ctx?.username === item.author.username
                                        ?   (<div>
                                                <Button style={{marginLeft: '1rem'}}>
                                                    <EditOutlined />
                                                </Button>
                                                <Button
                                                    onClick={() => deletePost(item.id)} 
                                                    style={{
                                                        marginLeft: '1rem', 
                                                        color: 'red', 
                                                        borderColor: 'red'
                                                    }}>
                                                    <DeleteOutlined />
                                                </Button>
                                            </div>)
                                        :   (<div>
                                                <Button>
                                                    FOLLOW
                                                </Button>
                                            </div>)
                                        }
                                    </div>
                                    <Divider />
                                    <Meta 
                                        title={item.title} 
                                        description={item.content} 
                                    />
                              </Card>
                            )
                        })}
                    </div>
                </Col>
                <Col span={2}>
                    Popular Author's
                </Col>
            </Row>
        </div>
    )
}

export default News