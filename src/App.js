import React from 'react'
import { Component } from 'react'
import axios from 'axios'

import { ATHENS, GOOGLEMAPS } from './data/defaults'
import { FOURSQUARE, WIKIPEDIA } from './data/defaults'
import * as LOCATIONS from './data/locations.json'
import { loadScript } from './utils/loadScript'

import './App.css'
import ListOfPlaces from './ListOfPlaces'
import NeighborMap from './NeighborMap'
import InfoWikiBox from './InfoWikiBox'

class App extends Component {

    constructor(props) {

        super(props);
        this.state = {
        
            map: '',
            places: [],
            markers: [],
            locations: LOCATIONS,

            infowindow: '',
            prevMarker: '',
            currentMarker: {},

            isInfowindowOpen: false,
            infoContent: ''
        }
            this.initMap = this.initMap.bind(this);
            this.gm_authFailure = this.gm_authFailure.bind(this);
            this.openInfowindow = this.openInfowindow.bind(this);
            this.closeInfowindow = this.closeInfowindow.bind(this);
    }

    gm_authFailure(){
        window.alert("Error, on reaching Google Maps API.")
        let map = document.getElementById('map');
        map.innerHTML = `<h1 class="error-msg">Sorry, Google Map could not be reached...</h1>`
      }

    componentDidMount() {
        //the following global function will be called when the authentication fails
        window.gm_authFailure = this.gm_authFailure;
        //calling the function that fetces sights of the city 
        this.explorePlaces("sights", "athens")
        //connect the function from this class to the global window
        window.initMap = this.initMap;
    }

    //Using Google Maps in React without custom libraries
    //http://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries/
    mapFetch = function () {

        const googMapsApiKey= GOOGLEMAPS;
        const googMapsApiUrl= "https://maps.googleapis.com/maps/api/js?key="
                + googMapsApiKey + "&callback=initMap";
    
        loadScript(googMapsApiUrl)
        window.initMap = this.initMap
    }//api endpoint build and call function

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
                
                    places: response.data.response.groups[0].items,
                }, this.mapFetch());//fetch map and render it after storing venues state
            }).catch(error => {
                console.log("Error on Fetching Venues: " + error);
                this.setState({error:"Data cannot be loaded at this time"});
                window.alert("Sorry, there is a Foursquare get venues error!");
            })
    }

    initMap = function () {
        var self = this;

        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: ATHENS.coords,
            zoom: ATHENS.elevation,
            disableDefaultUI: true
        
        })//create map of the specified area

        const infowindow = new window.google.maps.InfoWindow({}) //create solo infowindow instead of having it in the loop and creates multi infowindows

        this.setState({ map: map,
                infowindow: infowindow });

        window.google.maps.event.addDomListener(window, 'resize', function() {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, 'resize');
            self.state.map.setCenter(center);
        });
        window.google.maps.event.addListener(map, 'click', function() {
            self.closeInfowindow();
        });

        //marker label customize
        //https://developers.google.com/maps/documentation/javascript/examples/marker-labels
        var locations = [];
        this.state.locations.forEach( (loc) => {
            var nameExt = loc.title + " - " + loc.kind;
            let marker = new window.google.maps.Marker( {
                position: { lat: loc.coords.lat , lng: loc.coords.lng },
                label: "in",
                map: map,
                title: loc.title,
                animation: window.google.maps.Animation.DROP
            });

            let infoContent = 
                `<div class="info-window" aria-label="infowindow" role="section">
                <h2>${loc.title} - ${loc.kind}</h2>
                <p>This is the coords: latit.: ${loc.coords.lat}, longit.: ${loc.coords.lng}</p>
                </div>`
            
            marker.addListener('click', function () {
            
                infowindow.setContent(infoContent);//update 'InfoWindow' content
                infowindow.open(map, marker)//open An 'InfoWindow'
            })
            
            loc.nameExt= nameExt;
            loc.marker= marker;
            loc.display = true;
            locations.push(loc);    
        });

        //generate markers for these locations using forEach method
        //https://stackoverflow.com/questions/45014094/expected-to-return-a-value-at-the-end-of-arrow-function
        this.state.places.forEach( (place) => {
            var nameExt = place.venue.name;
            let marker = new window.google.maps.Marker({
                position: {
                    lat: place.venue.location.lat,
                    lng: place.venue.location.lng
                },
                map: map,
                animation: window.google.maps.Animation.DROP,
                title: place.venue.name
            });

            place.nameExt= nameExt;
            place.marker= marker;
            place.display = true;
            locations.push(place);

            this.state.markers.push(marker);//add each created marker to the 'markers' array

            let infoContent = `
                            <div class="info-window" aria-label="infowindow" role="section">
                            <h2>${place.venue.name}</h2>
                            <p aria-label="info about the location">Address: ${place.venue.location.formattedAddress[1]} ${place.venue.location.formattedAddress[2]}</p>
                            <p>This is the coords: lat: ${place.venue.location.lat}, long: ${place.venue.location.lng}</p>
                            </div>`

            marker.addListener('click', function () {
                
                infowindow.setContent(infoContent);//update InfoWindow content
                infowindow.open(map, marker)//open InfoWindow
            })                        //display the InfoWindow after clicking on the Marker
        })

        this.setState({ locations: locations });
    }

    openInfowindow= function (marker) {

        this.closeInfowindow();
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            isInfowindowOpen: true,
            currentMarker: marker,
            prevmarker: marker
        });
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(-50, 100);
        this.getWikiInfo(marker);
      }
    
    closeInfowindow= function () {

        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            prevmarker: '',
            isInfowindowOpen: false,
            currentMarker: {}
        });
        this.state.infowindow.close();
      }

    //https://www.mediawiki.org/wiki/API:Query#Sample_query
    //split on char and take the left: 
    //https://stackoverflow.com/questions/5631384/remove-everything-after-a-certain-character  
    getWikiInfo = function (marker) {
        let self = this;
        let place = marker.title.split('(')[0];
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        let srcUrl 
         = WIKIPEDIA 
         + place;
        srcUrl = srcUrl.replace(/ /g, '%20');
        
        fetch(proxyUrl + srcUrl)
          .then(function(response) {
            return response.json();
          }).then(function (data) {
            let pages = data.query.pages;
            let pageId = Object.keys(data.query.pages)[0];
            let pageContent = pages[pageId].extract;
    
            self.setState({ infoContent: pageContent });
    
          }).catch(function (error) {
            let pageError = 'Parsing failed ' + error;
            self.setState({
              infoContent: pageError
            });//api call through proxy to solve cors issue
          })
        } 

    render() {
        return (
            <div>
                <main>
                    <ListOfPlaces
                        locations={this.state.locations}
                        openInfowindow={this.openInfowindow}
                        closeInfowindow={this.closeInfowindow} />
                    {
                        this.state.isInfowindowOpen &&
                        <InfoWikiBox
                        currentMarker={this.state.currentMarker}
                        infoContent={this.state.infoContent} />
                    }
                    <NeighborMap 
                        gm_authFailure = {this.gm_authFailure} />
                </main>
            </div>
        )
    }
}

export default App
