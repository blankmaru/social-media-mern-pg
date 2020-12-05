import React, { useContext } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'antd/dist/antd.css';
import { Row, Col } from 'antd'

import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import News from './pages/News/News';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { myContext } from './Context';
import Register from './pages/Register';
import Friends from './pages/Friends';
import Settings from './pages/Settings';
import Messenger from './pages/Messenger';
import Comments from './pages/Comments';
import { Footer } from 'antd/lib/layout/layout';
import { GithubOutlined } from '@ant-design/icons';

function App() {
  const ctx = useContext(myContext)

  return (
    <BrowserRouter>
        <Row style={{display: 'flex', minHeight: '100vh'}}>
          <Col span={4}>
            <Navbar />
          </Col>
          <Col span={18} style={{padding: '1rem', flex: 1}}>
          <Switch>
            <Route path='/' exact component={News}></Route>  
            {
                ctx ? (
                  <>
                    {ctx.isAdmin ? <Route path='/admin' component={Admin}></Route> : <Route path='/admin' component={Admin}></Route>}
                    <Route path='/profile' component={Profile}></Route>
                    <Route path='/messenger' component={Messenger}></Route> 
                    <Route path='/friends' component={Friends}></Route> 
                    <Route path='/settings' component={Settings}></Route> 
                    <Route path='/comments' component={Comments}></Route>   
                  </>
                ) : (
                  <>
                    <Route path='/login' component={Login}></Route>  
                    <Route path='/register' component={Register}></Route>  
                  </>  
                )
            }
        </Switch>
          </Col>
        </Row>
        <Footer 
          style={{
            backgroundColor: '#081830', 
            display: 'flex',
            
          }}>
          <h6 style={{color: '#e4e9f0'}}>Beta Test - v1.0</h6>
          <a href="https://github.com/blankmaru" style={{color: '#e4e9f0', marginLeft: '1rem'}}><GithubOutlined /> Author Github</a>
        </Footer>
    </BrowserRouter>
  );
}

export default App;
