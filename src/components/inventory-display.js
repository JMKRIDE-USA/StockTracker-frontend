import React from 'react';

import { Bar } from 'react-chartjs-2';

import { colorNameToHex } from '../constants.js';
import { useGetPartsByCategory } from '../modules/inventory.js';

// import CanvasJSReact from "../external_dependencies/canvasjs.react.js";
/*
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  let data = partsQuery.data.result.map(part => (
    {label: part.name, y: part.quantity, color: colorNameToHex(part.color)}
  ));
  let options = {
    animationEnabled: true,
    data: [{type: "bar", dataPoints: data}],
  }
  return <CanvasJSChart options={options}/>
  */
  /*
  */
  /*
  useEffect(() => { 
    let ctx = document.getElementById(canvas_id);
    console.log("running");
    let mychart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: allParts.map(part=>part.name),
        datasets: [{
          data: allParts.map(part=>part.quantity),
          backgroundColor: allParts.map(part=>part.color),
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {legend: {display: false}},
        scales: {
          x: {grid: {offset: true}},
          yAxes: [{ticks: {beginAtZero: true}}],
        }
      },
    });
    ReactDOM.render(mychart, document.getElementById(canvas_id));
  });
  */

export function CategoryDisplay({categoryId}) {
  const partsQuery = useGetPartsByCategory(categoryId);
  if (![partsQuery].every((query) => query.status === 'success')) {
    return (
      <div> Parts loading... </div>
    )
  }
  if(!Object.hasOwnProperty.call(partsQuery.data, 'result')) {
    return (
      <div>
        <h3 className="error-text">Error loading parts!</h3>
        { JSON.stringify(partsQuery.data) }
      </div>
    );
  } else if (partsQuery.data.result.length <= 0) {
    return (
      <div>
        <div>No Parts Found...</div>
      </div>
    )
  }
  //console.log(partsQuery.data);
  const allParts = partsQuery.data.result;
  return (
    <div className="bar-chart">
      <Bar
        data={{
          labels: allParts.map(part => part.name),
          datasets: [{
            data: allParts.map(part => part.quantity),
            backgroundColor: allParts.map(part => part.color),
            borderColor: allParts.map(() => '#000000'),
            borderWidth: 1,
            borderRadius: 1,
            barThickness: 'flex',
            maxBarThickness: 50,
            barPercentage: 0.95,
            categoryPercentage: 1,
          }]
        }}
        options={{
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: true,
          plugins: {legend: {display: false}},
          scales: {
            x: {grid: {offset: true}},
            yAxes: [{ticks: {beginAtZero: true}}],
          }
        }}
      />
    </div>
  );
}
