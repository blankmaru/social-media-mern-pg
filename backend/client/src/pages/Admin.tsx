import Axios, { AxiosResponse } from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, List, Row, Col, Table } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { myContext } from '../Context';
import { IReport, IUser } from '../interfaces/interfaces';
import { serverURL } from '../config'

const { Column } = Table;

export default function Admin() {
	const ctx = useContext(myContext);
	const [users, setUsers] = useState<Array<IUser>>();
    const [reports, setReports] = useState<Array<IReport>>();

	useEffect(() => {
		Axios.get(serverURL + '/api/users', {
			withCredentials: true,
		}).then((res: AxiosResponse) => {
			setUsers(res.data);
		});
		Axios.get(serverURL + '/api/reports', {
			withCredentials: true,
		}).then((res: AxiosResponse) => {
			setReports(res.data);
		});
	}, []);

	const deleteUser = (userId: string) => {
        Axios.delete(serverURL + `/api/users/${userId}`)
            .then((res: AxiosResponse) => {
                window.location.href = "/admin"
            })
	};

	return (
		<div>
			<Row>
				<Col span={12}>
					<h5>Users: </h5>
                    <Table dataSource={users}>
                        <Column title="ID" dataIndex="id" key="id" />
                        <Column title="Username" dataIndex="username" key="username" />
                        <Column title="Email" dataIndex="email" key="email" />
                        <Column
                            title=""
                            key="delete"
                            render={(record: IUser) => (
                                <span>
                                    {ctx.username === record.username ? null : (
                                    <Button onClick={() => deleteUser(record.id)}>
                                        <DeleteOutlined />
                                    </Button>)}
                                </span>
                            )}
                        />
                    </Table>
				</Col>
				<Col style={{ marginLeft: '1rem' }} span={11}>
					<h5>Reports</h5>
					<List
						itemLayout="horizontal"
						dataSource={reports}
						renderItem={(item: IReport) => (
							<List.Item
								key={item.id}
								style={{
									backgroundColor: '#f2f2f2',
									padding: '1rem',
									borderRadius: '1rem',
									marginTop: '1rem',
								}}
							>
								<List.Item.Meta
									title={<strong>Reason: {item.info.message}</strong>}
									description={<p>Post id: {item.info.postId}</p>}
								/>
								<Button style={{ borderColor: 'green' }}>
									<EditOutlined style={{ color: 'green' }} />
								</Button>
								<Button style={{ borderColor: 'red', marginLeft: '1rem' }}>
									<DeleteOutlined style={{ color: 'red' }} />
								</Button>
							</List.Item>
						)}
					/>
				</Col>
			</Row>
		</div>
	);
}
