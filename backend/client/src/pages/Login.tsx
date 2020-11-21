import React, { useState } from 'react'
import { Form, Input, Button } from 'antd';
import {
    UserOutlined,
    LockOutlined
} from '@ant-design/icons'
import Axios, { AxiosResponse } from 'axios';

export default function Login() {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const login = () => {
        Axios.post('http://localhost:5000/api/users/login', {
            username,
            password
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data.auth === true) {
                window.location.href = "/"
            }
        }).catch((err: Error) => {
            console.log({ error: err })
        })
    }

    return (
        <div style={{padding: '2rem'}}>
            <h2>Login</h2>
            <Form className="login-form">
                <Form.Item>
                    <Input
                        prefix={<UserOutlined type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Username"
                        onChange={e => setUsername(e.target.value)}
                        value={username}
                    />
                </Form.Item>
                <Form.Item>
                    <Input
                        prefix={<LockOutlined type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                    />
                </Form.Item>
                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        className="login-form-button"
                        onClick={login}
                    >
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
