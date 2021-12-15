import React from 'react';

import { TitleCard } from 'jeffdude-frontend-helpers';
import { PageableLogTable } from '../components/tables/logs.js';

export default function AllLogsPage() {
  return (
    <div className="page">
      <TitleCard title="All Activity"/>
      <PageableLogTable endpoint="logs/all" defaultPerPage={50}/>
    </div>
  )
}
