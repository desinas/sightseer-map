import React from 'react'
import { Component } from 'react'
import axios from 'axios'

import { ATHENS, GOOGLEMAPS } from './data/defaults'
import { FOURSQUARE } from './data/defaults'
import * as locations from './data/locations.json'
import { loadScript } from './utils/loadScript'
import './App.css'


// import NeighborMap from './NeighborMap'
// import ListOfPlaces from './ListOfPlaces'
import ListOfPlaces from './ListCompon/ListOfPlaces'
import NeighborMap from './MapCompon/NeighborMap'




class App extends Component {

    state = {

        placesCollection: [],
        places: [],
        markers: [],
        locsMustSee: locations
    }

    componentDidMount() {

        this.explorePlaces("sights", "athens")
        // this.mapFetch();
        // window.gm_authFailure = this.gm_authFailure;
    }

    mapFetch = function () {

        const googMapsApiKey= GOOGLEMAPS;
        const googMapsApiUrl= "https://maps.googleapis.com/maps/api/js?key="
                            + googMapsApiKey + "&callback=initMap";
    
        loadScript(googMapsApiUrl)
        window.initMap = this.initMap
    }//api endpoint build and call function
    // gm_authFailure = function () {
    //     window.alert("**Authentication Error on fetching Google maps**");
    //   }; //invalid key on google maps script or request limit reached, https://stackoverflow.com/questions/45633672/detect-query-limit-message-on-map-load-with-google-maps-javascript-api
    

    explorePlaces = function () {
        const endPoint = "https://api.foursquare.com/v2/venues/explore?"
        const params = {
            client_id: FOURSQUARE.clientId,
            client_secret: FOURSQUARE.clientSec,
            ll: `${ATHENS.coords.lat},${ATHENS.coords.lng}`,
            query: ATHENS.explore,
            limit: ATHENS.limit,
            v: "20180323"
        }

        axios.get(endPoint + new URLSearchParams(params))
            .then( (response) => {
                // console.log(response.data.response.groups[0].items); //dev test
                this.setState({
                    placesCollection: response.data.response.groups[0].items,
                    places: response.data.response.groups[0].items
                }, this.mapFetch());//fetch map and render it after storing venues state
            })
            .catch(error => {
                console.log("Error on Fetching Venues: " + error)
            })
    }

    
    initMap = () => {

        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: ATHENS.coords,
            zoom: ATHENS.elevation
        })//create map of the specified area

        let infowindow = new window.google.maps.InfoWindow()//create solo infowindow instead of having it in the loop and creates multi infowindows

        this.state.places.forEach( (place) => {

            let marker = new window.google.maps.Marker({
                position: {
                    lat: place.venue.location.lat,
                    lng: place.venue.location.lng
                },
                map: map,
                animation: window.google.maps.Animation.DROP,
                title: place.venue.name
            })//generate markers for these locations using forEach method, https://stackoverflow.com/questions/45014094/expected-to-return-a-value-at-the-end-of-arrow-function

            
            this.state.markers.push(marker);//add each created marker to the 'markers' array

            // Create InfoWindow
            let infoContent = `
                            <h2>${place.venue.name}</h2>
                            <p>Address: ${place.venue.location.formattedAddress[0]} ${place.venue.location.formattedAddress[1]} ${place.venue.location.formattedAddress[2]}</p>
                            <p>lat: ${place.venue.location.lat}, long: ${place.venue.location.lng}</p>
                            `

            // Display the InfoWindow after clicking on the Marker
            marker.addListener('click', function () {
                
                infowindow.setContent(infoContent);//update 'InfoWindow' content
                infowindow.open(map, marker)//open An 'InfoWindow'
                // Animate The Marker
                // if (marker.getAnimation() !== null) {
                //     marker.setAnimation(null);
                // } else {
                //     marker.setAnimation(window.google.maps.Animation.BOUNCE);
                // }
            })
        })

        this.state.locsMustSee.forEach( (loc) => {
      
            let marker= new window.google.maps.Marker( {
              position: { lat: loc.coords.lat , lng: loc.coords.lng },
              label: "in",
              map: map,
              title: loc.title
            } ); //generate markers for these locations using forEach method, https://stackoverflow.com/questions/45014094/expected-to-return-a-value-at-the-end-of-arrow-function
      
            this.state.markers.push(marker);

            let infoContent= `<h2>${loc.title}</h2>`;
            
            marker.addListener('click', function() {
              infowindow.setContent(infoContent);
              infowindow.open(map, marker);
            } ) //open the infowindow on click
        } )
    
    }

    updatePlaces = (newPlaces) => {
        this.setState({places: newPlaces})
    }
    
    render() {
        return (
            <div>
                
                <main>
                    <ListOfPlaces 
                        places={this.state.placesCollection} 
                        markers={this.state.markers} 
                        updatePlaces={this.updatePlaces}
                    />
                    <NeighborMap/>
                </main>
            </div>
        )
    }
}

export default App
