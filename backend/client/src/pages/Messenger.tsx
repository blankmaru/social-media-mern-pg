import React, { useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import axios, { AxiosResponse } from 'axios';
import { IUser } from '../interfaces/interfaces';
import { Link } from 'react-router-dom';
import queryString from 'query-string'

import { Row, Col, Empty, List } from 'antd';
import { myContext } from '../Context';

const apiServer = 'http://localhost:5000';
const socketServer = 'ws://localhost:5000';

let socket: SocketIOClient.Socket;

const Messenger: React.FC = () => {
	const ctx = useContext(myContext);
    const [users, setUsers] = useState<Array<IUser>>([]);
    
    useEffect(() => {
        socket = io(socketServer, {
            transportOptions: ['websocket']
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketServer])

	useEffect(() => {
        axios.get(apiServer + '/api/users', { withCredentials: true })
            .then((res: AxiosResponse) => {
                setUsers(res.data.reverse())
                users.filter((item) => item.username !== ctx.username)
		    });
    }, [users, ctx.username]);

    const join = (): void => {
        const { name, room } = queryString.parse(window.location.search);
        socket.emit('join', { name, room }, (error: Error) => {
            if(error) {
              alert(error);
            }
        });
    }

	return (
		<div>
			<Row>
				<Col span={12}>
					<h2>Chatting:</h2>
					{users?.length === undefined ? (
						<Empty style={{ width: '75%', marginTop: '1rem' }} />
					) : (
						<List
							itemLayout="horizontal"
							dataSource={users}
							renderItem={(item) => (
								<List.Item>
									<List.Item.Meta
										title={
											<Link onClick={join} to={`/messenger?name=${ctx.username}&room=Music`}>
												{item.username}
											</Link>
										}
										description={item.email}
									/>
								</List.Item>
							)}
						/>
					)}
				</Col>
				<Col span={12}></Col>
			</Row>
		</div>
	);
};

export default Messenger;
