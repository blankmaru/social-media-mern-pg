import React, { useContext, useEffect, useState } from 'react'
import { myContext } from '../Context'
import { Card, Button, List, Avatar  } from 'antd'
import { EditOutlined, FacebookOutlined, GoogleOutlined, HomeOutlined, InstagramOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { IUser } from 'src/interfaces/interfaces';
import Axios, { AxiosResponse } from 'axios';
import { serverURL } from '../config'
import { follow } from '../utils/utils'

const { Meta } = Card;

export default function Profile() {
    const ctx = useContext(myContext)
    const urlParams = new URLSearchParams(window.location.search);
	const username = urlParams.get('username');

    const [user, setUser] = useState<IUser>()

    useEffect(() => {

        Axios.get(serverURL + `/api/users/${username}`, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setUser(res.data[0])
            console.log(res.data)
        })

    }, [username])

    return (
        <div>
            <div style={{ margin: 'auto', width: '80%' }}>
                <img 
                    src={user?.bgcover === null ? "https://i.pinimg.com/originals/11/a4/ee/11a4ee83b1378dc69aa4556723771c21.jpg" : serverURL + '/' + user?.bgcover}
                    width="100%"
                    height="250px"
                    style={{borderRadius: '1rem'}}
                    alt="wallpaper"
                />
                <div style={{marginTop: '1rem', display: 'flex'}}>
                    <Card
                        style={{ width: '33%', borderRadius: '1rem' }}
                        cover={
                            <img 
                                alt="example" 
                                width="100%" 
                                height="100%" 
                                src={user?.avatar === null ? "https://sun1-88.userapi.com/impf/c840534/v840534050/4abad/BwC2LNFhnOw.jpg?size=400x0&quality=90&crop=287,0,977,1080&sign=145ddeab90d9ae10dce0999dfe8b2aae&c_uniq_tag=CTYnQylPK-A-Rv08UR3_L6sGEqnihGyL3nMulGlZv3E&ava=1" : serverURL + '/' + user?.avatar} 
                            />
                        }
                    >
                        <Meta title={user?.username} description={<><MailOutlined /> {user?.email}</>} />
                        <div style={{marginTop: '1rem'}}>
                            <div>
                                <InstagramOutlined /> <em>{user?.smaccounts == null ? "None" : user?.smaccounts[0].instagram}</em>
                            </div>
                            <div>
                                <FacebookOutlined /> <em>{user?.smaccounts == null ? "None" : user?.smaccounts[1].facebook}</em>
                            </div>
                            <div>
                                <GoogleOutlined /> <em>{user?.smaccounts == null ? "None" : user?.smaccounts[2].google}</em>
                            </div>
                        </div>
                        {ctx.username === user?.username 
                        ?   <Button onClick={() => window.location.href = "/settings"} style={{marginTop: '1rem'}}>
                                <EditOutlined /> EDIT
                            </Button>
                        :   <Button onClick={() => follow(user, ctx)} style={{marginTop: '1rem'}}>
                                <UserOutlined /> FOLLOW
                            </Button>
                        }
                    </Card>
                    
                    <Card
                        style={{ width: '33%', marginLeft: '1rem', borderRadius: '1rem' }}
                    >
                        <h5 style={{fontWeight: 'bold'}}>About</h5>
                        <div style={{marginTop: '1rem'}}>
                            <Meta title={
                                <p><PhoneOutlined /> 
                                {user?.phone === null 
                                    ?   ' Empty'
                                    :   ' ' + user?.phone
                                }
                                </p> } />
                            <Meta title={
                                <p><HomeOutlined /> 
                                {user?.address === null 
                                    ?   ' Empty'
                                    :   ' ' + user?.address
                                }</p>} />
                            <Meta title={
                                <React.Fragment>
                                    <h6 style={{fontWeight: 'bold'}}>Bio: </h6>
                                    <p>{user?.bio === null 
                                    ?   ' Empty'
                                    :   ' ' + user?.bio
                                }</p>
                                </React.Fragment>
                            } />
                        </div>
                    </Card>

                    <Card
                        style={{ width: '33%', marginLeft: '1rem' }}
                    >
                        <Card.Grid hoverable={false} style={{textAlign: 'center', width: '100%'}}><strong>{user?.friends?.length}</strong> Following</Card.Grid>
                        <div style={{marginTop: '5rem', padding: '2rem'}}>
                            <strong>Following:</strong>
                            <List
                                style={{paddingTop: '1rem', padding: '1rem'}}
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={user?.friends}
                                renderItem={item => (
                                    <List.Item>
                                        <Avatar size="large">
                                            <Link style={{color: 'white'}} to={`/profile/${item}`}>{item}</Link>
                                        </Avatar>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    )
}
