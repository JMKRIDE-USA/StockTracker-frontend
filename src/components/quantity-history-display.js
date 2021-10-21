import React, { createRef , useEffect, useState } from 'react';

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
import { 
  useGetPart,
  useGetPartsByCategory,
  useGetPartsByCompleteSet,
  useGetHistory,
} from '../modules/inventory.js';
import { QueryLoader } from '../modules/data.js';
import { colorNameToHex, colorNameToTransparentHex } from '../constants.js';
import { destroyChartIfNecessary, registerChart } from '../modules/chart.js';
import { DateSelector } from './selectors.js';

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

function LoadedHistoryDisplayChart({parts, partHistories, chartId, fill = true}){
  if(!Array.isArray(parts)) parts = [parts]
  const minHeight = Math.max(300, Math.min(1000, 40 * parts.length)) // 300 < H < 1000
  const data = {
    datasets: parts.map(part => ({
      label: part.name,
      borderColor: colorNameToHex(part.color === 'White' ? 'Black' : part.color),
      backgroundColor: colorNameToTransparentHex(part.color, 0.2),
      stepped: true,
      fill,
      data: partHistories[part._id].map(
        ({date, quantity}) => ({x: new Date(date), y: quantity})
      ),
    })),
  }
  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
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
        beginAtZero: false,
      }
    },
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
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
      destroyChartIfNecessary(chartId);
      chartRef.current = new Chart(canvasRef.current, config);
      registerChart(chartId, chartRef.current);
    }
  }, [canvasRef.current]); // eslint-disable-line react-hooks/exhaustive-deps


  return <div style={{minHeight}}><canvas ref={canvasRef}/></div>
}

const HistoryDisplayChartDiv = styled.div`
  width: min(90vw, 1300px);
  & > .title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    width: 100%;
    & > h3 {
      flex: 1;
    };
    & > div:first-child {
      display: flex;
      flex: 1;
      flex-direction: row;
      flex-wrap: wrap;
      & > label {
        margin-right: 5px;
      }
      & > * {
        margin-right: 15px;
      }
    }
    & > div:last-child {
      flex: 1;
      width: 300px;
    }
  }
  & > * {
    margin-right: 20px;
  }
`

function HistoryDisplayCard({partsQuery, historyQueryParams, title, ...props}){
  const [startDate, setStartDateState] = useState(
    new Date(Date.now() - 1.21e9) // two weeks
  );
  const [endDate, setEndDateState] = useState(new Date());

  const setStartDate = (date) => {
    if(date > endDate) {
      return setStartDateState(endDate);
    }
    return setStartDateState(date);
  }

  const setEndDate = (date) => {
    if(date > new Date(Date.now())) {
      return setEndDateState(new Date());
    }
    return setEndDateState(date);
  }

  const historyQuery = useGetHistory({
    ...historyQueryParams,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  });
  return (
    <PageCard>
      <HistoryDisplayChartDiv>
        <div className="title-row">
          <div>
            <label htmlFor="startdate">From:</label>
            <DateSelector
              id="startdate"
              state={[startDate, setStartDate]}
            />
            <label htmlFor="enddate">To:</label>
            <DateSelector
              id="enddate"
              state={[endDate, setEndDate]}
            />
          </div>
          <h3>{title}</h3>
          <div/>
        </div>
        <QueryLoader query={historyQuery} propName='partHistories'>
          <QueryLoader query={partsQuery} propName='parts'>
            <LoadedHistoryDisplayChart chartId={title} {...props}/>
          </QueryLoader>
        </QueryLoader>
      </HistoryDisplayChartDiv>
    </PageCard>
  )
}

export function PartHistoryDisplayChart({partId}){
  const partsQuery = useGetPart(partId, { withQuantity: false })
  const historyQueryParams = {
    type: 'part', id: partId
  }
  return <HistoryDisplayCard
    title="Part Quantity History"
    {...{partsQuery, historyQueryParams}}
  />
}

export function CategoryHistoryDisplayChart({categoryId}){
  const partsQuery = useGetPartsByCategory(categoryId, { noQuantity: true })
  const historyQueryParams = {
    type: 'category', id: categoryId
  }
  return <HistoryDisplayCard
    title="Category Quantity History"
    fill={false}
    {...{partsQuery, historyQueryParams}}
  />
}

export function CompleteSetHistoryDisplayChart({completeSetId}){
  const partsQuery = useGetPartsByCompleteSet(completeSetId)
  const historyQueryParams = {
    type: 'completeset', id: completeSetId
  }
  return <HistoryDisplayCard
    title="Complete Set Quantity History"
    fill={false}
    {...{partsQuery, historyQueryParams}}
  />
}
