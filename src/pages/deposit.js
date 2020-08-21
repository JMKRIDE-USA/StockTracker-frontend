import React from 'react';

import jmklogo from '../jmklogo.png';
import { DepositPartForm } from "../forms/deposit_part.js";


export function DepositPage() {
  return (
    <div className="MainPage">
      <img src={jmklogo} className="JMKRIDE-logo" alt="JMKRIDE-logo" />
      <h1>Deposit JMKRIDE Stock</h1>
      <DepositPartForm/>
    </div>
  );
}
