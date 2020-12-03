import React, { useContext, useEffect, useState } from 'react';
import { 
	Comment, 
	Form, 
	Button, 
	Input, 
	Row, 
	Col, 
	Tooltip, 
	Empty 
} from 'antd';
import moment from 'moment';
import { IComment } from 'src/interfaces/interfaces';
import { myContext } from 'src/Context';
import io from 'socket.io-client'
import { match } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const socketServer = 'ws://localhost:5000';

let socket: SocketIOClient.Socket;

interface CommentProps {
	location: Location,
	match: match
}

const Comments = (props: CommentProps) => {
	const ctx = useContext(myContext)

	const urlParams = new URLSearchParams(window.location.search);
	const postId = urlParams.get('post');

	const [comments, setComments] = useState<Array<IComment>>([])
	const [content, setContent] = useState<string>('')

	useEffect(() => {
		socket = io(socketServer, {
            transportOptions: ['websocket']
		});

		socket.emit('getComments', { postId })
		
		socket.on('Output comments', (data: any) => {
			setComments(data[0].comments.reverse())
		})
		socket.on('Output send comment', (data: any) => {
			let comment: IComment = {
				author: data.author,
				content: data.content
			}
			setComments([...comments, comment])
		})

	}, [socketServer])

	const sendComment = () => {
		const comment: IComment = {
			author: ctx.username!,
			content: content
		}

		socket.emit('sendComment', { comment, postId })
	}

	return (
		<Row>
			<Col span={12}>
				<div style={{padding: '1rem'}}>
					<h5>Recently comments: </h5>
					{comments.length < 1 
					?	<Empty /> 
					:	comments?.map((comment) => {
						return (
							<div style={{display: 'flex'}}>
								<Comment
									key={uuidv4()}	
									style={{width: '90%'}}
									author={<strong>{comment.author}</strong>}
									content={
										<p>{comment.content}</p>
									}
									datetime={
										<Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
											<span>{moment().fromNow()}</span>
										</Tooltip>
									}
								/>
							</div>)
						})
					}
				</div>
			</Col>
			<Col span={12}>
				<div style={{padding: '1rem'}}>
					{ctx 
					? 
					<>
						<h5>Leave a comment</h5>
						<Comment
							content={
								<>
									<Form.Item>
										<Input.TextArea 
											rows={4} 
											placeholder="Type comment here" 
											value={content}
											onChange={(e) => setContent(e.target.value)}
										/>
									</Form.Item>
									<Form.Item>
										<Button onClick={sendComment} htmlType="submit" type="primary">
											POST COMMENT
										</Button>
									</Form.Item>
								</>
							}
						/>
					</>
					: null}
				</div>
			</Col>
		</Row>
	);
};

export default Comments;
