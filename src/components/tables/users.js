import React, { useCallback } from 'react';

import { useHistory } from 'react-router-dom';

import { ISOToReadableString, QueryLoader, useGetAllUsers  } from 'jeffdude-frontend-helpers';
import { Table } from './table.js';


const ViewUserCell = ({value}) => {
  const history = useHistory()
  const viewUser = useCallback(
    () => history.push('/user/' + value),
    [history, value],
  )
  return <button onClick={viewUser} className="btn btn-secondary">View</button>
}

function LoadedUserTable({users}) {
  const formattedData = users.map(user => ({
    id: user._id,
    name: user.fullName,
    created: new Date(user.createdAt),
  }));
  const columns = [
    { Header: '', accessor: 'id', Cell: ViewUserCell},
    { Header: 'Name', accessor: 'name'},
    { Header: 'Created At', accessor: 'created',
      sortInverted: true, sortType: 'datetime',
      Cell: ({value}) => ISOToReadableString(value),
    },
  ];
  return (
    <Table columns={columns} data={formattedData}/>
  )
}

export function AllUserTable() {
  const query = useGetAllUsers();
  return (
    <QueryLoader query={query} propName="users">
      <LoadedUserTable/>
    </QueryLoader>
  );
}
