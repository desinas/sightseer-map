import React from 'react';

/**
 * @description Implement of the info box on screen to display
 * a box with text coming from wikipedia explaining the place.
 * @prop {object} currentMarker - Marker of google maps
 * @prop {string} infoContent - Info text about the place
 */
function InfoWikiBox(props) {
	const { currentMarker, infoContent } = props;

	return (
		<aside className="info-box">
			<h2>{currentMarker.title}</h2>
			<article>{infoContent}</article>
			<p className="attribution">Thanks to Wikipedia</p>
		</aside>
	);
}

export default InfoWikiBox;
