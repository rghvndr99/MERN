import React from 'react';

class Image extends React.Component {
	constructor (props) {
		super(props)
	}

	render() {
		const {dataSrc,cssClass} = this.props;

		return (
				<img src={dataSrc} className= {cssClass} />
			)
	}
}

export default Image;