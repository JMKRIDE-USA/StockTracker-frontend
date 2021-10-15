const chartsByCanvasId = {};

export const destroyChartIfNecessary = (canvasId) =>{
  if (chartsByCanvasId[canvasId]) {
    chartsByCanvasId[canvasId].destroy();
  }
}

export const registerChart = (canvasId, chart) =>
  chartsByCanvasId[canvasId] = chart
