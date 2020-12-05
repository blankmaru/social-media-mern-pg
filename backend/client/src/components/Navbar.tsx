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
    MessageOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { myContext } from '../Context'
import { logOut } from 'src/config'

const Navbar: React.FC = () => {
    const ctx = useContext(myContext)

    return (
        <Menu
          mode="inline"
          theme="light"
          style={{ position: 'absolute' }}
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
                        <Link to={`/profile/?username=${ctx.username}`}>Profile</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <MessageOutlined />
                        <Link to="/messenger">Messenger</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <UsergroupAddOutlined />
                        <Link to="/friends">Friends</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <SettingOutlined />
                        <Link to="/settings">Settings</Link>
                    </Menu.Item>
                    <Menu.Item onClick={logOut}>
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
