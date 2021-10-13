import React from 'react';

import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

import { PageCard } from '../components/common.js';
import { useGetPart, useGetHistory } from '../modules/inventory.js';
import { QueryLoader } from '../modules/data.js';

let HistoryDisplayChartDiv = styled.div`
  height: 500px;
  width: 500px;
  backgroundColor: red;
`

function LoadedHistoryDisplayChart({parts, partHistories}){
  console.log({parts, partHistories})
  let datasets = parts.map(part => ({
    label: part.name,
    stepped: true,
    data: partHistories[part._id].map(
      ({date, quantity}) => ({x: new Date(date), y: quantity})
    ),
  }))
  console.log(datasets)

  let options = {
    scales: {
      xAxes: [{
        type: 'time',
      }],
    },
    responsive: true,
    animation: false,
  }

  return (
    <HistoryDisplayChartDiv>
      <Line
        data={datasets}
        options={options}
      />
    </HistoryDisplayChartDiv>
  )
}

const LHDCWrapper = ({part, ...props}) => (
  <LoadedHistoryDisplayChart parts={[part]} {...props}/>
)

export function PartHistoryDisplayChart({partId}){
  const partQuery = useGetPart(partId, { withQuantity: false })
  const historyQuery = useGetHistory({
    type: 'part', id: partId
  })
  return (
    <PageCard>
      <QueryLoader query={historyQuery} propName='partHistories'>
        <QueryLoader query={partQuery} propName='part'>
          <LHDCWrapper/>
        </QueryLoader>
      </QueryLoader>
    </PageCard>
  )
}
