import { h, render, Component } from 'preact';
import throttle from 'lodash/throttle';

const NETWORK_THROTTLE_TIME = 600;

const getImgSrc = (width, height) =>
	width === height
		? `/${width}`
		: `/${width}x${height}`;


const ImagePreview = ({width, height}) =>
	<img
		src={getImgSrc(width, height)}
		alt="Example image TODO: update this"
	/>;

const createSizeControl = (self, key) => throttle(
	({target}) => {
		self.setState({[key]: target.value});
	},
	NETWORK_THROTTLE_TIME
);



class App extends Component {
	state = {
		width: 400,
		height: 400
	};

	handleWidthChange = createSizeControl(this, 'width');
	handleHeightChange = createSizeControl(this, 'height');

	render({}, {width, height}) {
		return (
			<div>
				<input type="range" min="1" max="2000" value={width}
					   onInput={this.handleWidthChange}/>
				<input type="range" min="1" max="2000" value={height}
					   onInput={this.handleHeightChange}/>
				<div>{`${location.protocol}//${location.host}${getImgSrc(width, height)}`}</div>
				<ImagePreview width={width} height={height}/>
			</div>
		);
	}
}


render(<App/>, document.body);
