# Sissejuhatus_erialasse-LTAT.03.002-
Veebilehe rühmatöö

## Kuidas testida
1. `Live Server` laiendus Visual Studio Code jaoks
2. Mine aadressile https://kodu.ut.ee/~krivko/sissejuhatus/index.html

## Projekti struktuur

### `index.html`
Projekti põhi HTML-fail.

### `about.html` ja `contacts.html`
Lisa HTML-lehed

### `styles.css`
CSS stiilid.

### `templater.js`
JavaScript-fail võimaldab sisu dünaamiliselt laadida ja rakendab mõned visuaalsed effektid.

Vastavalt templater-struktuurile peab igal uuel HTML-lehel `<body>`-tagis olema kolm elementi ID-dega: `header`, `content`, `footer`.

Näide:
```html
<body>
    <div id="header"></div> <!-- Placeholder for Header -->
    <div id="content"></div> <!-- Placeholder for Content --> 
    <div id="footer"></div> <!-- Placeholder for Footer -->
</body>
```

`templater.js` võimaldab ka ühe HTML-elemendi sisestamist teise ja nende dünaamilist laadimist. Sellise elemendi nimetatakse `"nested-html"` elemendiks. Näidis:
`index.html` `#content` osas on `hometable.html` `nested` element, mis tähendab, et see sisestatakse `index.html` sisse. Seda saab kasutada ka mujal. Soovi korral saab muu elemendi `hometable.html` sisse panna, ehk `nested` võib sisaldada muud `nested` elementi.

### `contents/`
Kataloog, mis sisaldab kõiki `#content` elemente.

Näiteks, terve `#content` element, mis kuvatakse lehel /about.html, asub failis `contents/about.html`.

Kui mingi HTML-element ei ole seotud URL-iga või lehe nimega, siis ikka asub vastav fail selles kataloogis. Näiteks:
`index.html` võimaldab dünaamiliselt laadida `book.html` sisu, siis fail asub `contents/book.html`.

Kõik `"nested-html"` elemendid asuvad samas kataloogis. 

### `images/`
Kataloog, mis sisaldab kõiki kasutatud pilte.

## Dependencies
- Puuduvad

## Autorid
- 