import React from 'react';

import { WithdrawPartForm } from "../forms/withdraw_part.js";


export function WithdrawPage() {
  return (
    <div className="MainPage">
      <h1>Withdraw JMKRIDE Stock</h1>
      <WithdrawPartForm/>
    </div>
  );
}
