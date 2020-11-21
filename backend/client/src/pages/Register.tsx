import React, { useState } from 'react'
import { Form, Input, Button } from 'antd';
import {
    UserOutlined,
    LockOutlined
} from '@ant-design/icons'
import Axios, { AxiosResponse } from 'axios';

export default function Register() {
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const register = () => {
        Axios.post('http://localhost:5000/api/users/register', {
            username,
            email,
            password
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data.success === true) {
                window.location.href = "/login"
            }
        })
    }

    return (
        <div style={{padding: '2rem'}}>
            <h2>Register</h2>
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
                        type="email"
                        placeholder="Email"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
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
                        onClick={register}
                    >
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
