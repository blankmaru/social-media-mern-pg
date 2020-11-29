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
            headers: {
                'content-type': 'application/json'
            },
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
        <div className="container" style={{width: '400px', marginTop: '2rem'}}>
            <h3>Login</h3>
            <Form>
                <div className="input-field">
                    <i className="material-icons prefix"><UserOutlined /></i>
                    <Input 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                    />
                </div>
                <div className="input-field">
                    <i className="material-icons prefix"><LockOutlined /></i>
                    <Input 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                    />
                </div>
                <div className="input-field">
                    <Button onClick={login} block>
                        LOGIN
                    </Button>
                </div>
            </Form>
        </div>
    )
}
