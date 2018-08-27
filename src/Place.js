import React from "react";

class Place extends React.Component {

  render() {
    return (
      <li
        role="button"
        className="place"
        tabIndex="0"
        onKeyPress={this.props.openInfowindow.bind(this,
          this.props.data.marker
        )}
        onClick={this.props.openInfowindow.bind(this, this.props.data.marker)}
      >
        {this.props.data.nameExt}
      </li>
    );
  }
}

export default Place;
