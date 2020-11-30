import { 
    CommentOutlined, 
    DeleteOutlined, 
    EditOutlined, 
    ExclamationCircleOutlined, 
    HeartFilled, 
    HeartOutlined, 
    UploadOutlined 
} from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, Modal, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { myContext } from 'src/Context';
import { IPost } from 'src/interfaces/interfaces';
import io from 'socket.io-client'

const socketServer = 'ws://localhost:5000';

let socket: SocketIOClient.Socket;

interface PostProps {
    item: IPost
}

export default function PostItem(props: PostProps) {
    const ctx = useContext(myContext)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [image, setImage] = useState<string>('')

    const [visible, setVisible] = useState<boolean>(false)
    const [status, setStatus] = useState<boolean>(false)

    const [likes, setLikes] = useState<number>(0)

    const [reportType, setReportType] = useState<string>('')

    useEffect(() => {
        socket = io(socketServer, {
            transportOptions: ['websocket']
        });

        setLikes(props.item.likes)

        // update this in the future
        socket.on('Output like', (msg: any) => window.location.href = '/')

        // update this in the future
        socket.on('Output unlike', (msg: any) => window.location.href = '/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketServer])

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

    const deletePost = (id: string) => {
        Axios.delete(`http://localhost:5000/api/posts/${id}`)
            .then((res: AxiosResponse) => {
                setStatus(true)
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
		<Card hoverable style={{ width: '75%', marginTop: '1rem' }} key={props.item.id}>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div>
					{props.item.author.username}
					<p style={{ color: 'gray' }}>@{props.item.author.username}</p>
				</div>
				{ctx?.username === props.item.author.username ? (
					<div>
						<Button onClick={showModal} style={{ marginLeft: '1rem' }}>
							<EditOutlined />
						</Button>
						<Modal
							title={props.item.title}
							visible={visible}
							onOk={() => update(props.item.id)}
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
										{({ getRootProps, getInputProps }) => (
											<section style={{ marginTop: '1rem' }}>
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
							onClick={() => deletePost(props.item.id)}
							style={{
								marginLeft: '1rem',
								color: 'red',
								borderColor: 'red',
							}}
						>
							<DeleteOutlined />
						</Button>
					</div>
				) : ctx ? (
					<div>
						<Button>FOLLOW</Button>
						<Button onClick={showModal} style={{ marginLeft: '1rem' }}>
							REPORT <ExclamationCircleOutlined />
						</Button>
						<Modal title="Report" visible={visible} onOk={() => report(props.item.id)} onCancel={handleCancel}>
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
										<Select.Option value="Spam">Spam</Select.Option>
										<Select.Option value="Violence">Violence</Select.Option>
										<Select.Option value="Pornography">Pornography</Select.Option>
									</Select>
								</Form.Item>
							</Form>
						</Modal>
					</div>
				) : null}
			</div>
			<Divider />
			<Card.Meta title={props.item.title} description={props.item.content} />
			<img style={{ marginTop: '1rem' }} alt="example" src={props.item.image} width="350" height="350" />
			<Divider />
			<div style={{ display: 'flex', justifyContent: 'space-around' }}>
				{ctx ? (
					ctx.posts?.includes(parseInt(props.item.id)) ? (
						<div onClick={() => unlike(props.item)}>
							<HeartFilled /> Like {likes}
						</div>
					) : (
						<div onClick={() => like(props.item)}>
							<HeartOutlined /> Like {likes}
						</div>
					)
				) : null}
				<div>
					<CommentOutlined /> Comments
				</div>
			</div>
		</Card>
	);
}
