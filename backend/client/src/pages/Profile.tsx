import React, { useContext, useEffect, useState } from 'react'
import { myContext } from '../Context'
import { Card, Button, List, Avatar  } from 'antd'
import { EditOutlined, HomeOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { IUser } from 'src/interfaces/interfaces';
import Axios, { AxiosResponse } from 'axios';

const { Meta } = Card;

export default function Profile() {
    const ctx = useContext(myContext)
    const urlParams = new URLSearchParams(window.location.search);
	const username = urlParams.get('username');

    const [user, setUser] = useState<IUser>()

    useEffect(() => {

        Axios.get(`http://localhost:5000/api/users/${username}`, {
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
                    src="https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77701178114-1200x675.jpg"
                    width="100%"
                    height="250px"
                    style={{borderRadius: '1rem'}}
                    alt="wallpaper"
                />
                <div style={{marginTop: '1rem', display: 'flex',}}>
                    <Card
                        style={{ width: '33%', borderRadius: '1rem' }}
                        cover={<img alt="example" src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/06/boruto-tying-headband-Cropped.jpg?q=50&fit=crop&w=960&h=500" />}
                    >
                        <Meta title={user?.username } description={user?.email } />
                        {ctx.username === user?.username 
                        ? <Button style={{marginTop: '1rem'}}><EditOutlined /> EDIT</Button>
                        : <Button style={{marginTop: '1rem'}}><UserOutlined />FOLLOW</Button>}
                    </Card>
                    
                    <Card
                        style={{ width: '33%', marginLeft: '1rem', borderRadius: '1rem' }}
                    >
                        <h5 style={{fontWeight: 'bold'}}>About</h5>
                        <div style={{marginTop: '1rem'}}>
                            <Meta title={<p><PhoneOutlined /> + 7 999-999-99</p> } />
                            <Meta title={<p><HomeOutlined /> str. Konoha 9/3</p>} />
                            <Meta title={
                                <React.Fragment>
                                    <h6 style={{fontWeight: 'bold'}}>Bio: </h6>
                                    <p>I like Naruto & Boruto</p>
                                </React.Fragment>
                            } />
                        </div>
                    </Card>

                    <Card
                        style={{ width: '33%', marginLeft: '1rem', borderRadius: '1rem' }}
                    >
                        <Card.Grid hoverable={false} style={{textAlign: 'center', width: '50%'}}><strong>?435</strong> Followers</Card.Grid>
                        <Card.Grid hoverable={false} style={{textAlign: 'center', width: '50%'}}><strong>{ctx.friends?.length}</strong> Following</Card.Grid>
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
