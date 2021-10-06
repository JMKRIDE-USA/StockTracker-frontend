import React, { useState } from 'react';

import styled from 'styled-components';
import { useTable, useSortBy, useExpanded } from 'react-table';
import {
  HiSortAscending,
  HiSortDescending,
  HiChevronUp,
  HiChevronDown,
} from 'react-icons/hi';

import { InfoListFromObject } from '../lists.js';

export const ClickableTextCell = ({value}) => {
  const { text, link } = value;
  return <a href={link} style={{color: "black"}}>{text}</a>
}

const EIOStyle = styled.div`
  display: flex;
  min-width: 100px;
  max-width: 600px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding-right: 25px;
  & > div {
    overflow-wrap: anywhere;
    word-wrap: break-word;
  }
  & > button {
    border: 0 solid black;
    background-color: transparent;
    position: absolute;
    right: 0;
  }
`
export const ExpandableInfoObjectCell = ({value}) => {
  const [collapsed, setCollapsed] = useState(true);
  if(!value) {
    return <></>
  }
  if(Object.keys(value).length <=1) {
    return <InfoListFromObject data={value}/>
  }
  const firstKey = Object.keys(value)[0];
  const firstValue = JSON.stringify(value[firstKey])
  const displayString = firstValue.length > 30 ? firstValue.slice(0, 30) : JSON.parse(firstValue)
  const collapsedData = {[firstKey]: displayString}
  return (
    <EIOStyle>
      <InfoListFromObject data={collapsed ? collapsedData : value} ellipses={collapsed}/>
      <button onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <HiChevronUp size={15}/> : <HiChevronDown size={15}/>}
      </button>
    </EIOStyle>
  );
}

const Styles = styled.div`
  display: flex;
  max-width: 94vw;
  overflow-x: scroll;
  padding: 1rem;
  table {
    background-color: white;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`
export function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    allColumns,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy, useExpanded);
  return (
    <Styles>
      <table
        {...getTableProps()} style={{minWidth: allColumns.length * 160 + "px"}}
      >
        <thead>
          <tr>
            {allColumns.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                {column.isSorted
                  ? (column.isSortedDesc
                    ? <HiSortDescending size={15}/>
                    : <HiSortAscending size={15}/>
                  ) : <div/> 
                }
              </th>
            ))}
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                style={{ backgroundColor: 
                  row.depth > 0
                  ? "#bababa"
                  : i%2 
                  ? "#eeeeee" 
                  : "white"
                }}
              >
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </Styles>
  )
}
