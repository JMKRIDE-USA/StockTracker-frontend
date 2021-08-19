import React, { useState } from 'react';

import styled from 'styled-components';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

import { Table, ExpandableInfoObjectCell, ClickableTextCell } from './table.js';
import { ISOToReadableString } from '../../modules/date.js';
import { QueryLoader } from '../../modules/data.js';
import { OptionalCard } from '../../components/common.js';
import { useGetLogsEndpoint } from '../../modules/inventory.js';

const HeaderRowStyle = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    & > input {
      max-width: 60px;
      margin-right: 5px;
      margin-left: 5px;
    }
  }
`

export function PageableLogTable({endpoint, pageCard = true, ...props}) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(50);

  const decrementPage = () => setPage(page - 1);
  const incrementPage = () => setPage(page + 1);

  const query = useGetLogsEndpoint(
    endpoint + "?page=" + page + "&perPage=" + perPage,
  )
  return (
    <OptionalCard pageCard={pageCard}>
      <HeaderRowStyle>
        <div>
          <button className="btn btn-secondary" onClick={decrementPage}>
            <HiChevronLeft size={15} color="white"/>
          </button>
          <div style={{marginLeft: 5, marginRight: 5}}>{page}</div>
          <button className="btn btn-secondary" onClick={incrementPage}>
            <HiChevronRight size={15} color="white"/>
          </button>
        </div>
        <div>
          Per Page:
          <input type="Number" value={perPage} onChange={e => setPerPage(e.target.value)}/>
        </div>
      </HeaderRowStyle>
      <QueryLoader query={query} propName="logs">
        <LogTable {...props}/>
      </QueryLoader>
    </OptionalCard>
  )
}

export function LogTable({logs, subjectName = "Subject"}) {
  if(! logs.length) {
    return (
      <div>No Logs Found.</div>
    );
  }
  console.log(logs);
  const formatted_data = logs.map(log => ({
    name: log.actor?.fullName,
    time: new Date(log.createdAt),
    subject: {
      text: log.subject?.name,
      link: "/" + log.subjectType + "/" + log.subject?._id
    },
    subjectType: log.subjectType,
    action: log.action,
    quantity: log.quantity,
    inventory: log.inventory?.name,
    payload: log.payload,
  }));
  const columns = [
    { Header: 'Time', accessor: 'time',
      sortInverted: true, sortType: 'datetime',
      Cell: ({value}) => ISOToReadableString(value)
    },
    { Header: 'User', accessor: 'name' },
    { Header: 'Action', accessor: 'action'},
    { Header: 'Subject Type', accessor: 'subjectType' },
    { Header: subjectName, accessor: 'subject' , Cell: ClickableTextCell},
    { Header: 'Quantity', accessor: 'quantity', sortType: 'basic'},
    { Header: 'Payload', accessor: 'payload',
      disableSortBy: true, Cell: ExpandableInfoObjectCell,
    },
    { Header: 'Inventory', accessor: 'inventory'},
  ];
  return (
    <Table columns={columns} data={formatted_data}/>
  )
}
