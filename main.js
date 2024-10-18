// main.js

// Load an HTML component and insert it into a placeholder
function loadComponent(id, filepath) {
  fetch(filepath) // Fetch the content of the HTML file
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filepath}: ${response.statusText}`);
      }
      return response.text(); // Read the response as text
    })
    .then(data => {
      document.getElementById(id).innerHTML = data; // Insert the HTML
    })
    .catch(error => console.error(error)); // Log any errors
}

// Load the header and footer components when the page loads
window.addEventListener('DOMContentLoaded', () => {
  loadComponent('header', 'header.html');
});
