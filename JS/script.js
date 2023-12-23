// Function to construct API URL
function constructApiUrl(apiFunction, stockSymbol, apiKey) {
    return `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${stockSymbol}&apikey=${apiKey}`;
}

// Function to create the chart
function createChart(stockName, dates, closingPrices, timeUnit) {
    // Update chart heading
    const chartHeading = document.getElementById('chart-heading');
    chartHeading.textContent = `${stockName} - Closing Prices`;

    // Create a chart
    const ctx = document.getElementById('stockChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${stockName} - Closing Prices`,
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
                        unit: timeUnit
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    adapters: {
                        date: {
                            locale: enUS
                        }
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
}

// Function to process API response and handle errors
function processApiResponse(data, timeUnit) {
    try {
        console.log('API Response:', data);

        if (data && data['Meta Data']) {
            const stockName = data['Meta Data']['2. Symbol'];

            // Check for available time series data based on the specified time unit
            const timeSeriesKey = `Time Series (${timeUnit})`;
            if (data[timeSeriesKey]) {
                const timeSeriesData = data[timeSeriesKey];

                // Extracting data for chart
                const dates = Object.keys(timeSeriesData).reverse(); // Reverse to display recent dates first
                const closingPrices = dates.map(date => timeSeriesData[date]['4. close']).map(parseFloat);

                // Create a chart
                createChart(stockName, dates, closingPrices, timeUnit);
            } else {
                // Handle the case where time series data is not found for the specified time unit
                console.warn(`Time series data not found for ${timeUnit} in the API response. Data structure:`, data);
            }
        } else {
            console.error('Invalid or missing Meta Data in the API response. Data structure:', data);
        }
    } catch (error) {
        console.error('Error processing API response:', error);
    }
}



// Main function to fetch stock data
function fetchStockData(interval) {
    console.log('Interval:', interval);
    const apiKey = 'IAWL1HCPU473RX89'; // Replace with your actual API key
    const stockSymbol = document.getElementById('search').value;

    let apiFunction;
    let timeUnit;

    switch (interval) {
        case 'daily':
            apiFunction = 'TIME_SERIES_DAILY';
            timeUnit = 'day';
            break;
        case 'monthly':
            apiFunction = 'TIME_SERIES_MONTHLY';
            timeUnit = 'month';
            break;
        case 'yearly':
            apiFunction = 'TIME_SERIES_YEARLY';
            timeUnit = 'year';
            break;
        case 'hourly':
            apiFunction = 'TIME_SERIES_INTRADAY';
            timeUnit = 'hour';
            break;
        default:
            console.error('Invalid interval:', interval);
            return;
    }

    const apiUrl = constructApiUrl(apiFunction, stockSymbol, apiKey);
    console.log('API URL:', apiUrl);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => processApiResponse(data, timeUnit))
        .catch(error => {
            console.error('Error fetching or processing stock data:', error);
        });
}
