This app helps a visitor of Greece, Athens to spent a day passing from interesting places around Athens center. Also, is collection of descriptions for these places, so that, the visitor to have an idea in what to expect from. This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) constructs a Single Page Application.

## Porject Overview
Athens ancient places has been build from scracth using React. The application features a map of Athens center and markers on the highlighted locations. Clicking on a map marker displays information about the location. A list of the locations and a search filter is available. Clicking a location on the list displays the information about the location, and animates its associated map marker. 

## Features

1. Type into the filter/search box to filter the shown locations on the map.
2. Click on the Places button to collapse or expand the suggestions list.
3. Click on any marker to see the location details fetched from Wikipadia.
4. Click anywhere on the map to close the information window that opens. 

## Installing
- to the root of this repository
- Run npm install
- Run npm start
- The application will open in browser at the address: localhost:3000

## Needs for other Packages
- npm package manager
- React UI library
- create-react-app bootstrapper
- axios Promise based HTTP client
- escape-string-regexp
- The project uses Google Maps API
- The project uses MediaWikiAPI

## Folder Structure

```
neghborhood-map/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    App.css
    App.js //the main component with map rendering
    App.test.js
    index.css
    index.js
    InfoWikiBox.js //info about a place in a info window box
    data/locations.json
    ListOfPlaces.js //list of interesting places in the area
    registerServiceWorker.js
  .gitignore
  package-lock.json
  package.json
  README.md
  yarn.lock
```

## Supported Browsers

By default, the generated project uses the latest version of React.

You can refer [to the React documentation](https://reactjs.org/docs/react-dom.html#browser-support) for more information about supported browsers.

## Credits

This is a project for [Front-End Web Developer Udacity Nanodegree Program](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001).

Thanks to [Google](https://google.com "Google") and [Udacity](https://www.udacity.com "Udacity") for [Scholarship](https://www.udacity.com/google-scholarships) for this program.
