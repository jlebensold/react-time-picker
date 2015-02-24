'use strict';

var React       = require('react')
var assign      = require('object-assign')
var normalize   = require('react-style-normalizer')

var parseTime    = require('./parseTime')
var updateTime   = require('./updateTime')
var toUpperFirst = require('./toUpperFirst')
var timeToString = require('./timeToString')

var hasTouch = require('has-touch')
var EVENT_NAMES = require('react-event-names')

var WHITESPACE = '\u00a0'

function emptyFn(){}

var twoDigits     = require('./twoDigits')
var getFormatInfo = require('./getFormatInfo')
var format        = require('./format')

module.exports = React.createClass({

	displayName: 'ReactTimePicker',

	componentWillUnmount: function(){
		this.stopInterval()
	},

	getInitialState: function(){
		return {
			defaultValue: this.props.defaultValue,
			focused: {
				hour    : null,
				minute  : null,
				second  : null,
				meridian: null
			}
		}
	},

	getDefaultProps: function() {
		return {
			stopChangePropagation: true,


			//makes 15:78 be converted to 15:00, and not to 16:18
			strict: true,
			overflowHourToMeridian: true,

			step: 1,
			hourStep: null,
			minuteStep: 1,
			secondStep: 20,

			stepDelay:60,
			showArrows: true,

			defaultStyle: {
				border: '1px solid gray',
				padding: 20,
				display: 'inline-flex',
				alignItems: 'center',
				boxSizing: 'border-box',
				flexFlow: 'row',
				width: 200
			},
			defaultArrowStyle: {
				cursor: 'pointer',
				userSelect: 'none'
			},
			defaultBoxStyle: {
				boxSizing: 'border-box',
				display: 'flex',
				flexFlow: 'column',
				alignItems: 'center'
			},
			defaultInputStyle: {
				boxSizing: 'border-box',
				width: '100%',
				textAlign: 'center'
			},
			defaultSeparatorStyle: {
				flex: 'none'
			},
			defaultMeridianInputStyle: {
				cursor: 'pointer'
			},
			defaultMeridianInputProps: {
				readOnly: true
			},
			format: twoDigits,
			formatHour: null,
			formatMinute: null,
			formatSecond: null,
			formatMeridian: null,

			defaultArrowFactory: React.DOM.span,

			arrowFactory: null,
			arrowUpFactory: null,
			arrowDownFactory: null,

			defaultInputFactory: React.DOM.input,
			inputFactory: null,

			hourInputFactory: null,
			minuteInputFactory: null,
			secondInputFactory: null,
			meridianInputFactory: null,

			timeToString: timeToString
		}
	},

	render: function(){
		var props = this.prepareProps(this.props, this.state)

		var hour     = this.renderHour(props)
		var minute   = this.renderMinute(props)
		var second   = this.renderSecond(props)
		var meridian = this.renderMeridian(props)

		var separator       = props.separator || React.createElement("span", {style: props.separatorStyle}, WHITESPACE + ':' + WHITESPACE)
		var hourSeparator   = hour && (minute || second || meridian)? props.hourSeparator || separator: null
		var minuteSeparator = minute && (second || meridian)? props.minuteSeparator || separator: null
		var secondSeparator = (second && meridian)? props.secondSeparator || separator: null


		return React.createElement("div", React.__spread({},  props), 
			hour, 
			hourSeparator, 
			minute, 
			minuteSeparator, 
			second, 
			secondSeparator, 
			meridian
		)
	},

	onArrowMouseDown: function(props, dir, name, event){

		if (name == 'meridian'){
			this.onArrowMeridianAction(props, dir, name)
			return
		}

		var target = hasTouch?
		                event.target:
		                window
		var eventName = hasTouch? 'touchend': 'click'

		target.addEventListener(eventName, this.onWindowClick)

		this.startInterval(props, dir, name)
	},

	onWindowClick: function(){
		this.stopInterval()
	},

	stopInterval: function(){
		clearInterval(this.intervalId)
	},

	startInterval: function(props, dir, name){
		this.intervalId = setInterval(function(){
			this.onArrowAction(props, dir, name)
		}.bind(this), props.stepDelay)
	},

	onMeridianInputMouseDown: function(props, event){
		event.preventDefault()
		this.onArrowMeridianAction(props, 1, 'meridian')
	},

	onArrowMeridianAction: function(props, dir, name){
		var currentMeridian = this.time.meridian
		var lowercase = currentMeridian == 'am' || currentMeridian == 'pm'

		var newValue = lowercase?
							currentMeridian == 'am'? 'pm': 'am'
							:
							currentMeridian == 'AM'? 'PM': 'AM'

		this.updateValue(name, newValue)
	},

	onArrowAction: function(props, dir, name) {

		var dirName = dir == 1? 'Up': 'Down'
		var methodName = 'onArrow' + dirName + toUpperFirst(name) + 'Action'

		if (typeof this[methodName] == 'function'){
			this[methodName](props)
		}

		methodName = 'onArrow' + toUpperFirst(name) + 'Action'

		if (typeof this[methodName] == 'function'){
			this[methodName](props, dir)
		}

		this.incValue(props, name, dir)
	},

	incValue: function(props, name, dir){
		dir = dir || 0

		var step     = props[name + 'Step'] || props.step
		var amount   = dir * step
		var time     = this.time
		var oldValue = time[name]
		var newValue = oldValue + amount

		this.setValue(time)
		this.updateValue(name, newValue)
	},

	updateValue: function(name, newValue, config){
		this.setValue(this.updateTime(name, newValue, config))
	},

	updateTime: function(name, newValue, config){
		config = config || {}
		config.overflowHourToMeridian = this.props.overflowHourToMeridian

		var time = this.time

		time = updateTime(time, name, newValue, config)

		return this.time = time
	},

	setValue: function(time){

		if (this.props.value == null){
			this.setState({
				defaultValue: time
			})
		}

		;(this.props.onChange || emptyFn)(this.props.timeToString(time), assign({}, time))
	},

	format: function(props, name, value){
		var formatFn

		if (arguments.length < 3){
			value = props.time[name]
		}

		if (name != 'meridian'){
			formatFn = props['format' + toUpperFirst(name)]
		} else {
			formatFn = props.formatMeridian
		}

		if (!formatFn && typeof props.format == 'string'){
			formatFn = function(value, name){
				return format(name, value, props.formatInfo)
			}
		}

		if (typeof formatFn == 'function'){
			value = formatFn(value, name, props)
		}

		return value
	},

	renderBox: function(props, name){
		var state = this.state
		var style      = props[name + 'Style']
		var inputStyle = props[name + 'InputStyle']
		var upperName  = toUpperFirst(name)

		var value

		if (!state.focused[name]){
			value = this.format(props, name)
		} else {
			value = state.focused[name].value
		}

		var arrowUp
		var arrowDown

		if (props.showArrows){
			var arrowUpProps = {
				style      : props.arrowUpStyle,
				children   : '▴'
			}

			arrowUpProps[EVENT_NAMES.onMouseDown] = this.onArrowMouseDown.bind(this, props, 1, name)

			var arrowDownProps = {
				style      : props.arrowDownStyle,
				children   : '▾'
			}

			arrowDownProps[EVENT_NAMES.onMouseDown] = this.onArrowMouseDown.bind(this, props, -1, name)

			var defaultArrowFactory = props.defaultArrowFactory
			var arrowUpFactory = props.arrowUpFactory || props.arrowFactory || defaultArrowFactory
			var arrowDownFactory = props.arrowDownFactory || props.arrowFactory || defaultArrowFactory

			arrowUp = arrowUpFactory(arrowUpProps)
			if (arrowUp === undefined){
				arrowUp = defaultArrowFactory(arrowUpProps)
			}

			arrowDown = arrowDownFactory(arrowDownProps)
			if (arrowDown === undefined){
				arrowDown = defaultArrowFactory(arrowDownProps)
			}
		}

		var defaultInputFactory = props.defaultInputFactory
		var inputFactory = props[name + 'InputFactory'] || props.inputFactory || defaultInputFactory

		var defaultInputProps = props['default' + upperName + 'InputProps']
		var inputProps = assign({}, defaultInputProps, {
			style   : inputStyle,
			value   : value,
			onFocus : this.handleInputFocus.bind(this, props, name),
			onBlur  : this.handleInputBlur.bind(this, props, name),
			onChange: this.handleInputChange.bind(this, props, name)
		})

		if (name == 'meridian'){
			inputProps.onMouseDown = this.onMeridianInputMouseDown.bind(this, props)
		}

		var input = inputFactory(inputProps)
		if (input === undefined){
			input = defaultInputFactory(inputProps)
		}


		return React.createElement("div", {style: style}, 
			arrowUp, 
			input, 
			arrowDown
		)
	},

	handleInputFocus: function(props, name, event){
		var focused = this.state.focused

		focused[name] = {
			value: this.format(props, name)
		}

		this.setState({})
	},

	handleInputBlur: function(props, name, event){

		this.state.focused[name] = null
		this.setState({})

		var time
		var value = event.target.value * 1

		this.updateValue(name, value, {
			clamp: props.clamp
		})
	},

	handleInputChange: function(props, name, event){
		if (this.state.focused[name]){
			this.state.focused[name].value = event.target.value
		}

		this.setState({})
		props.stopChangePropagation && event.stopPropagation()
	},

	getTime: function(){
		return parseTime(this.getValue(), {
			strict: this.props.strict
		})
	},

	prepareTime: function(props, state) {
		var timeValue = this.getTime()

		props.showSecond = props.formatInfo?
								props.formatInfo.second.specified:
								timeValue.second !== undefined

		props.showMinute = props.formatInfo?
								props.formatInfo.minute.specified:
								timeValue.minute !== undefined

		props.withMeridian = props.formatInfo?
								props.formatInfo.meridian.specified:
								timeValue.meridian != null

		return timeValue
	},

	getValue: function() {
	    var value = this.props.value == null?
	                    this.state.defaultValue:
	                    this.props.value

	    return value
	},

	renderHour: function(props) {
		return this.renderBox(props, 'hour')
	},

	renderMinute: function(props) {
		if (props.showMinute){
			return this.renderBox(props, 'minute')
		}
	},

	renderSecond: function(props) {
		if (props.showSecond){
			return this.renderBox(props, 'second')
		}
	},

	renderMeridian: function(props) {
		if (props.withMeridian){
			return this.renderBox(props, 'meridian')
		}
	},

	prepareProps: function(thisProps, state) {
		var props = assign({}, thisProps)

		props.formatInfo = getFormatInfo(props.format)
		this.time = props.time = this.prepareTime(props, state)
		this.prepareStyles(props, state)

		return props
	},

	prepareStyles: function(props, state) {

		props.style = this.prepareStyle(props, state)
		props.separatorStyle = this.prepareSeparatorStyle(props, state)
		this.prepareArrowStyles(props, state)

		this.prepareHourStyles(props, state)
		this.prepareMinuteStyles(props, state)
		this.prepareSecondStyles(props, state)
		this.prepareMeridianStyles(props, state)

	},

	prepareStyle: function(props, state) {
		return normalize(assign({}, props.defaultStyle, props.style))
	},

	prepareSeparatorStyle: function(props, state) {
		return normalize(assign({}, props.defaultSeparatorStyle, props.separatorStyle))
	},

	prepareArrowStyles: function(props, state) {
		props.arrowUpStyle = normalize(assign({}, props.defaultArrowStyle, props.defaultArrowUpStyle, props.arrowUpStyle))
		props.arrowDownStyle = normalize(assign({}, props.defaultArrowStyle, props.defaultArrowDownStyle, props.arrowDownStyle))
	},

	prepareHourStyles: function(props, state) {
		props.hourStyle = this.prepareHourStyle(props, state)
		props.hourInputStyle = this.prepareHourInputStyle(props, state)
	},

	prepareHourStyle: function(props, state) {
		return normalize(assign({}, props.defaultBoxStyle, props.defaultHourStyle, props.hourStyle))
	},

	prepareHourInputStyle: function(props, state) {
		return normalize(assign({}, props.defaultInputStyle, props.defaultHourInputStyle, props.hourInputStyle))
	},

	prepareMinuteStyles: function(props, state) {
		props.minuteStyle = this.prepareMinuteStyle(props, state)
		props.minuteInputStyle = this.prepareMinuteInputStyle(props, state)
	},

	prepareMinuteStyle: function(props, state) {
		return normalize(assign({}, props.defaultBoxStyle, props.defaultMinuteStyle, props.minuteStyle))
	},

	prepareMinuteInputStyle: function(props, state) {
		return normalize(assign({}, props.defaultInputStyle, props.defaultMinuteInputStyle, props.minuteInputStyle))
	},

	prepareSecondStyles: function(props, state) {
		if (props.showSecond){
			props.secondStyle = this.prepareSecondStyle(props, state)
			props.secondInputStyle = this.prepareSecondInputStyle(props, state)
		}
	},

	prepareSecondStyle: function(props, state) {
		return normalize(assign({}, props.defaultBoxStyle, props.defaultSecondStyle, props.secondStyle))
	},

	prepareSecondInputStyle: function(props, state) {
		return normalize(assign({}, props.defaultInputStyle, props.defaultSecondInputStyle, props.secondInputStyle))
	},

	prepareMeridianStyles: function(props, state){
		if (props.withMeridian){
			props.meridianStyle = this.prepareMeridianStyle(props, state)
			props.meridianInputStyle = this.prepareMeridianInputStyle(props, state)
		}
	},

	prepareMeridianStyle: function(props, state) {
		return normalize(assign({}, props.defaultBoxStyle, props.defaultMeridianStyle, props.meridianStyle))
	},

	prepareMeridianInputStyle: function(props, state) {
		return normalize(assign({}, props.defaultInputStyle, props.defaultMeridianInputStyle, props.meridianInputStyle))
	}
})