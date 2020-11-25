import React, { useContext } from 'react'
import {
    Menu
} from 'antd'
import { 
    HomeOutlined, 
    UserOutlined,
    LoginOutlined,
    ProfileOutlined,
    LogoutOutlined,
    PlusCircleOutlined,
    SettingOutlined,
    UsergroupAddOutlined,
    MessageOutlined,
    NotificationOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { myContext } from '../Context'
import Axios, { AxiosResponse } from 'axios'

const Navbar: React.FC = () => {
    const ctx = useContext(myContext)

    const logout = () => {
        Axios.get('http://localhost:5000/api/users/logout', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            if (res.data.success === true) {
                window.location.href = "/"
            }
        })
    }

    return (
        <Menu
          mode="inline"
          theme="dark"
          style={{height: '100vh'}}
        >
            <Menu.Item>
                <HomeOutlined />
                <Link to="/">News</Link>
            </Menu.Item>
            {ctx ? (
                <>
                    {ctx.isAdmin ? (<Menu.Item>
                            <UserOutlined />
                            <Link to="/admin">Admin</Link>
                        </Menu.Item>) : null}
                    <Menu.Item>
                        <ProfileOutlined />
                        <Link to="/profile">Profile</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <UsergroupAddOutlined />
                        <Link to="/friends">Friends</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <NotificationOutlined />
                        <Link to="/notifications">Notifications</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <SettingOutlined />
                        <Link to="/settings">Settings</Link>
                    </Menu.Item>
                    <Menu.Item onClick={logout}>
                        <LogoutOutlined />
                        <Link to="/logout">Logout</Link>
                    </Menu.Item>
                </>
            ) : (
                <>
                    <Menu.Item>
                        <LoginOutlined />
                        <Link to="/login">Login</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <PlusCircleOutlined />
                        <Link to="/register">Register</Link>
                    </Menu.Item> 
                </>
            )
            }
        </Menu>
    )
}

export default Navbar
