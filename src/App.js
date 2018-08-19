import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

class App extends Component {

  state = { venues: [] }

  componentDidMount() {
    this.mapFetch();
    this.getVenues();
  }

  mapFetch = function () {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC1Y06-pFfNM7Voq4ygiUcrAPHXXugYRNc&callback=initMap")
    window.initMap = this.initMap
  }

  getVenues = function () {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const params = {
      client_id: "IHKLFASXMM0FZNZLYG0DLFJD2T01HDGEY5HWWD0MBDVWHCNB",
      client_secret: "0OPDP0NNJ3MI3XX4JWUZAPR4IUFYDGIF2UYCQBPXLVYUUE5V",
      ll: "37.9726543,23.7263274",
      query: "food",
      v: "20180323"
    }

    axios.get(endPoint + new URLSearchParams(params))
      .then(response => {
        console.log(response.data.response.groups[0].items); //dev test
        this.setState({
          venues: response.data.response.groups[0].items
        });
      })
      .catch(error => {
        console.log("Fetch Venue Error - " + error)
      })
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
