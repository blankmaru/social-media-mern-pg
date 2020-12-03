import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Image } from 'antd';
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useState, useContext } from 'react';
import Dropzone from 'react-dropzone';
import { myContext } from 'src/Context';
import { serverURL } from '../../config'

export default function AddPost() {
    const ctx = useContext(myContext)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')

    const [image, setImage] = useState<string>('')
    
    const submit = () => {
        Axios.post(serverURL + '/api/posts', {
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

	return (
		<Card style={{ width: '75%', padding: '1rem' }} hoverable>
			<h5>Create New Post</h5>
			<Form className="login-form">
				<Form.Item>
					<Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
				</Form.Item>
				<Form.Item>
					<Input placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
				</Form.Item>
				<Form.Item style={{ display: 'flex', flexWrap: 'wrap' }}>
					<Button onClick={submit}>ADD</Button>
					{image ? null : (
						<Dropzone onDrop={(acceptedFiles: Array<File>) => onSubmitImg(acceptedFiles)}>
							{({ getRootProps, getInputProps }) => (
								<section style={{ marginTop: '1rem' }}>
									<div {...getRootProps()}>
										<input {...getInputProps()} />
										<Button type="primary">
											<UploadOutlined /> Click to upload image
										</Button>
									</div>
								</section>
							)}
						</Dropzone>
					)}
				</Form.Item>
				<Form.Item>
					{image.substring(0, 7) === 'uploads' ? (
						<Image style={{ maxWidth: '200px' }} src={`http://localhost:5000/${image}`} alt="img" />
					) : null}
				</Form.Item>
			</Form>
		</Card>
	);
}
