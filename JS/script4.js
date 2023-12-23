let chartType = 'line';

function toggleChart(type) {
  chartType = type;
  fetchStockData();
}

function fetchStockData() {
  const apiKey = 'IAWL1HCPU473RX89'; // Replace with your actual API key
  const stockSymbol = document.getElementById('search').value;

  const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const timeSeriesData = data['Time Series (Daily)'];

      // Extracting data for chart
      const dates = Object.keys(timeSeriesData).reverse(); // Reverse to display recent dates first
      const chartData = (chartType === 'candlestick') ? getCandlestickData(timeSeriesData) : getLineChartData(timeSeriesData);

      // Create a chart using Plotly
      const chartContainer = document.getElementById('stockChart');

      Plotly.newPlot(chartContainer, chartData);
    })
    .catch(error => {
      console.error('Error fetching stock data:', error);
    });
}

function getCandlestickData(timeSeriesData) {
  return [{
    type: 'candlestick',
    x: Object.keys(timeSeriesData).reverse(),
    open: Object.keys(timeSeriesData).map(date => parseFloat(timeSeriesData[date]['1. open'])),
    high: Object.keys(timeSeriesData).map(date => parseFloat(timeSeriesData[date]['2. high'])),
    low: Object.keys(timeSeriesData).map(date => parseFloat(timeSeriesData[date]['3. low'])),
    close: Object.keys(timeSeriesData).map(date => parseFloat(timeSeriesData[date]['4. close'])),
    increasing: { line: { color: 'green' } },
    decreasing: { line: { color: 'red' } }
  }];
}

function getLineChartData(timeSeriesData) {
  return [{
    type: 'scatter',
    mode: 'lines',
    x: Object.keys(timeSeriesData).reverse(),
    y: Object.keys(timeSeriesData).map(date => parseFloat(timeSeriesData[date]['4. close'])),
    line: { color: 'rgba(75, 192, 192, 1)' }
  }];
}

fetchStockData();