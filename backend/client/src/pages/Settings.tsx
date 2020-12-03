import React, { useContext, useState } from 'react';
import { Button, Collapse, Divider, Form, Input } from 'antd';
import { ArrowRightOutlined, FacebookOutlined, GoogleOutlined, InstagramOutlined, ReloadOutlined,  } from '@ant-design/icons';
import { serverURL } from '../config'
import { myContext } from 'src/Context';
import Axios, { AxiosResponse } from 'axios';

const { Panel } = Collapse;

function Settings() {
    const ctx = useContext(myContext)
    const [phone, setPhone] = useState<string>()
    const [address, setAddress] = useState<string>()
    const [bio, setBio] = useState<string>()

    const update = () => {
        Axios.put(serverURL + `/api/users/${ctx.id}`, {
            phone,
            address,
            bio
        }, { withCredentials: true }).then((res: AxiosResponse) => {
            console.log(res.data)
            setTimeout(() => {
                window.location.href = "/"
            }, 1000)
        })
    }

	return (
		<div style={{ margin: 'auto', width: '50%' }}>
			<h5 style={{ marginBottom: '2rem' }}>
				<ArrowRightOutlined /> Settings
			</h5>
			<h5>Account</h5>
			<Collapse accordion>
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
			<div style={{ marginTop: '1rem' }}>
				<Button>Change password</Button>
			</div>
			<Divider />
			<h5>Social Accounts</h5>
			<Collapse accordion>
				<Panel header="Social accounts" key="1">
                    <div>
                        <InstagramOutlined /> <strong>Instagram</strong> 
                    </div>
                    <div>
                        <FacebookOutlined /> <strong>Facebook</strong> 
                    </div>
                    <div>
                        <GoogleOutlined /> <strong>Google</strong> 
                    </div>
				</Panel>
			</Collapse>
			<Divider />
			<div>
				<Button style={{ color: 'red', borderColor: 'red' }}>Delete Account</Button>
			</div>
		</div>
	);
}

export default Settings;
