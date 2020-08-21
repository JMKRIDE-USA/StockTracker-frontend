import React from 'react';

import jmklogo from '../jmklogo.png';
import { WithdrawPartForm } from "../forms/withdraw_part.js";
import { WithdrawCompletesetForm } from "../forms/withdraw_completeset.js";


export function WithdrawPage() {
  return (
    <div className="MainPage">
      <img src={jmklogo} className="JMKRIDE-logo" alt="JMKRIDE-logo" />
      <h1>Withdraw JMKRIDE Stock</h1>
      <WithdrawPartForm/>
      <WithdrawCompletesetForm/>
    </div>
  );
}
