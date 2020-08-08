import React from 'react';

import { DepositPartForm } from "../forms/deposit_part.js";


export function DepositPage() {
  return (
    <div className="MainPage">
      <h1>Deposit JMKRIDE Stock</h1>
      <DepositPartForm/>
    </div>
  );
}
