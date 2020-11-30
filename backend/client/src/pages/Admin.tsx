import Axios, { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { 
    Button, 
    List,
    Row,
    Col 
} from 'antd'
import { 
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons'
import { myContext } from '../Context'
import { IReport, IUser } from '../interfaces/interfaces'

export default function Admin() {
    const ctx = useContext(myContext)
    const [users, setUsers] = useState<Array<IUser>>()
    const [reports, setReports] = useState<Array<IReport>>()

    useEffect(() => {
        Axios.get('http://localhost:5000/api/users', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setUsers(res.data)
        })
        Axios.get('http://localhost:5000/api/reports', {
            withCredentials: true
        }).then((res: AxiosResponse) => {
            setReports(res.data)
        })
    }, [])

    const deleteUser = (userId: string) => {
        Axios.post(`http://localhost:5000/api/users/${userId}`, {
            id: userId
        }, {
            withCredentials: true
        })
    }

    return (
        <div>
            <Row>
                <Col span={12}>
                    <h5>Users: </h5>
                    <List
                        itemLayout="horizontal"
                        dataSource={users}
                        renderItem={(item: IUser) => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    title={<strong>{item.username}</strong>}
                                />
                                {ctx.username === item.username ? null : <Button onClick={() => deleteUser(item.id)}><DeleteOutlined /></Button>}
                            </List.Item>
                        )}
                    />
                </Col>
                <Col style={{marginLeft: '1rem'}} span={11}>
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
                                    marginTop: '1rem'
                                }}
                            >
                                <List.Item.Meta
                                    title={<strong>Reason: {item.info.message}</strong>}
                                    description={<p>Post id: {item.info.postId}</p>}
                                />
                                <Button style={{borderColor: 'green'}}><EditOutlined style={{color: 'green'}} /></Button>
                                <Button style={{borderColor: 'red', marginLeft: '1rem'}}><DeleteOutlined style={{color: 'red'}} /></Button>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    )
}
