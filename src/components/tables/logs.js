import React, { useMemo, useState } from 'react';

import styled from 'styled-components';
import { useSelector } from 'react-redux';
import {
  HiChevronUp,
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi';

import { Table, ExpandableInfoObjectCell, ClickableTextCell } from './table.js';
import { 
  QueryLoader, OptionalCard, ISOToReadableString, selectInventoryId 
} from 'jeffdude-frontend-helpers';
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

export function PageableLogTable({endpoint, pageCard = true, title, defaultPerPage = 15, ...props}) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(defaultPerPage);

  const decrementPage = () => setPage(page - 1);
  const incrementPage = () => setPage(page + 1);
  const inventoryId = useSelector(selectInventoryId);

  const query = useGetLogsEndpoint(
    endpoint + "/inventory/id/" + inventoryId + "?page=" + page + "&perPage=" + perPage,
    {enabled: !!inventoryId, version: "v2"},
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
        <h3>{title}</h3>
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

const genRowData = ({depth}) => data => ({
  name: data.actor?.fullName,
  time: new Date(data.createdAt),
  subject: {
    text: data.subject?.name ? data.subject.name : data.subjectType === 'completeset' ? 'Custom Set' : data.subject?._id,
    link: "/" + data.subjectType + "/" + data.subject?._id
  },
  subjectType: data.subjectType,
  action: data.action,
  quantity: data.quantity,
  inventory: data.inventory?.name,
  payload: data.payload,
})

const formatDisplayLog = log => {
  if(log?.raw) {
    return genRowData({depth: 0})(log.logs[0])
  }
  return {
    ...genRowData({depth: 0})(log),
    subRows: log.logs.map(genRowData({depth: 1})),
  }
}

const ExpandButton = () => (
  <span style={{Width: "10px", Height: "10px"}}>
    <HiChevronUp size={15} color={"black"}/>
  </span>
)
const CollapseButton = () => (
  <span style={{Width: "10px", Height: "10px"}}>
    <HiChevronDown size={15} color={"black"}/>
  </span>
)

/* 
 * LogTable
 *
 * logs - loaded log data
 * raw - true if logs are raw logs, rather than displayLogs
 * subjectName - header name for the subject
 */
function LogTable({logs, raw = false, subjectName = "Subject"}) {
  const formatted_data = logs.map(raw ? genRowData({depth: 0}) : formatDisplayLog);
  const columns = useMemo(() => [
    { id: 'expander', 
      Cell: ({row}) =>
        row.canExpand ? (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <CollapseButton/> : <ExpandButton/>}
          </span>
        ) : null,
    },
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
  ], [subjectName]);
  if(! logs.length) {
    return (
      <div>No Logs Found.</div>
    );
  }
  return (
    <Table columns={columns} data={formatted_data}/>
  )
}
