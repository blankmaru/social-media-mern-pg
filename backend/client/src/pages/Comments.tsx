import React from 'react';
import { Comment, Avatar, Form, Button, Input, Row, Col, Tooltip } from 'antd';
import moment from 'moment';

const Comments = () => {
	return (
		<Row>
			<Col span={12}>
				<Comment
					author={<strong>Han Solo</strong>}
					avatar={
						<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="Han Solo" />
					}
					content={
						<p>
							We supply a series of design principles, practical patterns and high quality design
							resources (Sketch and Axure), to help people create their product prototypes beautifully and
							efficiently.
						</p>
					}
					datetime={
						<Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
							<span>{moment().fromNow()}</span>
						</Tooltip>
					}
				/>
			</Col>
			<Col span={12}>
				<h5>Leave a comment</h5>
				<Comment
					content={
						<>
							<Form.Item>
								<Input.TextArea rows={4} />
							</Form.Item>
							<Form.Item>
								<Button htmlType="submit" type="primary">
									POST COMMENT
								</Button>
							</Form.Item>
						</>
					}
				/>
			</Col>
		</Row>
	);
};

export default Comments;
