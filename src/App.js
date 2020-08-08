import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';

import './App.css';
import jmklogo from './jmklogo.png';
import { Home } from './pages/home.js';
import { WithdrawPage } from './pages/withdraw.js';
import { DepositPage } from './pages/deposit.js';
import { ControlPanel } from './pages/control_panel.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
          <Navbar.Brand href="/">
            <img
              src={jmklogo}
              className="d-inline-block align-top"
              height="50"
              style={{"paddingLeft":"10px", "paddingRight": "40px"}}
              alt="JMKRIDE logo"
            />
          </Navbar.Brand>
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/withdraw">Withdraw Stock</Nav.Link>
          <Nav.Link href="/deposit">Deposit Stock</Nav.Link>
          <Nav.Link href="/stock-control-panel">Control Panel</Nav.Link>
        </Navbar>
        <Switch>
          <Route path="/withdraw">
            <WithdrawPage  />
          </Route>
          <Route path="/deposit">
            <DepositPage  />
          </Route>
          <Route path="/stock-control-panel">
            <ControlPanel  />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
