'use strict';

var React = require('react')
var TimePicker = require('react-time-picker')

require('./index.styl')

var defaultStyle = {
	marginTop: 50
}

var SYNC_VALUE = '03:34'

var App = React.createClass({

	displayName: 'App',

	onChange: function(value) {
		SYNC_VALUE = value
		this.setState({})
	},

	render: function(){
		return <div style={{margin: 50}}>
			<div style={defaultStyle}>
				<TimePicker defaultValue='11:34:56' />
			</div>

			<div style={defaultStyle}>

				<p>Those two are synced and have custom styles</p>

				<TimePicker value={SYNC_VALUE} onChange={this.onChange} arrowStyle={{color: 'red'}} inputStyle={{color: 'blue'}}/>
				<TimePicker style={{marginLeft: 50}} value={SYNC_VALUE} onChange={this.onChange} arrowStyle={{color: 'gray'}} inputStyle={{color: 'blue'}}/>
			</div>

			<div style={defaultStyle}>
				<p>This one only shows hour and meridian</p>
				<TimePicker defaultValue='11 AM' />
			</div>
		</div>
	}
})


React.render(<App />, document.getElementById('content'))