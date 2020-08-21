import React from 'react';

import { CreatePartForm } from '../forms/create_part.js';
import { ModifyPartForm } from '../forms/modify_part.js';
import { CreateCompletesetForm } from '../forms/create_completeset.js';
import { ModifyCompletesetForm } from '../forms/modify_completeset.js';

export function ControlPanel(){
  return (
    <div className="MainPage">
      <h1>Control Panel</h1>
      <CreatePartForm/>
      <ModifyPartForm/>
      <CreateCompletesetForm/>
      <ModifyCompletesetForm/>
    </div>
  );
}
