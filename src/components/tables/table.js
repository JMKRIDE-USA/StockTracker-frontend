import React from 'react';

import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';

const Styles = styled.div`
  display: flex;
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
  } = useTable({ columns, data }, useSortBy);
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
                style={{backgroundColor: i%2 ? "#eeeeee" : "white"}}
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
