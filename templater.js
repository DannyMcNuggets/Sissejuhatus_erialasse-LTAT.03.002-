// Recursively fetch and process nested HTML elements

function fetchAndProcessHTML(filepath) {
  return fetch(filepath) // Fetch the content of the HTML file, process as promise
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filepath}: ${response.statusText}`);
      }
      return response.text(); // Read the response as text
    })
    .then(data => {
      const tempDiv = document.createElement('div'); 
      tempDiv.innerHTML = data; 
      const nestedElements = tempDiv.querySelectorAll('[nested-html]');  
      const fetchPromises = Array.from(nestedElements).map(element => { 
        const nestedFilepath = element.getAttribute('nested-html');
        filepath = `contents/${nestedFilepath.substring(1)}`;
        return fetchAndProcessHTML(filepath).then(nestedData => {
          element.innerHTML = nestedData; 
        }).catch(error => {
          console.error(`Error processing nested HTML for ${nestedFullPath}:`, error);
        });
      });

      return Promise.all(fetchPromises).then(() => {
        addEventListeners(); // Add button behaviour 
        return tempDiv.innerHTML; // Return the processed HTML
      });
    })
    .catch(error => {
      console.error(`Error in 'fetchAndProcessHTM' fetching ${filepath}:`, error);
    });
}

// Load an HTML component and insert it into a placeholder
function fetchAndInsertHTML(id, filepath, callback = null) {
  fetchAndProcessHTML(filepath)
    .then(data => {
      document.getElementById(id).innerHTML = data; // Insert the processed HTML
      if (callback) callback(); // Call the addEventListener for buttons if provided
    })
    .catch(error => {
      console.error(`Error in 'fetchAndInsertHTML' fetching ${filepath}:`, error);
    });
}

// Load the content based on the current URL
function loadContent(callback) {
  const filepath = window.location.pathname === '/' ? 'contents/home.html' 
    : `contents/${window.location.pathname.substring(1)}`; // Determine the filepath based on the path
  fetchAndInsertHTML('content', filepath, callback);
}

function loadNested() {
  const nestedElements = document.querySelectorAll('[nested-html]');
  nestedElements.forEach(element => {
    const nestedFilepath = element.getAttribute('nested-html');
    const filepath = `contents/${nestedFilepath.substring(1)}`;
    fetchAndProcessHTML(filepath).then(data => {
      element.innerHTML = data; // Finally insert the nested HTML into the element
    });
  });
}

// Handle new URL 
function navigateTo(url) {
  history.pushState(null, '', url); // Update the URL
  loadContent(addEventListeners); // Load the appropriate content
}

// Add page changing logic on clicks of buttons
function addEventListeners() {
  const buttons = document.querySelectorAll('[target-url]');
  buttons.forEach(button => {
    const targetUrl = button.getAttribute('target-url'); 
    button.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent the default link behavior. For some reason it works better :/
      navigateTo(targetUrl); // Navigate to the target URL when the button is clicked
    });
  });
}

// Load the header and content when the page loads
window.addEventListener('DOMContentLoaded', () => {
  fetchAndInsertHTML('header', 'header.html', addEventListeners) 
  loadContent(addEventListeners); 
  fetchAndInsertHTML('footer', 'footer.html', addEventListeners); 

  loadNested();

  // Invoke loadContent when the back/forward buttons are clicked or history changes as it may change
  window.addEventListener('popstate', () => loadContent(addEventListeners));
});