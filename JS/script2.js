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
            const closingPrices = dates.map(date => timeSeriesData[date]['4. close']).map(parseFloat);

            // Create a chart
            const ctx = document.getElementById('stockChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Closing Prices',
                        data: closingPrices,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day'
                            },
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Closing Price'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
        });
}
