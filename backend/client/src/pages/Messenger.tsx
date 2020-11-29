import React, { useState, useContext, useEffect, SyntheticEvent } from 'react';
import io from 'socket.io-client';
import axios, { AxiosResponse } from 'axios';
import { IMessage, IUser } from '../interfaces/interfaces';
import { Link } from 'react-router-dom';
import queryString from 'query-string'

import { 
    Row, 
    Col, 
    Empty, 
    List,
    Comment,
    Form,
    Input,
    Button, 
    Modal
} from 'antd';
import { myContext } from '../Context';

const apiServer = 'http://localhost:5000';
const socketServer = 'ws://localhost:5000';

let socket: SocketIOClient.Socket;

const Messenger: React.FC = () => {
    const ctx = useContext(myContext);
    const [name, setName] = useState<any>();
    const [room, setRoom] = useState<any>();
    const [message, setMessage] = useState<string>();
    const [messages, setMessages] = useState<Array<IMessage>>([]);
    const [users, setUsers] = useState<Array<IUser>>([]);
    const [open, setOpen] = useState<boolean>(false);

    const [chatTitle, setChatTitle] = useState<string>('')
    const [chatLinkURL, setChatLinkURL] = useState<string>('')
    
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

    const onHandleCancel = () => {
        setOpen(false)
    }

    const createChatRoom = () => {
        if (!chatTitle || !chatLinkURL || chatTitle.length < 2 || chatLinkURL.length < 5) {
            return alert(`Fields is empty or length is not valid!`)
        }
        
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
                        <h2>Chat Rooms: </h2>
                        <Link style={{fontSize: '1.5rem'}} onClick={join} to={`/messenger?name=${ctx.username}&room=Music`}>
                            MUSIC
                        </Link>
                    </div>
				</Col>
				<Col span={16}>
                    <div>
                    <h2>CHAT ROOM: {room} {room 
                    ? (<div>USERS IN CHAT: {users.length} </div>) 
                    : null}</h2>                  
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
                        <Form style={{display: 'flex'}}>
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
                                <Button onClick={e => sendMessage(e)}>
                                    Send
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
