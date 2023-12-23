function fetchStockNews(stockSymbol) {
    const apiKey = '04d58f78f0d14b81ab5d4a65748c88ad'; // Replace with your News API key
    const apiUrl = `https://newsapi.org/v2/everything?q=${stockSymbol}&apiKey=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayNews(data.articles);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayNews(articles) {
    const newsContainer = document.getElementById('newsContainer');

    // Clear previous news
    newsContainer.innerHTML = '';

    if (articles && articles.length > 0) {
        articles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.innerHTML = `<strong>${article.title}</strong><br>${article.description}<br><br>`;
            newsContainer.appendChild(articleDiv);
        });
    } else {
        newsContainer.innerHTML = 'No news articles found.';
    }
}

function getStockNews() {
    // Get stock symbol from user input
    const stockSymbolInput = document.getElementById('search').value;

    // Check if the input is not empty
    if (stockSymbolInput.trim() !== '') {
        // Call the function to fetch news for the entered stock symbol
        fetchStockNews(stockSymbolInput);
    } else {
        // Display an error message if the input is empty
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = 'Please enter a valid stock symbol.';
    }
}

// Attach the function to the form submission event
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    getStockNews(); // Call the function to fetch news
});
