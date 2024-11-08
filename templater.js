const GLOBAL_PATH = '~krivko/sissejuhatus/'; // set according to constant URL

// Fetch the element and recursively process nested HTML elements
function fetchAndProcessHTML(filepath) {
  return fetch(filepath) // Fetch the content of the HTML file, process as promise
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filepath}: ${response.statusText}`);
      }
      return response.text(); // Read the response as text
    })
    .then(data => { 
      const tempDiv = document.createElement('div'); // put the HTML from response into a temporary div
      tempDiv.innerHTML = data; 

      const nestedElements = tempDiv.querySelectorAll('[nested-html]'); 
      const fetchPromises = Array.from(nestedElements).map(element => { 
        const nestedFilepath = element.getAttribute('nested-html');
        return fetchAndProcessHTML(`contents/${nestedFilepath.substring(1)}`).then(nestedData => { 
          element.innerHTML = nestedData; 
        }).catch(error => {
          console.error(`Error in 'data' processing within nested HTML for ${nestedFilepath}:`, error);
        });
      });

      return Promise.all(fetchPromises).then(() => {
        //addEventListeners(); // Add button behaviour 
        return tempDiv.innerHTML; // Return the processed HTML
      });
    })
    .catch(error => {
      console.error(`Error in 'fetchAndProcessHTML' fetching ${filepath}:`, error);
    });
}

/* Okay so this is not needed anymore actually. keep just in case, remove later
function loadNested() {
  const nestedElements = document.querySelectorAll('[nested-html]');
  const fetchPromises = Array.from(nestedElements).map(element => {
    const nestedFilepath = element.getAttribute('nested-html');
    console.log(`Nested filepath is: ${nestedFilepath}`);
    const filepath = `contents/${nestedFilepath.substring(1)}`;
    return fetchAndProcessHTML(filepath).then(data => {
      element.innerHTML = data; // Finally insert the nested HTML into the element
    });
  });
  return Promise.all(fetchPromises);
}
*/

// Load an HTML component and insert it into a placeholder
function fetchAndInsertHTML(id, filepath, callback = null) {
  return fetchAndProcessHTML(filepath)
    .then(data => {
      document.getElementById(id).innerHTML = data; // Insert the processed HTML
    /*
      if (callback) callback(); // Call the addEventListener for buttons if provided
    })
    .catch(error => {
      console.error(`Error in 'fetchAndInsertHTML' fetching ${filepath}:`, error);
    });
    */
    });
}

// Load the content based on the current URL
function loadContent(callback) {
  let cleanedPath = window.location.pathname.replace(GLOBAL_PATH, ''); // Extract only the needed part from URL
  console.log(`CURRENT FILE PATH IS: ${window.location.pathname}`);
  console.log(`Cleaned path is: ${cleanedPath}`);
  if (cleanedPath === '' || cleanedPath === '/' || cleanedPath === '/index.html') {
    return fetchAndInsertHTML('content', 'contents/index.html', callback);
  }
  else { 
    return fetchAndInsertHTML('content', `contents/${cleanedPath}`, callback);
  }
}

// Handle new URL 
function navigateTo(url) { 
  console.log(`Navigating to ${url}`);
  fetchAndInsertHTML('content', url, addEventListeners)
    .then(() => checkLoadImages()); // ensure images are checked after content is loaded
}

// Add page changing logic on clicks of buttons
function addEventListeners() {
  const buttons = document.querySelectorAll('[target-url]'); //used to be buttons, but can be assigned to any element
  buttons.forEach(button => {
    const targetUrl = button.getAttribute('target-url'); 
    button.addEventListener('click', (event) => {
      console.log(`Button clicked with target URL: ${targetUrl}`);
      event.preventDefault(); // Prevent the default link behavior
      console.log(`PUSHED TO HISTORY: ${window.location.href}`);
      history.pushState({}, "", window.location.href);
      navigateTo(`contents/${targetUrl}`); // Navigate to the target URL when the button is clicked
    });
  });
}

// thank StackOverflow for making this possible
function checkLoadImages() {
  console.log("checkLoadImages is fired");
  const containers = document.querySelectorAll('.container');
  containers.forEach(container => {
      const images = Array.from(container.querySelectorAll('.image')); // Select all images within the container
      const incompleteImages = images.filter(img => !img.complete);
      const imagePromises = incompleteImages.map(img => new Promise(resolve => {
          img.onload = img.onerror = resolve;
      }));

      Promise.all(imagePromises).then(() => {
          console.log('images finished loading');
          console.log(`Total images: ${images.length}`);

          // and after evrything is loaded, show the container
          setTimeout(() => {
              container.style.opacity = '1';
          }, 50); // small delay to ensure transition is applied
      });
  });
}

// give delay for header and footer to take their place before showing them. 
// idk, could not figure out better sollution... 
function checkLoadElements() {
  const elements = ['#header', '#footer'];
  elements.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      setTimeout(() => {
        element.style.opacity = '1';
      }, 50); // small delay to ensure transition is applied
    }
  });
}


// page loader
function loadPageComponents() {
  return fetchAndInsertHTML('header', 'header.html')
    .then(() => loadContent())
    .then(() => fetchAndInsertHTML('footer', 'footer.html'))
    //.then(() => loadNested())
    .then(() => checkLoadImages())
    .then(() => checkLoadElements())
    .then(() => addEventListeners());
}

// on new page load 
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  loadPageComponents();
});

// on back/forward button click
window.addEventListener('popstate', () => {
  console.log('popstate event fired');
  loadPageComponents();
});