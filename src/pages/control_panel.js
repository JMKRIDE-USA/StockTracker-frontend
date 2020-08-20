import React from 'react';

import { CreatePartForm } from '../forms/create_part.js';
import { ModifyPartForm } from '../forms/modify_part.js';
import { CreateCompleteSetForm } from '../forms/create_completeset.js';

export function ControlPanel(){
  return (
    <div className="MainPage">
      <h1>Control Panel</h1>
      <CreatePartForm/>
      <ModifyPartForm/>
      <CreateCompleteSetForm/>
    </div>
  );
}
