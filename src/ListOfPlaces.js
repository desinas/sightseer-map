import React, { Component } from "react";
import Place from "./Place";

class ListOfPlaces extends Component {

  constructor(props) {

    super(props);
    this.state = {
      locations: '',
      query: ''
    };

    this.filterLocations = this.filterLocations.bind(this);
  }

  filterLocations(event) {
    this.props.closeInfowindow();
    const { value } = event.target;
    var locations = [];
    this.props.locations.forEach(function(loc) {
      if (loc.nameExt.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        loc.marker.setVisible(true);
        locations.push(loc);
      } else {
        loc.marker.setVisible(false);
      }
    });

    this.setState({
      locations: locations,
      query: value
    });
  } //Filter Locations based on user query

  componentWillMount() {
    this.setState({
      locations: this.props.locations
    });
  }

  render() {
    var locationlist = this.state.locations.map(function(item, index) {
      return (
        <Place
          role="listitem"
          tabIndex="0"
          key={index}
          openInfowindow={this.props.openInfowindow.bind(this)}
          data={item} />

      );
    }, this);

    return (
      <div className="search-area">
        <input
          role="search"
          aria-labelledby="Search for a place"
          tabIndex="1"
          id="search-field"
          className="search-input"
          type="text"
          placeholder="Finder of Places"
          value={this.state.query}
          onChange={this.filterLocations} />
          
        <ul className="location-list"
          role="listbox"
          tabIndex="0"
          aria-label="List of places to visit"
        >

          {locationlist}
        </ul>
      </div>
    );
  }
}

export default ListOfPlaces;
