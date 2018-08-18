import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentDidMount() {
    this.mapFetch();
  }

  mapFetch = function () {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC1Y06-pFfNM7Voq4ygiUcrAPHXXugYRNc&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = function () {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 37.9726543, lng: 23.7263274 },
      zoom: 16
    });
  }

  render() {
    return (
      <main>
        <div id="map"></div>
      </main>
      
    );
  }
}

function loadScript (url) {
  var index = window.document.getElementsByTagName('script')[0];
  var script = window.document.createElement('script');

  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);

  script.onerror = function () {
    document.write('Loading error on Google Maps')
  };
}

export default App;
