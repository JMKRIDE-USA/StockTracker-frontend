import React, { useCallback } from 'react';

import { useHistory } from 'react-router-dom';

import { Table } from './table.js';
import { ISOToReadableString } from '../../modules/date.js';

function ViewButton({id}) {
  const history = useHistory();
  const viewPart = useCallback(
    () => history.push('/part/' + id),
    [history, id]
  );
  return <button className="btn btn-secondary" onClick={viewPart}>View</button>
}

export function PartTable({parts}) {
  if (! parts.length) {
    return <div>No Parts Found.</div>
  }
  const formatted_data = parts.map(part => ({
    id: part._id,
    name: part.name,
    created: new Date(part.createdAt),
    updated: new Date(part.updatedAt),
    quantity: part.quantity,
    categories: ('[' 
      + part.categories.map((c, index) => (index > 0 ? ', ' : '') + c.category?.name).join('')
      + ']'
    ),
  }))
  const columns = [
    { Header: '', accessor: 'id',
      Cell: ({value}) => <ViewButton id={value}/>,
    },
    {Header: 'Name', accessor: 'name'},
    {Header: 'Created At', accessor: 'created',
      sortInverted: true, sortType: 'datetime',
      Cell: ({value}) => ISOToReadableString(value),
    },
    {Header: 'Updated At', accessor: 'updated',
      sortInverted: true, sortType: 'datetime',
      Cell: ({value}) => ISOToReadableString(value),
    },
    { Header: 'Quantity', accessor: 'quantity', sortType: 'basic'},
    { Header: 'Categories', accessor: 'categories'},
  ];
  return (
    <Table columns={columns} data={formatted_data}/>
  );
}
