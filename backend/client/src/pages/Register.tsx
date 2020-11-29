import React, { useState } from 'react'
import { Form, Input, Button } from 'antd';
import {
    UserOutlined,
    LockOutlined,
    SendOutlined
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
            password,
            friends: [],
            posts: []
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data.success === true) {
                window.location.href = "/login"
            }
        })
    }

    return (
        <div className="container" style={{width: '400px', marginTop: '2rem'}}>
            <h3>Register</h3>
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
                    <i className="material-icons prefix"><SendOutlined /></i>
                    <Input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
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
                    <Button onClick={register} block>
                            REGISTER
                    </Button>
                </div>
            </Form>
        </div>
    )
}
