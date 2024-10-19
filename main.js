// Load an HTML component and insert it into a placeholder
function fetchAndInsertHTML(id, filepath, callback) {
  fetch(filepath) // Fetch the content of the HTML file
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filepath}: ${response.statusText}`);
      }
      return response.text(); // Read the response as text
    })
    .then(data => {
      document.getElementById(id).innerHTML = data; // Insert the HTML
      if (callback) callback(); // Call the callback function (addEventListeners() which sets events for buttons
    })
    .catch(error => {
      console.error(error); // Log any errors
      document.getElementById(id).innerHTML = '<p>Error occurred while loading the content.</p>';
    });
}

// Load the header
function loadHeader(callback) {
  fetchAndInsertHTML('header', 'header.html', callback);
}

// Load the content based on the current URL
function loadContent(callback) {
  const path = window.location.pathname; // Extract path from URL
  let filepath;
  if (path === '/') {  
    filepath = 'hometable.html'; // Default content for index
  } else {
    filepath = `contents/${path.substring(1)}`; // Load content based on path from folder
  }
  fetchAndInsertHTML('content', filepath, callback);
}

// Handle new URL 
function navigateTo(url) {
  history.pushState(null, '', url); // Update the URL
  loadContent(addEventListeners); // Load the appropriate content
}

// Add page changing logic on clicks of buttons
function addEventListeners() {
  const buttons = document.querySelectorAll('[data-target-url]'); // Get all buttons with a data-target-url attribute
  buttons.forEach(button => {
    const targetUrl = button.getAttribute('data-target-url'); // Get the target URL from the data-target-url attribute
    button.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent the default link behavior
      navigateTo(targetUrl); // Navigate to the target URL when the button is clicked
    });
  });
}

// Load the header and content when the page loads
window.addEventListener('DOMContentLoaded', () => {
  loadHeader(addEventListeners); // Load header and add event listeners
  loadContent(addEventListeners); // Load "content" based on the URL

  // Invoke loadContent when the back/forward buttons are clicked or history changes
  window.addEventListener('popstate', () => loadContent(addEventListeners));
});