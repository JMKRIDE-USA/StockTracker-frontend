import React, { useCallback, useState } from 'react';

import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { Bar } from 'react-chartjs-2';
import { HiMenuAlt1, HiMenuAlt3 } from 'react-icons/hi';

import { QueryLoader } from '../modules/data.js';
import { colorNameToHex } from '../constants.js';
import { useGetPartsByCategory } from '../modules/inventory.js';
import { PartInfoAndControls } from './parts.js';

export function PartsDisplay({parts, setSelectedPart}) {
  const getElementAtEvent = element => {
    if(element.length) {
      setSelectedPart(parts[element[0]?.index]);
    }
  }
  return (
    <div className="bar-chart">
      <Bar
        data={{
          labels: parts.map(part => part.name),
          datasets: [{
            data: parts.map(part => part.quantity),
            backgroundColor: parts.map(
                part => colorNameToHex(part.color)
            ),
            borderColor: parts.map(() => '#000000'),
            borderWidth: 1,
            borderRadius: 1,
            barThickness: 'flex',
            maxBarThickness: 50,
            barPercentage: 0.95,
            categoryPercentage: 1,
          }]
        }}
        options={{
          animation: false,
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {legend: {display: false}},
          scales: {
            x: {grid: {offset: true}},
            yAxes: [{ticks: {beginAtZero: true}}],
          }
        }}
        getElementAtEvent={getElementAtEvent}
      />
    </div>
  );
}

const ChartButtons = styled.div`
  margin-left: 2px;
  & > button:last-child {
    margin-left: 8px;
    margin-right: 8px;
  }
`
const ChartCard = styled.div`
  background-color: white;
  justify-content: center;
  margin: 20px;
  padding-top: 5px;
  border-radius: 10px;
  border-style: solid;
  border-width: 3px;
  border-color: black;
  width: 95vw;
  max-width: 1000px;
`
const ChartTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export function PartsDisplayCard(
  {parts, name, height, buttonFn = () => <div/>, partInfoAndControlsOptions}
) {
  const [selectedPart, setSelectedPart] = useState();
  height = height ? height : Math.max((parts.length * 35), 50) 
  return (
    <ChartCard>
      <ChartTitleRow>
        <div/>
        <h3>{name} Inventory</h3>
        {buttonFn()}
      </ChartTitleRow>
      <div className="chart-div" style={{height: height.toString() + "px"}}>
        <PartsDisplay
          parts={parts}
          setSelectedPart={setSelectedPart}
        />
      </div>
      { selectedPart 
        ? <PartInfoAndControls
            partId={selectedPart._id}
            onClose={() => setSelectedPart()}
            {...partInfoAndControlsOptions}
          /> 
        : <div/> 
      }
    </ChartCard>
  )
}

function CategoryButtons({categoryId, viewButton, editButton}) {
  const history = useHistory();
  const viewCategory = useCallback(
    () => history.push('/category/' + categoryId),
    [history, categoryId]
  )
  const editCategory = useCallback(
    () => history.push('/category/edit/' + categoryId),
    [history, categoryId]
  )
  return (
    <ChartButtons>
      { viewButton ?
        <button onClick={viewCategory} className="btn btn-secondary">View</button>
        : ''
      }
      { editButton ?
        <button onClick={editCategory} className="btn btn-secondary">
          <HiMenuAlt1 size={15}/>
          <HiMenuAlt3 size={15}/>
        </button>
        : ''
      }
    </ChartButtons>
  )
}

export function CategoryDisplayCard(
  {categoryId, categoryName, viewButton = true, editButton = true }
) {
  const partsQuery = useGetPartsByCategory(categoryId);
  return (
    <QueryLoader query={partsQuery} propName={"parts"}>
      <PartsDisplayCard name={categoryName} buttonFn={() => (
        <CategoryButtons {...{categoryId, viewButton, editButton}}/>
      )}/>
    </QueryLoader>
  );
}
