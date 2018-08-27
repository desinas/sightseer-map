import React from 'react'
import { Component } from 'react'
import axios from 'axios'

import { ATHENS, GOOGLEMAPS } from './data/defaults'
import { FOURSQUARE, WIKIPEDIA } from './data/defaults'
import * as locations from './data/locations.json'
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
            locations: locations,

            infowindow: '',
            prevMarker: '',
            currentMarker: {},

            isInfowindowOpen: false,
            infoContent: ''
        }
            this.initMap = this.initMap.bind(this);
            this.openInfowindow = this.openInfowindow.bind(this);
            this.closeInfowindow = this.closeInfowindow.bind(this);
    }

    componentDidMount() {

        this.explorePlaces("sights", "athens")
        // this.mapFetch();
        // window.gm_authFailure = this.gm_authFailure;
    
        window.initMap = this.initMap;
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
                
                    places: response.data.response.groups[0].items,
                }, this.mapFetch());//fetch map and render it after storing venues state
            }).catch(error => {
                console.log("Error on Fetching Venues: " + error)
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

            // marker.addListener("click", function () {
            //     self.openInfowindow(marker);
            // });
            let infoContent = 
                `<h2>${loc.title} - ${loc.kind}</h2>
                <p>latit.: ${loc.coords.lat}, longit.: ${loc.coords.lng}</p>`
            
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
            
            loc.nameExt= nameExt;
            loc.marker= marker;
            loc.display = true;
            locations.push(loc);    
        });

        
    

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
            });//generate markers for these locations using forEach method, https://stackoverflow.com/questions/45014094/expected-to-return-a-value-at-the-end-of-arrow-function
        
            place.nameExt= nameExt;
            place.marker= marker;
            place.display = true;
            locations.push(place);


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

        this.setState({ locations: locations });

        // this.state.locsMustSee.forEach( (loc) => {
      
        //     let marker= new window.google.maps.Marker( {
        //       position: { lat: loc.coords.lat , lng: loc.coords.lng },
        //       label: "in",
        //       map: map,
        //       title: loc.title
        //     } ); //generate markers for these locations using forEach method, https://stackoverflow.com/questions/45014094/expected-to-return-a-value-at-the-end-of-arrow-function
      
        //     this.state.markers.push(marker);

        //     let infoContent= `<h2>${loc.title}</h2>`;
            
        //     marker.addListener('click', function() {
        //       infowindow.setContent(infoContent);
        //       infowindow.open(map, marker);
        //     } ) //open the infowindow on click
        // } )
    
        // this.setState({ infowindow: infowindow });
    }



    openInfowindow= function (marker) {
        this.setState({
                        isInfowindowOpen: true,
                        currentMarker: marker
        });
    
        this.getWikiInfo(marker);
      }
    
    closeInfowindow= function () {
        this.setState({
                        isInfowindowOpen: false,
                        currentMarker: {}
        });
      }

    getWikiInfo = (marker) => {
        let self = this;
        let place = marker.title.split('(')[0];//split on char and take the left: https://stackoverflow.com/questions/5631384/remove-everything-after-a-certain-character
         //api call through proxy to solve cors issue
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
            });
          })
        } //https://www.mediawiki.org/wiki/API:Query#Sample_query


    // openInfowindow(marker) {
    //     this.closeInfowindow();
    //     this.state.infowindow.open(this.state.map, marker);
    //     marker.setAnimation(window.google.maps.Animation.BOUNCE);
    //     this.setState({ prevMarker: marker });
    //     this.state.infowindow.setContent("Loading...");
    //     this.state.map.setCenter(marker.getPosition() );
    //     this.state.map.panBy(0,-200);
    //     this.getMarkerInfo(marker);
    // } //Open the infowindow for the marker

    // closeInfowindow() {
    //     if (this.state.prevMarker) {
    //         this.state.prevMarker.setAnimation(null);
    //     }
    //     this.setState({
    //         prevMarker: ''
    //     });
    //     this.state.infowindow.close();
    // } //Close the info window previously opened

    // getMarkerInfo = (marker) => {
    // var self = this;

    // // Add the api keys for foursquare
    // var clientId = "IHKLFASXMM0FZNZLYG0DLFJD2T01HDGEY5HWWD0MBDVWHCNB";
    // var clientSecret = "0OPDP0NNJ3MI3XX4JWUZAPR4IUFYDGIF2UYCQBPXLVYUUE5V";

    // // Build the api endpoint
    // var url =
    //   "https://api.foursquare.com/v2/venues/search?client_id=" +
    //   clientId +
    //   "&client_secret=" +
    //   clientSecret +
    //   "&v=20130815&ll=" +
    //   marker.getPosition().lat() +
    //   "," +
    //   marker.getPosition().lng() +
    //   "&limit=1";
    // fetch(url)
    //   .then(function(response) {
    //     if (response.status !== 200) {
    //       self.state.infowindow.setContent("Sorry data can't be loaded");
    //       return;
    //     }

    //     // Get the text in the response
    //     response.json().then(function(data) {
    //       console.log(data);

    //       var location_data = data.response.venues[0];
    //       var place = `<h3>${location_data.name}</h3>`;
    //       var street = `<p>${location_data.location.formattedAddress[0]}</p>`;
    //       var contact = "";
    //       if (location_data.contact.phone)
    //         contact = `<p><small>${location_data.contact.phone}</small></p>`;
    //       var checkinsCount =
    //         "<b>Number of CheckIn: </b>" +
    //         location_data.stats.checkinsCount +
    //         "<br>";
    //       var readMore =
    //         '<a href="https://foursquare.com/v/' +
    //         location_data.id +
    //         '" target="_blank">Read More on <b>Foursquare Website</b></a>';
    //       self.state.infowindow.setContent(
    //         place + street + contact + checkinsCount + readMore
    //       );
    //     });
    //   })
    //   .catch(function(err) {
    //     self.state.infowindow.setContent("Sorry data can't be loaded");
    //   });
    // }
      


    // updatePlaces = (newPlaces) => {
    //     this.setState({places: newPlaces})
    // };

    // updateMarkers = (newMarkers) => {
    //     this.setState({markers: newMarkers})
    // };


    render() {
        return (
            <div>
                
                <main>
                    {/* <ListOfPlaces 
                        places={this.state.placesCollection} 
                        markers={this.state.markers} 
                        updatePlaces={this.updatePlaces}
                        updateMarkers={this.updateMarkers}
                    /> */}
                    <ListOfPlaces
                        
                        locations={this.state.locations}
                        openInfowindow={this.openInfowindow}
                        closeInfowindow={this.closeInfowindow}
                        />
                    {
                        this.state.isInfowindowOpen &&
                        <InfoWikiBox
                        currentMarker={this.state.currentMarker}
                        infoContent={this.state.infoContent}
                        />
                    }
                    <NeighborMap />
                </main>
            </div>
        )
    }
}

export default App
