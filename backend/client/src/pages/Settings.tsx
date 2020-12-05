import React, { useContext, useState } from 'react';
import { Button, Collapse, Divider, Form, Input, Modal } from 'antd';
import { ArrowRightOutlined, FacebookOutlined, FileImageOutlined, GoogleOutlined, InstagramOutlined, ReloadOutlined, SendOutlined, UploadOutlined,  } from '@ant-design/icons';
import { logOut, serverURL } from '../config'
import { myContext } from 'src/Context';
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Dropzone from 'react-dropzone';

const { Panel } = Collapse;

function Settings() {
    const ctx = useContext(myContext)
    const [phone, setPhone] = useState<string>()
    const [address, setAddress] = useState<string>()
	const [bio, setBio] = useState<string>()
	
	const [status, setStatus] = useState<boolean>(false)
	const [image, setImage] = useState<string>('')

	const [inst, setInst] = useState<string>('')
	const [facebook, setFacebook] = useState<string>('')
	const [google, setGoogle] = useState<string>('')

    const update = () => {
        Axios.put(serverURL + `/api/users/${ctx.id}`, {
            phone,
            address,
            bio
        }, { withCredentials: true }).then((res: AxiosResponse) => {
            setTimeout(() => {
                window.location.href = "/"
            }, 1000)
		})
	}
	
	const deleteAccount = () => {
		Axios.delete(serverURL + `/api/users/${ctx.id}`).then((res: AxiosResponse) => {
			logOut()
		})
	}

	const showModal = () => {
        setStatus(true)
    };

    const handleCancel = () => {
        setStatus(false)
	};
	
	const changeAvatar = () => {
		Axios.post(serverURL + `/api/users/uploadAvatar/${ctx.id}`, {
            image: image
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
			window.location.href = "/"
        })
	}

	const changeBg = () => {
		Axios.post(serverURL + `/api/users/uploadBg/${ctx.id}`, {
            image: image
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
			window.location.href = "/"
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
                    setImage(res.data.url)
                }
            })
	}
	
	const sendSocialAccountsInfo = () => {
		Axios.post(serverURL + `/api/users/accounts/${ctx.id}`, {
			instagram: inst,
			facebook,
			google
		}, { withCredentials: true }).then((res: AxiosResponse) => {
			window.location.href = "/"
		})
	}

	return (
		<div style={{ margin: 'auto', width: '50%' }}>
			<h5 style={{ marginBottom: '2rem' }}>
				<ArrowRightOutlined /> Settings
			</h5>
			<h5>Account</h5>
			<Collapse defaultActiveKey={['1']} accordion>
				<Panel header="Edit profile" key="1">
					<Form>
						<Form.Item>
							<Input
								placeholder="Update Phone"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
						</Form.Item>
                        <Form.Item>
							<Input
								placeholder="Update Address"
								value={address}
								onChange={(e) => setAddress(e.target.value)}
							/>
						</Form.Item>
                        <Form.Item>
							<Input
								placeholder="Update Bio"
								value={bio}
								onChange={(e) => setBio(e.target.value)}
							/>
						</Form.Item>
                        <Form.Item>
							<Button onClick={update}>
                                <ReloadOutlined /> UPDATE
                            </Button>
						</Form.Item>
					</Form>
				</Panel>
			</Collapse>
			<div style={{display: 'flex', marginTop: '1rem'}}>
				<div>
					<Button type="dashed">Change password</Button>
				</div>
				<div style={{ marginLeft: '1rem' }}>
					<Button onClick={() => showModal()}>Change avatar</Button>
					<Modal 
						title="Upload Avatar" 
						visible={status} 
						onOk={() => changeAvatar()} 
						onCancel={handleCancel}
					>
							<Form>
								<Form.Item>
									<strong>Current image: </strong> {ctx?.avatar}
								</Form.Item>
								{image.length > 0 
								? null 
								: <Form.Item>
									<Dropzone onDrop={(acceptedFiles: Array<File>) => onSubmitImg(acceptedFiles)}>
										{({ getRootProps, getInputProps }) => (
											<section style={{ marginTop: '1rem' }}>
												<div {...getRootProps()}>
													<input {...getInputProps()} />
													<Button block type="primary">
														<UploadOutlined /> Click to upload avatar
													</Button>
												</div>
											</section>
										)}
									</Dropzone>
								</Form.Item>
								}
								{image ? <p><FileImageOutlined /> {image}</p> : null}
							</Form>
						</Modal>
				</div>
				<div style={{ marginLeft: '1rem' }}>
					<Button onClick={() => showModal()}>Change background</Button>
					<Modal 
						title="Upload user background" 
						visible={status} 
						onOk={() => changeBg()} 
						onCancel={handleCancel}
					>
							<Form>
								<Form.Item>
									<strong>Current image: </strong> {ctx?.bgcover}
								</Form.Item>
								{image.length > 0 
								? null 
								: <Form.Item>
									<Dropzone onDrop={(acceptedFiles: Array<File>) => onSubmitImg(acceptedFiles)}>
										{({ getRootProps, getInputProps }) => (
											<section style={{ marginTop: '1rem' }}>
												<div {...getRootProps()}>
													<input {...getInputProps()} />
													<Button block type="primary">
														<UploadOutlined /> Click to upload background image
													</Button>
												</div>
											</section>
										)}
									</Dropzone>
								</Form.Item>
								}
								{image ? <p><FileImageOutlined /> {image}</p> : null}
							</Form>
						</Modal>
				</div>
			</div>
			<Divider />
			<h5>Social Accounts</h5>
			<Collapse defaultActiveKey={['1']} accordion>
				<Panel header="Social accounts" key="1">
                    <div>
                        <InstagramOutlined /> <strong>Instagram</strong>
						<Input 
							value={inst}
							onChange={(e) => setInst(e.target.value)}
							placeholder="Instagram account url" 
						/> 
                    </div>
                    <div>
                        <FacebookOutlined /> <strong>Facebook</strong> 
						<Input 
							value={facebook}
							onChange={(e) => setFacebook(e.target.value)} 
							placeholder="Facebook account url" 
						/> 
                    </div>
                    <div>
                        <GoogleOutlined /> <strong>Google</strong> 
						<Input 
							value={google}
							onChange={(e) => setGoogle(e.target.value)}
							placeholder="Google account url" 
						/> 
                    </div>
					<Button onClick={() => sendSocialAccountsInfo()}><SendOutlined /> SEND</Button>
				</Panel>
			</Collapse>
			<Divider />
			<div>
				<Button onClick={() => deleteAccount()} style={{ color: 'red', borderColor: 'red' }}>Delete Account</Button>
			</div>
		</div>
	);
}

export default Settings;
