import React, { useCallback, useState } from 'react';

import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { Bar } from 'react-chartjs-2';

import { PageCard } from '../components/common.js';
import { ReorderButton, EditButton } from '../components/buttons.js';
import { QueryLoader } from '../modules/data.js';
import { colorNameToHex } from '../constants.js';
import { useGetPartsByCategory } from '../modules/inventory.js';
import { PartInfoAndControls } from './parts.js';

export function PartsDisplayChart({parts, setSelectedPart, partOccurance}) {
  const getElementAtEvent = element => {
    if(element.length) {
      setSelectedPart(parts[element[0]?.index]);
    }
  }
  const getDataset = (data, colors, label) => ({
      data,
      backgroundColor: colors,
      borderColor: data.map(() => '#000000'),
      borderWidth: 1,
      borderRadius: 1,
      barThickness: 'flex',
      maxBarThickness: 50,
      minBarLength: 10,
      barPercentage: 0.95,
      categoryPercentage: 1,
      ...(partOccurance ? {label} : {}),
    }
  )
  let datasets = [
    getDataset(
      parts.map(part => part.quantity),
      parts.map(part => colorNameToHex(part.color)),
      "total quantity",
    ),
  ]
  let minQuantity = Math.min(0, ...parts.map(part => part.quantity))
  if(minQuantity < 0){
    minQuantity = Math.min(minQuantity, -15);
  }
  if (partOccurance) {
   datasets.push(getDataset(
      parts.map(part => Math.floor(part.quantity / partOccurance[part._id])),
      parts.map(part => colorNameToHex(part.color)),
      "complete sets",
    ));
  }
  return (
    <div className="bar-chart">
      <Bar
        data={{
          labels: parts.map(part => part.name),
          datasets,
        }}
        options={{
          animation: false,
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {legend: {display: false}},
          scales: {
            x: {grid: {offset: true}, min: minQuantity},
            y: {ticks: {crossAlign: 'far', autoskip: false}},
          }
        }}
        getElementAtEvent={getElementAtEvent}
      />
    </div>
  );
}

const ChartButtons = styled.div`
  flex: 1;
  flex-direction: row;
  margin-left: 2px;
  & > button {
    margin-left: 5px;
    margin-top: 3px;
  }
`
const ChartTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`

const PartsDisplayStyle = styled.div`
  min-width: min(95vw, 1000px);
`

export function PartsDisplay({
  parts, name, height, style, title = true,
  buttonFn = () => <div/>, partInfoAndControlsOptions, 
  initialSelectedPart, ...props
}) {
  const [selectedPart, setSelectedPart] = useState(initialSelectedPart);
  let cardHeight = Math.max((parts.length * (height ? height : 26)), 110) 
  return (
    <PartsDisplayStyle>
      {title &&
        <ChartTitleRow>
          <div style={{flex: 1}}/>
          <h3>{name} Inventory</h3>
          {buttonFn()}
        </ChartTitleRow>
      }
      <div className="chart-div" style={{height: cardHeight.toString() + "px"}}>
        <PartsDisplayChart
          parts={parts}
          setSelectedPart={setSelectedPart}
          {...props}
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
    </PartsDisplayStyle>
  )
}

function CategoryButtons({categoryId, viewButton, editButton}) {
  const history = useHistory();
  const viewCategory = useCallback(
    () => history.push('/category/' + categoryId),
    [history, categoryId]
  )
  const reorderCategory = useCallback(
    () => history.push('/reorder-category/' + categoryId),
    [history, categoryId]
  )
  const editCategory = useCallback(
    () => history.push('/edit-category/' + categoryId),
    [history, categoryId]
  )
  return (
    <ChartButtons>
      { viewButton && <button onClick={viewCategory} className="btn btn-secondary">View</button>}
      { editButton && <ReorderButton onClick={reorderCategory}/>}
      { editButton && <EditButton onClick={editCategory}/>}
    </ChartButtons>
  )
}

export function CategoryDisplayCard(
  {categoryId, categoryName, viewButton = true, editButton = true }
) {
  const partsQuery = useGetPartsByCategory(categoryId);
  return (
    <PageCard>
      <QueryLoader query={partsQuery} propName={"parts"}>
        <PartsDisplay name={categoryName} buttonFn={() => (
          <CategoryButtons {...{categoryId, viewButton, editButton}}/>
        )}/>
      </QueryLoader>
    </PageCard>
  );
}
