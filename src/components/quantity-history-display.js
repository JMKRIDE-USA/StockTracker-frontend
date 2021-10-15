import React, { createRef , useEffect } from 'react';

import styled from 'styled-components';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

import { PageCard } from '../components/common.js';
import { useGetPart, useGetHistory } from '../modules/inventory.js';
import { QueryLoader } from '../modules/data.js';
import { colorNameToHex, colorNameToTransparentHex } from '../constants.js';
import { destroyChartIfNecessary, registerChart } from '../modules/chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
);

let HistoryDisplayChartDiv = styled.div`
  width: 90vw;
`

function LoadedHistoryDisplayChart({parts, partHistories, chartId}){
  console.log({parts, partHistories})
  const data = {
    datasets: parts.map(part => ({
      label: part.name,
      borderColor: colorNameToHex(part.color),
      backgroundColor: colorNameToTransparentHex(part.color, 0.2),
      stepped: true,
      fill: true,
      data: partHistories[part._id].map(
        ({date, quantity}) => ({x: new Date(date), y: quantity})
      ),
    })),
  }
  console.log(data)

  const options = {
    scales: {
      x: {
        type: 'time',
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Quantity',
        },
      }
    },
    responsive: true,
    animation: false,
  }

  const config = {
    type: 'line',
    data,
    options,
  };
  const canvasRef = createRef(null)
  const chartRef = createRef(null);

  useEffect(() => {
    if (canvasRef.current && !chartRef.current) {
      console.log(canvasRef.current);
      destroyChartIfNecessary(chartId);
      chartRef.current = new Chart(canvasRef.current, config);
      registerChart(chartId, chartRef.current);
    }
  }, [canvasRef.current]);


  return (
    <HistoryDisplayChartDiv>
      <canvas ref={canvasRef}/>
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
          <LHDCWrapper chartId={partId}/>
        </QueryLoader>
      </QueryLoader>
    </PageCard>
  )
}
