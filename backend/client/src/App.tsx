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
import Notifications from './pages/Notifications';
import Messenger from './pages/Messenger';

function App() {
  const ctx = useContext(myContext)

  return (
    <BrowserRouter>
        <Row>
          <Col span={4}>
            <Navbar />
          </Col>
          <Col span={18} style={{padding: '1rem'}}>
          <Switch>
            <Route path='/' exact component={News}></Route>  
            {
                ctx ? (
                  <>
                    {ctx.isAdmin ? <Route path='/admin' component={Admin}></Route> : <Route path='/admin' component={Admin}></Route>}
                    <Route path='/profile' component={Profile}></Route>
                    <Route path='/messenger' component={Messenger}></Route> 
                    <Route path='/friends' component={Friends}></Route> 
                    <Route path='/notifications' component={Notifications}></Route> 
                    <Route path='/settings' component={Settings}></Route>   
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
    </BrowserRouter>
  );
}

export default App;
