(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("React")) : factory(root["React"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

	var React = __webpack_require__(1)
	var TimePicker = __webpack_require__(2)

	__webpack_require__(3)

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
			return React.createElement("div", {style: {margin: 50}}, 
				React.createElement("div", {style: defaultStyle}, 
					React.createElement(TimePicker, {defaultValue: "11:34:56"})
				), 

				React.createElement("div", {style: defaultStyle}, 

					React.createElement("p", null, "Those two are synced and have custom styles"), 

					React.createElement(TimePicker, {value: SYNC_VALUE, onChange: this.onChange, arrowStyle: {color: 'red'}, inputStyle: {color: 'blue'}}), 
					React.createElement(TimePicker, {style: {marginLeft: 50}, value: SYNC_VALUE, onChange: this.onChange, arrowStyle: {color: 'gray'}, inputStyle: {color: 'blue'}})
				), 

				React.createElement("div", {style: defaultStyle}, 
					React.createElement("p", null, "This one only shows hour and meridian"), 
					React.createElement(TimePicker, {defaultValue: "11 AM"})
				)
			)
		}
	})


	React.render(React.createElement(App, null), document.getElementById('content'))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React       = __webpack_require__(1)
	var assign      = __webpack_require__(13)
	var normalize   = __webpack_require__(16)

	var parseTime    = __webpack_require__(6)
	var updateTime   = __webpack_require__(7)
	var toUpperFirst = __webpack_require__(8)

	var hasTouch = __webpack_require__(14)

	var EVENT_NAMES = __webpack_require__(15)

	var WHITESPACE = '\u00a0'

	function emptyFn(){}

	var twoDigits     = __webpack_require__(9)
	var getFormatInfo = __webpack_require__(10)
	var format        = __webpack_require__(11)
	var formatTime    = __webpack_require__(12)

	function identity(v){ return v }

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
				},
				overArrow: {
					hour: null,
					minute: null,
					second: null,
					meridian: null
				}
			}
		},

		getDefaultProps: function() {
			return {
				normalizeStyle: true,
				stopChangePropagation: true,

				//makes 15:78 be converted to 15:00, and not to 16:18
				strict: true,
				overflowHourToMeridian: true,

				step: 1,
				hourStep: null,
				minuteStep: null,
				secondStep: null,

				stepDelay: 60,
				showArrows: true,

				defaultStyle: {
					border: '1px solid gray',
					padding: 10,
					display: 'inline-flex',
					alignItems: 'center',
					boxSizing: 'border-box',
					flexFlow: 'row',
					width: 200
				},

				defaultArrowStyle: {
					cursor: 'pointer',
					userSelect: 'none',
					display: 'inline-block',
					alignSelf: 'stretch',
					textAlign: 'center'
				},

				defaultArrowOverStyle: {
					background: 'rgb(229, 229, 229)'
				},

				defaultArrowUpOverStyle: null,
				defaultArrowDownOverStyle: null,

				defaultArrowUpStyle: {
					marginBottom: 5
				},

				defaultArrowDownStyle: {
					marginTop: 5
				},

				defaultBoxStyle: {
					boxSizing : 'border-box',
					display   : 'flex',
					flexFlow  : 'column',
					alignItems: 'center'
				},

				defaultInputStyle: {
					boxSizing: 'border-box',
					width    : '100%',
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

				// format: 'HHmmssa',
				renderHour: null,
				renderMinute: null,
				renderSecond: null,
				renderMeridian: null,

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

				timeToString: formatTime
			}
		},

		normalize: function(style) {
			return normalize(style)
		},

		render: function(){
			var props = this.prepareProps(this.props, this.state)

			if (!props.normalizeStyle){
				this.normalize = identity
			}

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

		onArrowMouseEnter: function(props, dir, name, event) {
			var overArrow = this.state.overArrow

			Object.keys(overArrow).forEach(function(key){
				overArrow[key] = null
			})

			overArrow[name] = dir

			this.setState({})
		},

		onArrowMouseLeave: function(props, dir, name, event) {
			this.state.overArrow[name] = null

			this.setState({})
		},

		onArrowMouseDown: function(props, dir, name, event){

			if (name == 'meridian'){
				this.onArrowMeridianAction(props, dir, name)
				return
			}

			var target = hasTouch?
			                event.target:
			                window
			var eventName = hasTouch?
								'touchend':
								'click'

			target.addEventListener(eventName, this.onWindowClick)

			this.onArrowAction(props, dir, name)

			this.timeoutId = setTimeout(function(){
				this.startInterval(props, dir, name)
			}.bind(this), props.stepDelay)
		},

		onWindowClick: function(){
			this.stopInterval()
		},

		stopInterval: function(){
			clearTimeout(this.timeoutId)
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

			// this.setValue(time)
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

			;(this.props.onChange || emptyFn)(this.props.timeToString(time, this.props.format), assign({}, time))
		},

		format: function(props, name, value){
			var renderFn

			if (arguments.length < 3){
				value = props.time[name]
			}

			if (name != 'meridian'){
				renderFn = props['render' + toUpperFirst(name)]
			} else {
				renderFn = props.renderMeridian
			}

			if (!renderFn && typeof props.format == 'string'){
				var formatInfo = this.formatInfo
				renderFn = function(value, name){
					return format(name, value, formatInfo)
				}
			}

			if (!renderFn){
				renderFn = twoDigits
			}

			if (typeof renderFn == 'function'){
				value = renderFn(value, name, props)
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
				var overArrow = this.state.overArrow[name]

				var arrowUpStyle = props.arrowUpStyle

				if (overArrow == 1){
					arrowUpStyle = assign({},
										props.arrowUpStyle,
										props.defaultArrowOverStyle,
										props.defaultArrowUpOverStyle,
										props.arrowOverStyle,
										props.arrowUpOverStyle
									)
				}

				var arrowUpProps = {
					mouseOver: overArrow == 1,
					style    : arrowUpStyle,
					children : '▲'
				}

				arrowUpProps[EVENT_NAMES.onMouseDown] = this.onArrowMouseDown.bind(this, props, 1, name)
				arrowUpProps.onMouseEnter = this.onArrowMouseEnter.bind(this, props, 1, name)
				arrowUpProps.onMouseLeave = this.onArrowMouseLeave.bind(this, props, 1, name)

				var arrowDownStyle = props.arrowDownStyle

				if (overArrow == -1){
					arrowDownStyle = assign({},
										props.arrowDownStyle,
										props.defaultArrowOverStyle,
										props.defaultArrowDownOverStyle,
										props.arrowOverStyle,
										props.arrowDownOverStyle
									)
				}

				var arrowDownProps = {
					mouseOver: overArrow == -1,
					style    : arrowDownStyle,
					children : '▼'
				}

				arrowDownProps[EVENT_NAMES.onMouseDown] = this.onArrowMouseDown.bind(this, props, -1, name)
				arrowDownProps.onMouseEnter = this.onArrowMouseEnter.bind(this, props, -1, name)
				arrowDownProps.onMouseLeave = this.onArrowMouseLeave.bind(this, props, -1, name)

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
			var inputProps        = props[name + 'InputProps']

			var inputProps = assign({}, props.inputProps, defaultInputProps, inputProps, {
				timeName: name,
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

			this.stopInterval()

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
			var strict = this.props.strict

			var formatInfo = this.formatInfo = getFormatInfo(this.props.format)

			return parseTime(this.getValue(), {
				strict: strict,

				hour    : formatInfo.hour,
				minute  : formatInfo.minute,
				second  : formatInfo.second,
				meridian: formatInfo.meridian
			})
		},

		prepareTime: function(props, state) {
			var timeValue  = this.getTime()
			var formatInfo = this.props.format?
								this.formatInfo:
								null

			props.showSecond = formatInfo?
									formatInfo.second.specified:
									timeValue.second !== undefined

			props.showMinute = formatInfo?
									formatInfo.minute.specified:
									timeValue.minute !== undefined

			props.withMeridian = formatInfo?
									formatInfo.meridian.specified:
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
			return this.normalize(assign({}, props.defaultStyle, props.style))
		},

		prepareSeparatorStyle: function(props, state) {
			return this.normalize(assign({}, props.defaultSeparatorStyle, props.separatorStyle))
		},

		prepareArrowStyles: function(props, state) {
			props.arrowUpStyle = this.normalize(assign({}, props.defaultArrowStyle, props.defaultArrowUpStyle, props.arrowStyle, props.arrowUpStyle))
			props.arrowDownStyle = this.normalize(assign({}, props.defaultArrowStyle, props.defaultArrowDownStyle, props.arrowStyle, props.arrowDownStyle))
		},

		prepareHourStyles: function(props, state) {
			props.hourStyle = this.prepareHourStyle(props, state)
			props.hourInputStyle = this.prepareHourInputStyle(props, state)
		},

		prepareHourStyle: function(props, state) {
			return this.normalize(assign({}, props.defaultBoxStyle, props.defaultHourStyle, props.boxStyle, props.hourStyle))
		},

		prepareHourInputStyle: function(props, state) {
			return this.normalize(assign({}, props.defaultInputStyle, props.defaultHourInputStyle, props.inputStyle, props.hourInputStyle))
		},

		prepareMinuteStyles: function(props, state) {
			props.minuteStyle = this.prepareMinuteStyle(props, state)
			props.minuteInputStyle = this.prepareMinuteInputStyle(props, state)
		},

		prepareMinuteStyle: function(props, state) {
			return this.normalize(assign({}, props.defaultBoxStyle, props.defaultMinuteStyle, props.boxStyle, props.minuteStyle))
		},

		prepareMinuteInputStyle: function(props, state) {
			return this.normalize(assign({}, props.defaultInputStyle, props.defaultMinuteInputStyle, props.inputStyle, props.minuteInputStyle))
		},

		prepareSecondStyles: function(props, state) {
			if (props.showSecond){
				props.secondStyle = this.prepareSecondStyle(props, state)
				props.secondInputStyle = this.prepareSecondInputStyle(props, state)
			}
		},

		prepareSecondStyle: function(props, state) {
			return this.normalize(assign({}, props.defaultBoxStyle, props.defaultSecondStyle, props.boxStyle, props.secondStyle))
		},

		prepareSecondInputStyle: function(props, state) {
			return this.normalize(assign({}, props.defaultInputStyle, props.defaultSecondInputStyle, props.inputStyle, props.secondInputStyle))
		},

		prepareMeridianStyles: function(props, state){
			if (props.withMeridian){
				props.meridianStyle = this.prepareMeridianStyle(props, state)
				props.meridianInputStyle = this.prepareMeridianInputStyle(props, state)
			}
		},

		prepareMeridianStyle: function(props, state) {
			return this.normalize(assign({}, props.defaultBoxStyle, props.defaultMeridianStyle, props.boxStyle, props.meridianStyle))
		},

		prepareMeridianInputStyle: function(props, state) {
			return this.normalize(assign({}, props.defaultInputStyle, props.defaultMeridianInputStyle, props.inputStyle, props.meridianInputStyle))
		}
	})

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/home/radu/pages/react-time-picker/node_modules/css-loader/index.js!/home/radu/pages/react-time-picker/node_modules/stylus-loader/index.js!/home/radu/pages/react-time-picker/index.styl", function() {
			var newContent = require("!!/home/radu/pages/react-time-picker/node_modules/css-loader/index.js!/home/radu/pages/react-time-picker/node_modules/stylus-loader/index.js!/home/radu/pages/react-time-picker/index.styl");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	__webpack_require__(24)(exports, __webpack_require__(22), "");
	exports.push([module.id, "\nbody * {\n  box-sizing: border-box;\n}\n", ""]);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var parseTime      = __webpack_require__(17)
	var adjustOverflow = parseTime.adjustOverflow

	var defaults = {}

	function onInvalid(timeValue, config){

		timeValue.invalid.forEach(function(info){

			var name  = info.name
			var value = info.value * 1

			if (!isNaN(value)){
				timeValue[name] = value
			}
		})

		return adjustOverflow(timeValue, config)
	}

	module.exports = function(value, config){

		config = config || defaults

		value = value || ''

		if (typeof value == 'string'){
			value = parseTime(value, config)
		}

		var definedParts = {}

		if (value){

			config.withMeridian = value.meridian != null

			if (value.invalid){
				value.invalid.forEach(function(info){
					definedParts[info.name] = true
				})
			}

			if (!config.strict && value.invalid){
				value = onInvalid(value, config)
			}

			if (definedParts.hour){
				value.hour = value.hour || 0
			}

			if (definedParts.minute){
				value.minute = value.minute || 0
			}

			if (definedParts.second){
				value.second = value.second || 0
			}

			// value.hour   = value.hour || 0
			// value.minute = value.minute || 0
			// value.second = value.second || 0

			if (config.strict && value.meridian && value.hour === 12){
				if (value.minute !== undefined){
					value.minute = 0
				}
				if (value.second !== undefined){
					value.second = 0
				}
			}
		}

		var result = {
			hour  : value.hour
		}
		if (value.minute !== undefined){
			result.minute = value.minute
		}
		if (value.second !== undefined){
			result.second = value.second
		}

		if (config.withMeridian){
			result.meridian = value.meridian
		}

		return result
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var update = __webpack_require__(17).updateTime

	module.exports = function(time, name, value, config){
		time = update(time, name, value, config)

		return time
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(str){
		return str?
				str.charAt(0).toUpperCase() + str.slice(1):
				''
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	module.exports = function twoDigits(value){
		return value < 10?
				'0' + value:
				value
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

		function getHourInfo(format, value){
			var len = 1
			var specified = false

			var index = format.indexOf('h')

			if (~index){
				specified = true
				if (format.charAt(index + 1) == 'h'){
					len++
				}
			} else {
				index = format.indexOf('H')
				if (~index){
					specified = true
					if (format.charAt(index + 1) == 'H'){
						len++
					}
				}
			}

			return {
				len: len,
				specified: specified
			}
		}

		function getMinuteInfo(format, value){
			var len = 1
			var specified = false
			var index = format.indexOf('m')

			if (~index){
				specified =  true
				if (format.charAt(index+1) == 'm'){
					len++
				}
			}

			return {
				len: len,
				specified: specified
			}
		}

		function getSecondInfo(format, value){
			var len = 1
			var specified = false
			var index = format.indexOf('s')

			if (~index){
				specified = true
				if (format.charAt(index+1) == 's'){
					len++
				}
			}

			return {
				len: len,
				specified: specified
			}
		}

		function isMeridianUpperCase(format, value){
			var uppercase = true
			var specified = false
			var index = format.indexOf('a')

			if (~index){
				specified = true
				uppercase = false
			} else if (~format.indexOf('A')){
				specified = true
			}

			return {
				uppercase: uppercase,
				lowercase: !uppercase,
				specified: specified
			}
		}

	module.exports = function(format){

		if (typeof format != 'string'){
			return {
				hour    : {specified: false},
				minute  : {specified: false},
				second  : {specified: false},
				meridian: {specified: false}
			}
		}

		return {
			hour    : getHourInfo(format),
			minute  : getMinuteInfo(format),
			second  : getSecondInfo(format),
			meridian: isMeridianUpperCase(format)
		}
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var twoDigits     = __webpack_require__(9)
	var getFormatInfo = __webpack_require__(10)

	module.exports = function(name, value, formatOrInfo){

		var formatInfo = formatOrInfo

		if (!formatInfo || !formatInfo.hour || typeof formatInfo == 'string'){
			formatInfo = getFormatInfo(formatInfo)
		}

		if (!formatInfo){
			return
		}

		var info = formatInfo[name]

		if (value && name === 'meridian' && info.specified){
			return info.uppercase? value.toUpperCase(): value.toLowerCase()
		}

		return info.specified?
					info.len == 2?
						twoDigits(value):
						value
					:
					''
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var twoDigits      = __webpack_require__(9)
	var getFormatInfo  = __webpack_require__(10)
	var formatFunction = __webpack_require__(11)

	function identity(x){
		return x
	}

	module.exports = function(time, format){

		var hourFormat     = twoDigits
		var minuteFormat   = twoDigits
		var secondFormat   = twoDigits
		var meridianFormat = identity

		if (format){
			var formatInfo = typeof format == 'string'? getFormatInfo(format): format

			if (formatInfo.hour.specified){
				hourFormat = function(){
					return formatFunction('hour', time.hour, formatInfo)
				}
			}

			if (formatInfo.minute.specified){
				minuteFormat = function(){
					return formatFunction('minute', time.minute, formatInfo)
				}
			}

			if (formatInfo.second.specified){
				secondFormat = function(){
					return formatFunction('second', time.second, formatInfo)
				}
			}

			if (formatInfo.meridian.specified){
				meridianFormat = function(){
					return formatFunction('meridian', time.meridian, formatInfo)
				}
			}
		}

		var result = []

		if (time.hour != null){
			result.push(hourFormat(time.hour))
		}

		if (time.minute != null){
		 	result.push(minuteFormat(time.minute))
		}

		if (time.second != null){
			result.push(secondFormat(time.second))
		}

		var str = result.join(':')

		if (time.meridian){
			str += ' ' + meridianFormat(time.meridian)
		}

		return str
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = 'ontouchstart' in global || (global.DocumentTouch && document instanceof DocumentTouch)
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(14)?
		{
			onMouseDown: 'onTouchStart',
			onMouseUp  : 'onTouchEnd',
			onMouseMove: 'onTouchMove'
		}:
		{
			onMouseDown: 'onMouseDown',
			onMouseUp  : 'onMouseUp',
			onMouseMove: 'onMouseMove'
		}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasOwn      = __webpack_require__(18)
	var getPrefixed = __webpack_require__(19)

	var map      = __webpack_require__(20)
	var plugable = __webpack_require__(21)

	function plugins(key, value){

		var result = {
			key  : key,
			value: value
		}

		;(RESULT.plugins || []).forEach(function(fn){

			var tmp = map(function(res){
				return fn(key, value, res)
			}, result)

			if (tmp){
				result = tmp
			}
		})

		return result
	}

	function normalize(key, value){

		var result = plugins(key, value)

		return map(function(result){
			return {
				key  : getPrefixed(result.key, result.value),
				value: result.value
			}
		}, result)

		return result
	}

	var RESULT = function(style){

		var k
		var item
		var result = {}

		for (k in style) if (hasOwn(style, k)){
			item = normalize(k, style[k])

			if (!item){
				continue
			}

			map(function(item){
				result[item.key] = item.value
			}, item)
		}

		return result
	}

	module.exports = plugable(RESULT)

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign = __webpack_require__(13)
	var defaults = __webpack_require__(25)

	function trim(str){
		return str.trim()
	}

	var validHour     = __webpack_require__(26)
	var validMinute   = __webpack_require__(27)
	var validSecond   = __webpack_require__(28)
	var validMeridian = __webpack_require__(29)

	function getHour(value, config){
		if (validHour(value, assign({}, config, config.hour))){
			return value * 1
		}
	}

	function getMinute(value, config){
		if (validMinute(value, assign({}, config, config.minute))){
			return value * 1
		}
	}

	function getSecond(value, config){
		if (validSecond(value, assign({}, config, config.second))){
			return value * 1
		}
	}

	function getMeridian(value, config){
		if (validMeridian(value, assign({}, config, config.meridian))){
			return value
		}
	}

	function hasMeridian(str){
		var parts = str.split(' ')

		return parts.length > 1
	}

	var GET_MAP = {
		hour    : getHour,
		minute  : getMinute,
		second  : getSecond,
		meridian: getMeridian
	}

	function get(name){
		return GET_MAP[name]
	}

	function parseLast(str, partName, config){
		config = assign({}, config, config? config[partName]: null)

		var withMeridian = config.meridian

		var parts = str.split(' ').map(trim)
		var getFn = get(partName)
		var result = {
			invalid: []
		}

		var partValue
		var meridian

		if (isValidPart(partName, parts[0], config)){
			if (getFn){
				partValue = getFn(parts[0], config)
			}
		} else {
			result.invalid.push({
				name: partName,
				value: parts[0]
			})
		}

		if (withMeridian){
			meridian = getMeridian(parts[1], config)

			if (meridian === undefined){
				result.invalid.push({
					name: 'meridian',
					value: parts[1]
				})
			}
		}

		if (meridian !== undefined){
			result.meridian = meridian
		}
		if (partValue !== undefined){
			result[partName] = partValue
		}

		return result
	}

	function PARSE(time, config){

		config = assign({}, defaults, config)

		var parts        = time.split(config.separator).map(trim)
		var withMeridian = hasMeridian(parts[parts.length - 1])

		config.meridian = withMeridian

		var invalids = []
		var result = {}
		var hour
		var minute

		if (parts.length > 3){
			return
		}

		if (parts.length == 1){
			//hh am
			assign(result, parseLast(parts[0], 'hour', config))
		}
		if (parts.length == 2){
			//hh:mm am
			hour = getHour(parts[0], config)
			if (hour === undefined){
				invalids.push({
					name: 'hour',
					value: parts[0]
				})
			}
			assign(result, parseLast(parts[1], 'minute', config))
		}
		if (parts.length == 3){
			//hh:mm:ss am
			hour   = getHour(parts[0], config)
			minute = getMinute(parts[1], config)

			if (hour === undefined){
				invalids.push({
					name: 'hour',
					value: parts[0]
				})
			}

			if (minute === undefined){
				invalids.push({
					name: 'minute',
					value: parts[1]
				})
			}

			assign(result, parseLast(parts[2], 'second', config))
		}

		if (result.invalid){
			invalids.push.apply(invalids, result.invalid)
			result.invalid = invalids
		}

		if (hour !== undefined){
			result.hour = hour
		}

		if (minute !== undefined){
			result.minute = minute
		}

		if (!result.invalid.length){
			delete result.invalid
		}

		return result
	}

	var isValidPart = __webpack_require__(30)
	var isValidTime = __webpack_require__(31)
	var updateTime  = __webpack_require__(32)
	var adjustOverflow  = __webpack_require__(33)

	PARSE.isValidPart    = isValidPart
	PARSE.isValidTime    = isValidTime
	PARSE.updateTime     = updateTime
	PARSE.adjustOverflow = adjustOverflow

	module.exports = PARSE

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(obj, prop){
		return Object.prototype.hasOwnProperty.call(obj, prop)
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getStylePrefixed = __webpack_require__(34)
	var properties       = __webpack_require__(35)

	module.exports = function(key, value){

		if (!properties[key]){
			return key
		}

		return getStylePrefixed(key, value)
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(fn, item){

		if (!item){
			return
		}

		if (Array.isArray(item)){
			return item.map(fn).filter(function(x){
				return !!x
			})
		} else {
			return fn(item)
		}
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getCssPrefixedValue = __webpack_require__(36)

	module.exports = function(target){
		target.plugins = target.plugins || [
			(function(){
				var values = {
					'flex':1,
					'inline-flex':1
				}

				return function(key, value){
					if (key === 'display' && value in values){
						return {
							key  : key,
							value: getCssPrefixedValue(key, value)
						}
					}
				}
			})()
		]

		target.plugin = function(fn){
			target.plugins = target.plugins || []

			target.plugins.push(fn)
		}

		return target
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	exports.push([module.id, "/*! normalize.css v3.0.2 | MIT License | git.io/normalize */\n\n/**\n * 1. Set default font family to sans-serif.\n * 2. Prevent iOS text size adjust after orientation change, without disabling\n *    user zoom.\n */\n\nhtml {\n  font-family: sans-serif; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/**\n * Remove default margin.\n */\n\nbody {\n  margin: 0;\n}\n\n/* HTML5 display definitions\n   ========================================================================== */\n\n/**\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\n * and Firefox.\n * Correct `block` display not defined for `main` in IE 11.\n */\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\n\n/**\n * 1. Correct `inline-block` display not defined in IE 8/9.\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\n */\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Prevent modern browsers from displaying `audio` without controls.\n * Remove excess height in iOS 5 devices.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Address `[hidden]` styling not present in IE 8/9/10.\n * Hide the `template` element in IE 8/9/11, Safari, and Firefox < 22.\n */\n\n[hidden],\ntemplate {\n  display: none;\n}\n\n/* Links\n   ========================================================================== */\n\n/**\n * Remove the gray background color from active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * Improve readability when focused and also mouse hovered in all browsers.\n */\n\na:active,\na:hover {\n  outline: 0;\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\n */\n\nabbr[title] {\n  border-bottom: 1px dotted;\n}\n\n/**\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\n */\n\nb,\nstrong {\n  font-weight: bold;\n}\n\n/**\n * Address styling not present in Safari and Chrome.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Address variable `h1` font-size and margin within `section` and `article`\n * contexts in Firefox 4+, Safari, and Chrome.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/**\n * Address styling not present in IE 8/9.\n */\n\nmark {\n  background: #ff0;\n  color: #000;\n}\n\n/**\n * Address inconsistent and variable font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsup {\n  top: -0.5em;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove border when inside `a` element in IE 8/9/10.\n */\n\nimg {\n  border: 0;\n}\n\n/**\n * Correct overflow not hidden in IE 9/10/11.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Address margin not present in IE 8/9 and Safari.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * Address differences between Firefox and other browsers.\n */\n\nhr {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n  height: 0;\n}\n\n/**\n * Contain overflow in all browsers.\n */\n\npre {\n  overflow: auto;\n}\n\n/**\n * Address odd `em`-unit font size rendering in all browsers.\n */\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\n * styling of `select`, unless a `border` property is set.\n */\n\n/**\n * 1. Correct color not being inherited.\n *    Known issue: affects color of disabled elements.\n * 2. Correct font properties not being inherited.\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit; /* 1 */\n  font: inherit; /* 2 */\n  margin: 0; /* 3 */\n}\n\n/**\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\n */\n\nbutton {\n  overflow: visible;\n}\n\n/**\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\n * All other form control elements do not inherit `text-transform` values.\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\n * Correct `select` style inheritance in Firefox.\n */\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/**\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n *    and `video` controls.\n * 2. Correct inability to style clickable `input` types in iOS.\n * 3. Improve usability and consistency of cursor style between image-type\n *    `input` and others.\n */\n\nbutton,\nhtml input[type=\"button\"], /* 1 */\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n  cursor: pointer; /* 3 */\n}\n\n/**\n * Re-set default cursor for disabled elements.\n */\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default;\n}\n\n/**\n * Remove inner padding and border in Firefox 4+.\n */\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\n\n/**\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\n * the UA stylesheet.\n */\n\ninput {\n  line-height: normal;\n}\n\n/**\n * It's recommended that you don't attempt to style these elements.\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\n *\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\n * 2. Remove excess padding in IE 8/9/10.\n */\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\n * `font-size` values of the `input`, it causes the cursor style of the\n * decrement button to change from `default` to `text`.\n */\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome\n *    (include `-moz` to future-proof).\n */\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  -moz-box-sizing: content-box;\n  -webkit-box-sizing: content-box; /* 2 */\n  box-sizing: content-box;\n}\n\n/**\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\n * Safari (but not Chrome) clips the cancel button when the search input has\n * padding (and `textfield` appearance).\n */\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * Define consistent border, margin, and padding.\n */\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\n\n/**\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\n */\n\nlegend {\n  border: 0; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Remove default vertical scrollbar in IE 8/9/10/11.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * Don't inherit the `font-weight` (applied by a rule above).\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\n */\n\noptgroup {\n  font-weight: bold;\n}\n\n/* Tables\n   ========================================================================== */\n\n/**\n * Remove most spacing between table cells.\n */\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\ntd,\nth {\n  padding: 0;\n}\n", ""]);

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(list, importedList, media) {
		for(var i = 0; i < importedList.length; i++) {
			var item = importedList[i];
			if(media && !item[2])
				item[2] = media;
			else if(media) {
				item[2] = "(" + item[2] + ") and (" + media + ")";
			}
			list.push(item);
		}
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
		separator: ':',
		twoDigits: true
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var validNumber = __webpack_require__(37)
	var assign      = __webpack_require__(13)

	module.exports = function validHour(value, config){
		config = assign({}, config)

		config.twoDigits = config.len == 2

		var meridian = config.meridian

		if (validNumber(value, config)){
			value *= 1

			if (meridian){
				return 0 <= value && value <= 12
			}

			return 0 <= value && value < 24
		}

		return false
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var validNumber = __webpack_require__(37)
	var assign      = __webpack_require__(13)

	module.exports = function validMinute(value, config){

		config = assign({}, config)
		config.twoDigits = config.len == 2

		if (validNumber(value, config)){
			value *= 1

			return 0 <= value && value < 60
		}

		return false
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var validMinute = __webpack_require__(27)
	var assign      = __webpack_require__(13)

	module.exports = function validSecond(value, config){
		config = assign({}, config)
		config.twoDigits = config.len == 2

		return validMinute(value, config)
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function validMeridian(value){
		if (!value){
			return false
		}

		value = value.toUpperCase()

		return value == 'AM' || value == 'PM'
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var validHour     = __webpack_require__(26)
	var validMinute   = __webpack_require__(27)
	var validSecond   = __webpack_require__(28)
	var validMeridian = __webpack_require__(29)

	var VALIDATION_MAP = {
		hour    : validHour,
		minute  : validMinute,
		second  : validSecond,
		meridian: validMeridian
	}

	/**
	 * VALIDATES TIME PART [name, value] eg ['hour', '15']
	 *
	 * Returns whether the given value is valid for the given time part.
	 *
	 * EG:
	 * 	name: 'hour', value: 15 => true
	 * 	name: 'hour', value: '07' => true
	 *  name: 'hour', value: 15, config={meridian: true} => false
	 *
	 *  name: 'minute', value: '05' => true
	 *
	 *  name: 'second', value: 55 => true
	 *  name: 'second', value: 5 => true
	 *  name: 'second', value: '5' => false (string without two digits)
	 *  name: 'second', value: '5', {twoDigits: false} => true

	 *  name: 'meridian', value: 'PM' => true
	 *  name: 'meridian', value: 'am' => true
	 *  name: 'meridian', value: 'apm' => false
	 *
	 * @param {String} name
	 * @param {Number/String} value
	 * @param {Object} config
	 * @param {Boolean} config.meridian
	 * @param {Boolean} config.twoDigits
	 *
	 * @return {Boolean}
	 */
	module.exports = function isValidPart(name, value, config){
		var fn = VALIDATION_MAP[name]

		return !!(fn && fn(value, config))
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isValidPart = __webpack_require__(30)
	var assign = __webpack_require__(13)

	module.exports = function isValidTime(time, config){

		var validSecond = time.second === undefined || isValidPart('second', time.second, config)

		var validMinute = validSecond && (time.minute === undefined || isValidPart('minute', time.minute, config))
		var validHour   = validMinute && isValidPart('hour', time.hour, assign({meridian: time.meridian}, config))

		var meridian      = time.meridian
		var validMeridian = validHour && (meridian? isValidPart('meridian', meridian, config): true)

		var valid = validMeridian
		if (valid && meridian){
			//for 24 hour clock, we're done
			//BUT there is a special case when we have meridian specified:
			//12:00:00 am/pm is ok, but >= 12:00:01 is not
			var hour = time.hour * 1
			if (hour === 12){
				valid = time.minute * 1 === 0 && time.second * 1 === 0
			}
		}

		return valid
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign      = __webpack_require__(13)
	var isValidNumber = __webpack_require__(37)
	var isValidPart = __webpack_require__(30)
	var isValidTime = __webpack_require__(31)
	var adjustOverflow = __webpack_require__(33)

	var clamp = __webpack_require__(38)

	/**
	 * @param {Object} time
	 * @param {String} name
	 * @param {String/Number} value
	 * @param {Object} [config]
	 * @param {Boolean} [config.clamp=false]
	 * @param {Boolean} [config.overflow=true]
	 * @param {Boolean} [config.rejectInvalid=false]
	 *
	 * @return {Object} time
	 */

	module.exports = function update(time, name, value, config){

		var initial = time
		var touched
		var validNumber = isValidNumber(value, config)
		var validPart   = isValidPart(name, value, config)

		time   = assign({}, time)
		config = config || {}

		if (validNumber){
			value *= 1
		}

		if (validPart || validNumber){
			time[name] = value
		}

		if (!isValidTime(time, config) && config.clamp){
			time[name] = clamp(time, name, time[name])
		}

		if (!isValidTime(time, config)){

			if (config.rejectInvalid){
				return initial
			}

			if (config.overflow !== false){
				time = adjustOverflow(time, config)
			}
		}

		return time
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * See documentation below
	 */

	var defaults = {}

	var MAP = {
		hour: overflowHour,
		minute: overflowMinute,
		second: overflowSecond
	}

	function overflowHour(values, name, value, config){
		if (values.hour === undefined){
			return
		}

		var overflowHourToMeridian = !config || config.overflowHourToMeridian !== false
		var meridian = values.meridian || config && config.meridian === true
		var limit    = meridian? 12: 23
		var plusOne  = meridian? 12: 24

		var extra = 0

		if (value > limit){
			extra += Math.floor(value / limit)
			value = value % plusOne
		}
		if (value < 0){
			extra = Math.ceil(-value / limit)
			value = plusOne + value
		}

		if (meridian && value === limit && (values.minute > 0 || values.second > 0)){
			extra += 1
			value = 0
		}

		if (meridian && extra % 2 == 1 && overflowHourToMeridian){
			if (typeof meridian == 'string'){
				meridian = meridian.toUpperCase()
			}

			//change meridian
			values.meridian = meridian == 'PM'? 'AM': 'PM'
		}

		values.hour = value
	}

	function overflowMinuteOrSecond(values, name, value, config, nextName){

		if (values[name] === undefined){
			return
		}

		var extra = 0

		if (value > 59){
			extra += Math.floor(value / 60)
			value = value % 60
		}
		if (value < 0){
			extra -= Math.ceil(-value / 60)
			value = 60 + value
		}

		values[name || 'minute'] = value

		if (extra){
			values[nextName || 'hour'] += extra
		}
	}

	function overflowMinute(values, name, value, config){
		overflowMinuteOrSecond(values, 'minute', values.minute, config) // minute -> hour
		overflowHour(values, 'hour', values.hour, config) //overflow hour
	}

	function overflowSecond(values, name, value, config){
		overflowMinuteOrSecond(values, 'second', values.second, config, 'minute') //second -> minute
		overflowMinute(values, 'minute', values.minute, config) //minute -> hour
	}

	/**
	 *
	 * This method receives an object with hour, minute and second properties.
	 * It adjusts any overflowing values and moves the overflow to the next value:
	 *
	 * EG: extra seconds go to minute; extra minutes go to hour;
	 * hours beyond 23 (in 24 hour format, so without values.meridian specified) restart from 0,
	 * or beyond 12:00:00 (when meridian is specified) restart from 0
	 *
	 * @param  {Object} values [description]
	 * @param  {Number} values.hour
	 * @param  {Number} values.minute
	 * @param  {Number} values.second
	 * @param  {Number} values.meridian
	 *
	 * @param  {String} [name="second"]   "hour"|"minute"|"second"
	 * @param  {Number} [value]
	 * @param  {Object} config
	 *
	 * Both {name} and {value} are optional. If not given, they default to "second" and value for second.
	 *
	 * @return {Object}
	 */
	module.exports = function(values, name, value, config){

		if (arguments.length == 2){
			config = name
			name   = 'second'
			value  = values[name]
		}

		MAP[name](values, name, value, config || defaults)

		return values
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(39)
	var getPrefix    = __webpack_require__(40)
	var el           = __webpack_require__(41)

	var MEMORY = {}
	var STYLE
	var ELEMENT

	module.exports = function(key, value){

	    ELEMENT = ELEMENT || el()
	    STYLE   = STYLE   || ELEMENT.style

	    var k = key// + ': ' + value

	    if (MEMORY[k]){
	        return MEMORY[k]
	    }

	    var prefix
	    var prefixed

	    if (!(key in STYLE)){//we have to prefix

	        prefix = getPrefix('appearance')

	        if (prefix){
	            prefixed = prefix + toUpperFirst(key)

	            if (prefixed in STYLE){
	                key = prefixed
	            }
	        }
	    }

	    MEMORY[k] = key

	    return key
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = {
	  'alignItems': 1,
	  'justifyContent': 1,
	  'flex': 1,
	  'flexFlow': 1,

	  'userSelect': 1,
	  'transform': 1,
	  'transition': 1,
	  'transformOrigin': 1,
	  'transformStyle': 1,
	  'transitionProperty': 1,
	  'transitionDuration': 1,
	  'transitionTimingFunction': 1,
	  'transitionDelay': 1,
	  'borderImage': 1,
	  'borderImageSlice': 1,
	  'boxShadow': 1,
	  'backgroundClip': 1,
	  'backfaceVisibility': 1,
	  'perspective': 1,
	  'perspectiveOrigin': 1,
	  'animation': 1,
	  'animationDuration': 1,
	  'animationName': 1,
	  'animationDelay': 1,
	  'animationDirection': 1,
	  'animationIterationCount': 1,
	  'animationTimingFunction': 1,
	  'animationPlayState': 1,
	  'animationFillMode': 1,
	  'appearance': 1
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getPrefix     = __webpack_require__(40)
	var forcePrefixed = __webpack_require__(42)
	var el            = __webpack_require__(41)

	var MEMORY = {}
	var STYLE
	var ELEMENT

	module.exports = function(key, value){

	    ELEMENT = ELEMENT || el()
	    STYLE   = STYLE   ||  ELEMENT.style

	    var k = key + ': ' + value

	    if (MEMORY[k]){
	        return MEMORY[k]
	    }

	    var prefix
	    var prefixed
	    var prefixedValue

	    if (!(key in STYLE)){

	        prefix = getPrefix('appearance')

	        if (prefix){
	            prefixed = forcePrefixed(key, value)

	            prefixedValue = '-' + prefix.toLowerCase() + '-' + value

	            if (prefixed in STYLE){
	                ELEMENT.style[prefixed] = ''
	                ELEMENT.style[prefixed] = prefixedValue

	                if (ELEMENT.style[prefixed] !== ''){
	                    value = prefixedValue
	                }
	            }
	        }
	    }

	    MEMORY[k] = value

	    return value
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign   = __webpack_require__(13)
	var defaults = __webpack_require__(25)

	module.exports = function validNumber(n, config){
		var valid = !isNaN(n * 1)

		if (config){
			config = assign({}, defaults, config)
		} else {
			config = defaults
		}

		if (valid && typeof n == 'string' && config.twoDigits){
			valid = n.length == 2
		}

		if (valid){
			n = n * 1
			valid = parseInt(n) === n
		}

		return valid
	}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function clamp(time, name, value){
		if (name == 'meridian'){
			return value
		}
		if (name == 'hour'){
			var limit = 24

			if (time.meridian){
				limit = (time.hour || time.minute)? 11: 12
			}

			return value < 0?
					0:
					value > limit?
						limit:
						value
		}

		return value < 0?
					0:
					value > 59?
						59:
						value
	}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(str){
		return str?
				str.charAt(0).toUpperCase() + str.slice(1):
				''
	}

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(39)
	var prefixes     = ["ms", "Moz", "Webkit", "O"]

	var el = __webpack_require__(41)

	var ELEMENT
	var PREFIX

	module.exports = function(key){

		if (PREFIX !== undefined){
			return PREFIX
		}

		ELEMENT = ELEMENT || el()

		var i = 0
		var len = prefixes.length
		var tmp
		var prefix

		for (; i < len; i++){
			prefix = prefixes[i]
			tmp = prefix + toUpperFirst(key)

			if (typeof ELEMENT.style[tmp] != 'undefined'){
				return PREFIX = prefix
			}
		}

		return PREFIX
	}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var el

	module.exports = function(){

		if(!el && !!global.document){
		  	el = global.document.createElement('div')
		}

		if (!el){
			el = {style: {}}
		}

		return el
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toUpperFirst = __webpack_require__(39)
	var getPrefix    = __webpack_require__(40)
	var properties   = __webpack_require__(35)

	/**
	 * Returns the given key prefixed, if the property is found in the prefixProps map.
	 *
	 * Does not test if the property supports the given value unprefixed.
	 * If you need this, use './getPrefixed' instead
	 */
	module.exports = function(key, value){

		if (!properties[key]){
			return key
		}

		var prefix = getPrefix(key)

		return prefix?
					prefix + toUpperFirst(key):
					key
	}

/***/ }
/******/ ])
});
;