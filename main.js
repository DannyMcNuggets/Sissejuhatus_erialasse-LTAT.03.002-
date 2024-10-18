// main.js
// Load an HTML component and insert it into a placeholder
function loadComponent(id, filepath, callback) {
  fetch(filepath) // Fetch the content of the HTML file
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filepath}: ${response.statusText}`);
      }
      return response.text(); // Read the response as text
    })
    .then(data => {
      document.getElementById(id).innerHTML = data; // Insert the HTML
      if (callback) callback(); // Call the callback function if provided
    })
    .catch(error => console.error(error)); // Log any errors
}

// Handle new URL without reload
function navigateTo(url) {
  history.pushState(null, '', url); // Update the URL
  loadContentBasedOnURL(); // Load the appropriate content
}

// Load 'content' based on the current URL
function loadContentBasedOnURL() {
  const path = window.location.pathname;
  if (path === '/book.html') {  // Just one for testing
    loadComponent('content', 'book.html', addEventListeners); 
  } else {
    loadComponent('content', 'hometable.html', addEventListeners); // Default content for index
  }
}

// Add event listeners to dynamically loaded content
function addEventListeners() {
  const buttons = document.querySelectorAll('[data-target-url]');
  buttons.forEach(button => {
    const targetUrl = button.getAttribute('data-target-url');
    button.addEventListener('click', () => {
      navigateTo(targetUrl);
    });
  });
}

// Load the header and footer when the page loads
window.addEventListener('DOMContentLoaded', () => {
  loadComponent('header', 'header.html');
  loadContentBasedOnURL(); // Load "content" based on the URL

  // Related to function navigateTo(url), invoked each time history.pushState fires
  window.addEventListener('popstate', loadContentBasedOnURL);
});