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
        const closingPrices = dates.map(date => parseFloat(timeSeriesData[date]['4. close']));

        // Create a chart using Plotly
        const chartContainer = document.getElementById('stockChart');

        const trace = {
          x: dates,
          y: closingPrices,
          type: 'scatter',
          mode: 'lines',
          line: {
            color: 'rgba(75, 192, 192, 1)',
            width: 2
          }
        };

        const layout = {
          xaxis: {
            title: 'Date'
          },
          yaxis: {
            title: 'Closing Price'
          }
        };

        Plotly.newPlot(chartContainer, [trace], layout);
      })
      .catch(error => {
        console.error('Error fetching stock data:', error);
      });
  }

  fetchStockData();