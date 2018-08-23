import React from 'react'
import { Component } from 'react'
import axios from 'axios'

import './App.css'
import { ATHENS, GOOGLEMAPS } from './AppDefaults'
import { FOURSQUARE } from './AppDefaults'
import * as data from './locations.json'
import { loadScript } from './loadScript'
import NeighborMap from './NeighborMap'



class App extends Component {

  state = {
    mapAppCenter: ATHENS,
    locsMustSee: data,
    venuesOfinterest: []
  }

  componentDidMount() {
    this.getVenues()
    
  }

  mapFetch = function () {
    const googMapsApiKey= GOOGLEMAPS;
    const googMapsApiUrl= "https://maps.googleapis.com/maps/api/js?key="
                        + googMapsApiKey + "&callback=initMap";

    loadScript(googMapsApiUrl)
    window.initMap = this.initMap
  } //api endpoint build and call function

  getVenues = function () {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const params = {
      client_id: FOURSQUARE.clientId,
      client_secret: FOURSQUARE.clientSec,
      ll: `${ATHENS.lat},${ATHENS.lng}`,
      query: "food",
      limit: "18",
      v: "20180323"
    }

    axios.get(endPoint + new URLSearchParams(params))
      .then(response => {
        // console.log(response.data.response.groups[0].items); //dev test
        this.setState({
          venuesOfinterest: response.data.response.groups[0].items
        }, this.mapFetch()); //fetch map and render it after storing venues state
      })
      .catch(error => {
        console.log("Error on Fetching Venues: " + error)
      })
  }

  initMap =  () => {

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: this.state.mapAppCenter,
      zoom: 16
    } ) //create map of the specified area

    
    let infowindow = new window.google.maps.InfoWindow() //create solo infowindow instead of having it in the loop and creates multi infowindows

    this.state.locsMustSee.map( (loc) => {
      
      let marker= new window.google.maps.Marker( {
        position: { lat: loc.coords.lat , lng: loc.coords.lng },
        label: "in",
        map: map,
        title: loc.title
      } ) //generate markers for these locations

      let infoContent= `<h2>${loc.title}</h2>`;
      
      marker.addListener('click', function() {
        infowindow.setContent(infoContent);
        infowindow.open(map, marker);
      } ) //open the infowindow on click
    } )

    this.state.venuesOfinterest.map( (ven) => {

      var infoContent=
          `<h2>${ven.venue.name}</h2><h3>${ven.venue.location.address}</h3>`;
      var marker = new window.google.maps.Marker({
        position: {lat: ven.venue.location.lat , lng: ven.venue.location.lng},
        map: map,
        title: ven.venue.name
      } ) //create marker for venue

      marker.addListener('click', function() {
        infowindow.setContent(infoContent)
        infowindow.open(map, marker)
      }) //open the infowindow on click and execute open on infowindow passing map instance with marker instance together
    })
  


  }

  render() {
    return (
      <main>
        <NeighborMap />
      </main>
      
    );
  }
}

export default App;
