import React from 'react';

import { Table } from './table.js';
import { ISOToReadableString } from '../../modules/date.js';


export function LogTable({logs}) {
  if(! logs.length) {
    return (
      <div>No Logs Found.</div>
    );
  }
  const formatted_data = logs.map(log => {
    switch(log.action) {
      case "UPDATE_QUANTITY":
        return {
          'name': log.actor.fullName,
          'time': ISOToReadableString(log.createdAt),
          'part': log.subject.name,
          'quantity': log.payload.quantity,
        }
      default:
        return {
          'name': log.actor.fullName,
          'time': ISOToReadableString(log.createdAt),
          'part': log.subject.name,
          'payload': JSON.stringify(log.payload),
        }
    }
  });
  const columns = [{
    Header: 'a',
    columns: [
      { Header: 'Time', accessor: 'time', sortInverted: true },
      { Header: 'Actor', accessor: 'name' },
      { Header: 'Part', accessor: 'part' },
      { Header: 'Quantity', accessor: 'quantity'},
      { Header: 'Payload', accessor: 'payload', disableSortBy: true},
    ]
  }];
  return (
    <Table columns={columns} data={formatted_data}/>
  )
}
