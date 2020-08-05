import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import { Provider } from 'react-redux';

import './App.css';
import jmklogo from './jmklogo.png';
import store from './redux/store.js';
import { Home } from './Home.js';
import { WithdrawForm } from './stock/forms/withdraw.js';
import { DepositForm } from './stock/forms/deposit.js';
import { StockControlPanel } from './stock/stock_control_panel.js';

function App() {
  return (
    <Provider store={store}>
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
              <WithdrawForm  />
            </Route>
            <Route path="/deposit">
              <DepositForm  />
            </Route>
            <Route path="/stock-control-panel">
              <StockControlPanel  />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </Provider>
  );
}


export default App;
