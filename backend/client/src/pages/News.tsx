import React, { useState, useEffect, useContext } from 'react'
import { 
    Row, 
    Col,
    Form, 
    Input, 
    Button,
    Card,
    Divider,
    Spin,
    Modal,
    Empty,
    Image,
    Select
} from 'antd';
import {
    UploadOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    HeartOutlined,
    HeartFilled,
    CommentOutlined
} from '@ant-design/icons'
import { IPost } from '../interfaces/interfaces'
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { myContext } from '../Context';
import Dropzone from 'react-dropzone';
import io from 'socket.io-client'

const { Meta } = Card;
const { TextArea } = Input;
const { Option } = Select;

const socketServer = 'ws://localhost:5000';

let socket: SocketIOClient.Socket;

const News: React.FC = () => {
    const ctx = useContext(myContext)
    const [posts, setPosts] = useState<Array<IPost>>()
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [status, setStatus] = useState<boolean>(false)
    const [visible, setVisible] = useState<boolean>(false)

    const [image, setImage] = useState<string>('')
    const [reportType, setReportType] = useState<string>('')

    useEffect(() => {
        Axios.get('http://localhost:5000/api/posts', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setPosts(res.data.reverse())
        })
        Axios.get('http://localhost:5000/api/users', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            console.log(res.data)
        })
    }, [])

    useEffect(() => {
        socket = io(socketServer, {
            transportOptions: ['websocket']
        });

        socket.on('Output like', (msg: any) => {
            console.log(msg)
        })

        socket.on('Output unlike', (msg: any) => {
            console.log(msg)
        })
    }, [socketServer])

    const submit = () => {
        Axios.post('http://localhost:5000/api/posts', {
            title,
            content,
            author: ctx,
            image: image
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            console.log(res.data)
            window.location.href = '/'
        })
    }

    const onSubmitImg = (acceptedFiles: Array<File>) => {
        console.log(acceptedFiles)
        let formData = new FormData()

        let config: AxiosRequestConfig = {
            headers: { 'content-type': 'multipart/form-data' }
        }

        formData.append('file', acceptedFiles[0])

        Axios.post('api/files/uploadfiles', formData, config)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data)
                    setImage(res.data.url)
                }
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

    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    const update = (id: string) => {
        Axios.put(`http://localhost:5000/api/posts/${id}`)
            .then((res: AxiosResponse) => {
                setTimeout(() => {
                    window.location.href = "/"
                }, 1000)
            })
    }

    const report = (id: string) => {
        const report = {
            postId: id,
            message: reportType
        }
        Axios.post('http://localhost:5000/api/reports', { 
            info: JSON.stringify(report)
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            console.log(res.data)
            setTimeout(() => {
                window.location.href = "/"
            }, 1000)
        })
    }

    const like = (item: IPost) => {
        ++item.likes
        socket.emit('like', {
            data: item,
            id: ctx.id
        });
    }

    const unlike = (item: IPost) => {
        --item.likes
        socket.emit('unlike', {
            data: item,
            id: ctx.id
        });
    }

    return (
        <div>
            <Row>
                <Col span={20}>
                    {ctx 
                    ?   <Card style={{width: '75%', padding: '1rem'}} hoverable>
                            <h5>Create New Post</h5>
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
                                    <Form.Item style={{display: 'flex', flexWrap: 'wrap'}}>
                                        <Button onClick={submit}>
                                            ADD
                                        </Button>
                                        {image
                                        ?   null
                                        :   <Dropzone onDrop={(acceptedFiles: Array<File>) => onSubmitImg(acceptedFiles)}>
                                                {({getRootProps, getInputProps}) => (
                                                    <section style={{marginTop: '1rem'}}>
                                                        <div {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            <Button type="primary">
                                                                <UploadOutlined /> Click to upload image
                                                            </Button>
                                                        </div>
                                                    </section>
                                                )}
                                            </Dropzone>
                                        }
                                    </Form.Item>
                                    <Form.Item>
                                        {image.substring(0, 7) === "uploads"
                                        ?   <Image
                                                style={{ maxWidth: '200px' }}
                                                src={`http://localhost:5000/${image}`}
                                                alt="img"
                                            />
                                        :   null
                                        }
                                    </Form.Item>
                                </Form>
                        </Card>
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
                                                <Button onClick={showModal} style={{marginLeft: '1rem'}}>
                                                    <EditOutlined />
                                                </Button>
                                                <Modal
                                                    title={item.title}
                                                    visible={visible}
                                                    onOk={() => update(item.id)}
                                                    onCancel={handleCancel}
                                                >
                                                    <Form>
                                                        <Form.Item>
                                                            <Input 
                                                                placeholder="Update Title"
                                                                value={title} 
                                                                onChange={(e) => setTitle(e.target.value)}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item>
                                                            <TextArea 
                                                                placeholder="Update Content"
                                                                value={content} 
                                                                onChange={(e) => setContent(e.target.value)}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item>
                                                        <Dropzone onDrop={(acceptedFiles: Array<File>) => onSubmitImg(acceptedFiles)}>
                                                                {({getRootProps, getInputProps}) => (
                                                                    <section style={{marginTop: '1rem'}}>
                                                                        <div {...getRootProps()}>
                                                                            <input {...getInputProps()} />
                                                                            <Button block type="primary">
                                                                                <UploadOutlined /> Click to change image
                                                                            </Button>
                                                                        </div>
                                                                    </section>
                                                                )}
                                                            </Dropzone>
                                                        </Form.Item>
                                                    </Form>
                                                </Modal>
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
                                        :  ctx 
                                            ?(<div>
                                                <Button>
                                                    FOLLOW
                                                </Button>
                                                <Button onClick={showModal} style={{marginLeft: '1rem'}}>
                                                    REPORT <ExclamationCircleOutlined />
                                                </Button>
                                                <Modal
                                                    title="Report"
                                                    visible={visible}
                                                    onOk={() => report(item.id)}
                                                    onCancel={handleCancel}
                                                >
                                                    <Form>
                                                        <Form.Item
                                                            name="select"
                                                            hasFeedback
                                                            rules={[{ required: true, message: 'Please select your country!' }]}
                                                        >
                                                            <Select 
                                                                value={reportType} 
                                                                placeholder="Please select a report type"
                                                                onChange={(e) => setReportType(e)}
                                                            >
                                                                <Option value="Spam">Spam</Option>
                                                                <Option value="Violence">Violence</Option>
                                                                <Option value="Pornography">Pornography</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Form>
                                                </Modal>
                                            </div>)
                                            : null
                                        }
                                    </div>
                                    <Divider />
                                    <Meta 
                                        title={item.title} 
                                        description={item.content} 
                                    />
                                    <img
                                        style={{marginTop: '1rem'}} 
                                        alt="example" 
                                        src={item.image}
                                        width="350"
                                        height="350" 
                                    />
                                    <Divider />
                                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                        {ctx 
                                        ?   ctx.posts?.includes(parseInt(item.id)) 
                                                ?   (<div onClick={() => unlike(item)}>
                                                        <HeartFilled /> Like {item.likes}
                                                    </div>)
                                                :   (<div onClick={() => like(item)}>
                                                        <HeartOutlined /> Like {item.likes}
                                                    </div>) 
                                        :   null}
                                        <div>
                                            <CommentOutlined /> Comments 
                                        </div>
                                    </div>
                              </Card>
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