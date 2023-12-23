function fetchStockNews(stockSymbol) {
    const apiKey = '04d58f78f0d14b81ab5d4a65748c88ad'; 
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
        articles.forEach((article,index) => {
            // Create elements for each article
            const articleContainer = document.createElement('div');
            articleContainer.classList.add('article-container','has-bottom-border');

            const titleElement = document.createElement('h2');
            titleElement.textContent = article.title;

            const authorElement = document.createElement('p');
            authorElement.textContent = `Author: ${article.author || 'Unknown'}`;

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = article.description;

            const publishedAtElement = document.createElement('p');
            publishedAtElement.textContent = `Published At: ${new Date(article.publishedAt).toLocaleString()}`;

            const contentElement = document.createElement('p');
            contentElement.textContent = article.content;

            const imageElement = document.createElement('img');
            imageElement.src = article.urlToImage;
            imageElement.alt = 'Article Image';
            imageElement.style.width = '25%';
            

            const readMoreLink = document.createElement('a');
            readMoreLink.href = article.url;
            readMoreLink.textContent = 'Read more';

            // Append elements to the article container
            articleContainer.appendChild(titleElement);
            articleContainer.appendChild(authorElement);
            articleContainer.appendChild(descriptionElement);
            articleContainer.appendChild(publishedAtElement);
            articleContainer.appendChild(contentElement);
            articleContainer.appendChild(imageElement);
            articleContainer.appendChild(document.createElement('br'));
            articleContainer.appendChild(readMoreLink);
            
            if (index > 0) {
                newsContainer.appendChild(document.createElement('hr'));
            }

            // Append the article container to the news container
            newsContainer.appendChild(articleContainer);
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
