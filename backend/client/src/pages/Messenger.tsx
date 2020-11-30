import React, { useState, useContext, useEffect, SyntheticEvent } from 'react';
import io from 'socket.io-client';
import axios, { AxiosResponse } from 'axios';
import { IChat, IMessage, IUser } from '../interfaces/interfaces';
import { Link } from 'react-router-dom';
import queryString from 'query-string'

import { 
    Row, 
    Col, 
    Comment,
    Form,
    Input,
    Button, 
    Modal,
    Spin
} from 'antd';
import { myContext } from '../Context';
import {
    SendOutlined
} from '@ant-design/icons'

const apiServer = 'http://localhost:5000';
const socketServer = 'ws://localhost:5000';

let socket: SocketIOClient.Socket;

const Messenger: React.FC = () => {
    const ctx = useContext(myContext);

    // Chat Room
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [name, setName] = useState<any>();
    const [room, setRoom] = useState<any>();
    const [message, setMessage] = useState<string>();
    const [messages, setMessages] = useState<Array<IMessage>>([]);
    const [users, setUsers] = useState<Array<IUser>>([]);
    const [open, setOpen] = useState<boolean>(false);

    // Chat Modal with Form
    const [chatTitle, setChatTitle] = useState<string>('')
    const [chatLinkURL, setChatLinkURL] = useState<string>('')

    // Displat all chat
    const [chats, setChats] = useState<Array<IChat>>([])

    // Spin loading state
    const [createChatLoading, setCreateChatLoading] = useState<boolean>(false)
    
    useEffect(() => {
        socket = io(socketServer, {
            transportOptions: ['websocket']
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketServer])

	// useEffect(() => {
    //     axios.get(apiServer + '/api/users', { withCredentials: true })
    //         .then((res: AxiosResponse) => {
    //             setUsers(res.data.reverse())
    //             users.filter((item) => item.username !== ctx.username)
	// 	    });
    // }, [users, ctx.username]);

    useEffect(() => {
        const { name, room } = queryString.parse(window.location.search);
    
        setRoom(room);
        setName(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.search]);

    useEffect(() => {
        socket.on('message', (message: IMessage) => {
          setMessages(messages => [ ...messages, message ]);
        });
        
        socket.on("roomData", ({ users }: {users: Array<IUser> }) => {
          setUsers(users);
        });
    }, []);

    const sendMessage = (event: SyntheticEvent) => {
        event.preventDefault();
    
        if(message) {
          socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    const join = (): void => {  
        setTimeout(() => {
            const { name, room } = queryString.parse(window.location.search);
            setRoom(room);
            setName(name);
            setTimeout(() => {
                socket.emit('join', { name, room }, (error: Error) => {
                    if(error) {
                      alert(error);
                    }
                });
            }, 1000)
        }, 1000) 
    }

    useEffect(() => {
        axios.get(apiServer + '/api/chats', { withCredentials: true })
            .then((res: AxiosResponse) => {
                setChats(res.data.reverse())
            })
    }, [])

    const onHandleCancel = () => {
        setOpen(false)
    }

    const createChatRoom = () => {
        if (!chatTitle || !chatLinkURL || chatTitle.length < 2 || chatLinkURL.length < 5) {
            return alert(`Fields is empty or length is not valid!`)
        }
        setCreateChatLoading(true)
        axios.post(apiServer + '/api/chats', {
            title: chatTitle,
            url: chatLinkURL
        }, {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setTimeout(() => {
                setCreateChatLoading(false)
            }, 1000)
        }).catch((err: Error) => {
            return console.log({ error: err })
        })
    }

	return (
		<div>
			<Row>
				<Col span={8}>
                    <Button onClick={() => setOpen(true)}>
                        CREATE CHAT ROOM
                    </Button>
                    <Modal
                        title="CREATE CHAT ROOM"
                        visible={open}
                        onOk={createChatRoom}
                        onCancel={onHandleCancel}
                    >
                        {createChatLoading 
                        ?   <Spin 
                                style={{
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    width: '40%'
                                }} 
                            />
                        : null}
                        <Form>
                            <Form.Item>
                                <p>Chat title</p>
                                <Input 
                                    placeholder="Title (more than 2 characters requirement)"
                                    value={chatTitle}
                                    onChange={(e) => setChatTitle(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <p>Chat Link URL</p>
                                <Input 
                                    placeholder="Link URL (our own, more than 5 characters requirement)"
                                    value={chatLinkURL}
                                    onChange={(e) => setChatLinkURL(e.target.value)}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <div style={{marginTop: '1rem'}}>
                        <h5>Public Chat Rooms: </h5>
                        {chats?.length === undefined
                        ?   <Spin 
                                style={{
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    width: '40%'
                                }} 
                            />
                        : chats?.map((chat) => {
                            return (
                                <div key={chat.id} style={{marginTop: '0.5rem'}}>
                                    <Link style={{fontSize: '1.5rem'}} onClick={join} to={`/messenger?name=${ctx.username}&room=${chat.url}`}>
                                        {chat.title}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
				</Col>
				<Col span={16}>
                    <div>
                    <h5>Chat Room: {room} {room 
                    ? (<div>USERS IN CHAT: {users.length} </div>) 
                    : null}</h5>                  
                    </div>        
                    <div>
                        <div className="infinite-container" style={{ height: '500px', overflowY: 'scroll' }}>
                        {messages.map((message, i) => 
                            <div key={i}>
                                {message.user === ctx.username?.trim().toLowerCase()
                                ?   <Comment
                                        style={{
                                            float: 'right',
                                            marginRight: '1rem',
                                            width: '50%'
                                        }}
                                        author={message.user}
                                        content={message.text}
                                />
                                :   <Comment
                                        avatar={'https://icon-library.com/images/default-profile-icon/default-profile-icon-16.jpg'}
                                        author={message.user}
                                        content={message.text}
                                    />}
                            </div>)}
                        </div>
                    </div>
                    <div>
                        <Form>
                            <Form.Item style={{width: '100%'}}>
                                <Input
                                    className="input"
                                    type="text"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={({ target: { value } }) => setMessage(value)}
                                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button style={{float: 'right'}} onClick={e => sendMessage(e)}>
                                    Send <SendOutlined /> 
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
			</Row>
		</div>
	);
};

export default Messenger;
