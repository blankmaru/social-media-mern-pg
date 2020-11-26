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
    Button 
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

	return (
		<div>
			<Row>
				<Col span={6}>
					<h2>Chatting:</h2>
					<Link onClick={join} to={`/messenger?name=${ctx.username}&room=Music`}>
					    MUSIC
					</Link>
				</Col>
				<Col span={18}>
                    <div>
                        <p>CHAT INFO: {room}</p> 
                        <p>CURRENT USER: {name}</p>                    
                    </div>        
                    <div>
                        <div className="infinite-container" style={{ height: '500px', overflowY: 'scroll' }}>
                        {messages.map((message, i) => 
                            <div key={i}>
                                <Comment
                                    author={message.user}
                                    content={message.text}
                                />
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
