const GLOBAL_PATH = '~krivko/sissejuhatus/'; // seadistage vastavalt teie lingile public_html-is

// taustavärvid
const COLORS = {
  book: 'rgba(18, 225, 147, 0.2)',
  movie: 'rgba(40, 40, 40, 0.3)',
  music: 'rgba(65, 105, 225, 0.1)',
  default: '#fafafa',
}

// Fetch element ja sisesta rekursiivselt kõik 'nested' HTML-elemente
function fetchAndProcessHTML(filepath, id = null) {
  return fetch(filepath) // Fetch HTML-faili sisu, töötle promise'na 
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${filepath}: ${response.statusText}`);
      }
      return response.text(); // loe response tekstina
    })
    .then(data => { 
      const tempDiv = document.createElement('div'); // pane response'st saadud HTML ajutisse div-i
      tempDiv.innerHTML = data; 

      const nestedElements = tempDiv.querySelectorAll('[nested-html]'); // kogu kõik pesastatud HTML elemendid
      const fetchPromises = Array.from(nestedElements).map(element => {  // tee kõikidele pesastatud elementidele fetch ja sisesta vastav HTML
        const nestedFilepath = element.getAttribute('nested-html');
        return fetchAndProcessHTML(`contents/${nestedFilepath.substring(1)}`).then(nestedData => { 
          element.innerHTML = nestedData; 
        }).catch(error => {
          console.error(`Error in 'data' processing within nested HTML for ${nestedFilepath}:`, error); // logi viga kui elementi ei eksisteeri
        });
      });

      return Promise.all(fetchPromises).then(() => {
        if (id) {
          document.getElementById(id).innerHTML = tempDiv.innerHTML; // sisesta HTML vastavasse elementi
        }
        return tempDiv.innerHTML; // return kogu HTML koos nested elementidega
      });
    })
    .catch(error => {
      console.error(`Error in 'fetchAndProcessHTML' fetching ${filepath}:`, error);  // logi viga kui fetch ei õnnestu
    });
}

// Laadime sisu vastavalt praegusele URL-ile
function loadContent() {
  console.log(`Full FILE PATH is: ${window.location.pathname}`);
  let cleanedPath = window.location.pathname.replace(GLOBAL_PATH, ''); 
  console.log(`Cleaned path is: ${cleanedPath}`);
  if (cleanedPath === '' || cleanedPath === '/' || cleanedPath === '/index.html') {
    return fetchAndProcessHTML(`contents/index.html`, 'content');
  } else { 
    return fetchAndProcessHTML(`contents${cleanedPath}`, 'content');
  }
}

// Lisa lehe muutmise loogika nuppude klõpsamisel ja käsitle uut URL-i
function addEventListeners() {
  const buttons = document.querySelectorAll('[target-url]'); // Kogu kõik nupud, millel on 'target-url' atribuut
  buttons.forEach(button => {
    const targetUrl = button.getAttribute('target-url'); 
    button.addEventListener('click', (event) => {
      console.log(`Button clicked with target URL: ${targetUrl}`);
      event.preventDefault(); // Prevent the default link behavior

      history.pushState({}, "", window.location.href); // Fake avalehe push ajaloosse, et brauseri "tagasi"/"edasi" nuppe õigesti käsitleda

      console.log(`Navigating to contents/${targetUrl}`); 
      fetchAndProcessHTML(`contents/${targetUrl}`, 'content') // Laeme uus sisu
        .then(() => checkLoadImages())
    });
  });
}

// Täname StackOverflow, et see osa lõpuks töötab :)
// Teeme pildid nähtavaks alles siis, kui need on täielikult laaditud
function checkLoadImages() {
  console.log("checkLoadImages is fired");
  const containers = document.querySelectorAll('.container');
  containers.forEach(container => {
      const images = Array.from(container.querySelectorAll('.image')); 
      const incompleteImages = images.filter(img => !img.complete);
      const imagePromises = incompleteImages.map(img => new Promise(resolve => {
          img.onload = img.onerror = resolve;
      }));

      Promise.all(imagePromises).then(() => {
          console.log('images finished loading');
          console.log(`Total images: ${images.length}`);

          // ja pärast kõige laadimist, konteiner on nähtav
          setTimeout(() => {
              container.style.opacity = '1';
          }, 100); // väike viivitus, et tagada, et üleminekut rakendatakse
      });
  });
}

// Anna footer ja header kuvamiseks viivitus, et need saaksid oma koha võtta.
// Ei tea, ei suutnud paremat lahendust välja mõelda...
function checkLoadElements() {
  const elements = ['#header', '#footer'];
  elements.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) { // igaks juhuks kontrollime, kas element on olemas. vb mõnel lehel seda ei ole
      setTimeout(() => {
        element.style.opacity = '1';
      }, 50); 
    }
  });
}

// Lisa background värvi muutus, kui nupp onhover, ja tagasi default, kui see ei ole
function addHoverEffects() {
  document.body.style.backgroundColor = COLORS.default;
  document.querySelectorAll('.media-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      document.body.style.backgroundColor = COLORS[item.getAttribute('color_code')] || COLORS.default;
    });
    item.addEventListener('mouseleave', () => {
      document.body.style.backgroundColor = COLORS.default;
    });
  });
}

// Näita praegust asukohta navbaris
function updateActiveLink() { 
  let currentPath = window.location.pathname.replace(GLOBAL_PATH, ''); // eemalda globaalne path
  currentPath = (currentPath === '/') ? '/index.html' : currentPath; 
  console.log(`updateActiveLink currentPath is: ${currentPath}`);
  for (let link of document.querySelectorAll('.navigation a')) { // kõik lingid asuvad navigatsioonis, kui klapib praegusega, siis ta on aktiivne
    if (currentPath.endsWith(link.getAttribute('href'))) {
        link.classList.add('active');
        return; 
    }
  }
  console.error(`No matching navigation link found for path: ${currentPath}`);
}

// Lae kõik lehe komponendid
function loadPageComponents() {
    return fetchAndProcessHTML('header.html', 'header')
      .then(() => loadContent())
      .then(() => checkLoadImages())
      .then(() => fetchAndProcessHTML('footer.html', 'footer'))
      .then(() => checkLoadElements())
      .then(() => addEventListeners())
      .then(() => addHoverEffects())
      .then(() => updateActiveLink());
}

// Kui DOM on täielikult laetud uuel lehel
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  loadPageComponents();
});

// Kui kasutaja vajutab tagasi/edasi nuppu ja DOM ei tööta
window.addEventListener('popstate', () => {
  console.log('popstate event fired');
  loadPageComponents();
});