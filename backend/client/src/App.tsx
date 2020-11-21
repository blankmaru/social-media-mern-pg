import React, { useContext } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'antd/dist/antd.css';
import { Row, Col } from 'antd'

import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { myContext } from './Context';
import Register from './pages/Register';

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
            <Route path='/' exact component={Home}></Route>  
            {
                ctx ? (
                  <>
                    {ctx.isAdmin ? <Route path='/admin' component={Admin}></Route> : null}
                    <Route path='/profile' component={Profile}></Route>  
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
