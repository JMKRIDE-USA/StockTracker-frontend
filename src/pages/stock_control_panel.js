import React from 'react';

import { CreatePartForm } from '../forms/create_part.js';

export function StockControlPanel(){
  return (
    <div className="MainPage">
      <h1>Control Panel</h1>
      <CreatePartForm/>
    </div>
  );
}
