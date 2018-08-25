import React from 'react'
import { Component } from 'react'
import './ListOfPlaces.css'
import escapeRegExp from 'escape-string-regexp'

class ListOfPlaces extends Component {

    state = {
        query: '',
        filteredPlaces: this.props.places
    }

    updateQuery = (query) => {
        this.setState({ query })
        
        let placesCollection = this.props.places
        let newPlaces

        if(this.state.query && (this.state.query !== '')) {
            const match = new RegExp(escapeRegExp(query), 'i');
            newPlaces = placesCollection.filter((place) => match.test(place.venue.name))
            this.setState({filteredPlaces: newPlaces})
            this.props.updatePlaces(newPlaces)
        } else {
            this.setState({filteredPlaces: placesCollection})
        }
    }

    triggerMarkerClick = (placeTitle) => {
        this.props.markers.forEach((marker) => {
            if(marker.title === placeTitle) {
                window.google.maps.event.trigger(marker, 'click');
            }
        })
    }

    render() {
        return (
            <aside>
                <div className="search-form">
                    <label htmlFor="searchQuery">[Finder of Places] </label>
                    <input 
                        id="searchQuery" 
                        type="text" 
                        placeholder="Start typing to find it ..." 
                        onChange={(e) => this.updateQuery(e.target.value)} 
                        value={this.state.query}
                    />
                </div>

                {this.state.filteredPlaces.length !== 0 && (
                    <ul className="search-result">
                        {this.state.filteredPlaces.map((place, index) => (
                            <li 
                                key={index}
                                tabIndex={index}
                                className="item" 
                                onClick={() => this.triggerMarkerClick(place.venue.name)}
                            >
                                {place.venue.name}
                            </li>
                        ))}
                    </ul>
                )}

                {this.state.filteredPlaces === 0 && (
                    <ul className="search-result">
                        <li className="item">No Places Found..</li>
                    </ul>
                )}
                
            </aside>

        )
    }
}

export default ListOfPlaces