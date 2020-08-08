import React from 'react';
import { useQuery } from 'react-query';

import CanvasJSReact from "../../external_dependencies/canvasjs.react.js";

import { server_url, api_path } from "../../constants.js";
import { processParts } from "../../modules/data.js";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export function InventoryDisplay({part_type}){

  let parts_fetch_request = "parts/fetch?type=" + part_type + "&active=0"
  let parts = useQuery(
    parts_fetch_request,
    () => fetch(
      server_url + api_path + parts_fetch_request,
      {method: 'GET'}
    ).then(res => res.json())
  );
  if(parts.loading){
    return <h1>Loading {part_type} Parts...</h1>
  }
  if(parts.error){
    return <h1 className="ResultErrorReport">
      Error Loading {part_type} Parts: {parts.error.message}
    </h1>
  }
  let processed_parts;
  if(parts.data){
    processed_parts = processParts(parts.data);
  }

  function addSymbols(e){
    var suffixes = ["", "K", "M", "B"];
    var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
    if(order > suffixes.length - 1){
      order = suffixes.length - 1;
    }
    var suffix = suffixes[order];
    return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
  }

  const options = {
    animationEnabled: true,
    theme: "dark2",
    width: "900",
    title:{
      text: "JMKRIDE " + part_type + " Inventory",
    },
    axisX: {
      title: "Part Name",
      reversed: true,
    },
    axisY: {
      title: "Quantity Available",
      includeZero: true,
      labelFormatter: addSymbols
    },
    data: [{
      type: "bar",
      dataPoints: [
        { y:  2200, label: "Facebook", color: "Red"},
        { y:  1800, label: "YouTube" },
        { y:  800, label: "Instagram" },
        { y:  563, label: "Qzone" },
        { y:  376, label: "Weibo" },
        { y:  336, label: "Twitter" },
        { y:  330, label: "Reddit" }
      ]
    }],
  }

  return (
    <div className="InventoryDisplay">
      <CanvasJSChart options = {options}
      /* onRef={ref => this.chart = ref} */
      />
    {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
    </div>
  );
}
