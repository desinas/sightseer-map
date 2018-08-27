//app map coords of Athens historical center, to center the window map
const ATHENS= {
    limit: 18,
    explore: "sights" ,
    coords: {lat: 37.9726543, lng: 23.7263274},
    elevation: 16
};

//google maps license key of the developer
const GOOGLEMAPS= "AIzaSyC1Y06-pFfNM7Voq4ygiUcrAPHXXugYRNc";

//foursquare credentials
const FOURSQUARE= {
    clientId: "IHKLFASXMM0FZNZLYG0DLFJD2T01HDGEY5HWWD0MBDVWHCNB",
    clientSec: "0OPDP0NNJ3MI3XX4JWUZAPR4IUFYDGIF2UYCQBPXLVYUUE5V"
};

//wikipedia api call on media-wiki
const WIKIPEDIA= 
'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=';

export { ATHENS, GOOGLEMAPS, FOURSQUARE, WIKIPEDIA };