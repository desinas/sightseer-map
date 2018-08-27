import React from 'react';

function InfoWikiBox (props) {

	return (
		<aside className="info-box" 
			aria-label="info" role="listitem">
			<h2>{props.currentMarker.title}</h2>
			<article role="listitem" tabIndex="1">{props.infoContent}</article>
			<p className="attribution">**Thanks to Wikipedia**</p>
		</aside>
	);
}

export default InfoWikiBox;
