# react-time-picker

> A carefully crafted time picker for React

## Install


```sh
$ npm install react-time-picker --save
```

## Demo

See [time picker demo](http://zippyui.github.io/react-time-picker/)

## Usage

```jsx
var TimePicker = require('./src')

var VALUE = '14:00:01'

var onChange = function(value){
    picker.setProps({value: value})
}

var picker = React.render(
    <TimePicker
        value={VALUE}
        onChange={onChange}
    />,
    document.getElementById('content')
)
```

For uncontrolled behavior, use `defaultValue` instead of `value`

The time picker can also be used on touch devices.

## Properties

 * value: String - a time value - for controlled behavior
 * defaultValue: String - a time value - for uncontrolled behavior
 * onChange: Function(string) - function to be called on change

### Formatting

The time picker can display time in multiple formats. For example, you can show hour, hour & minute, hour & minute & second, and all of these with or without AM/PM.

You can specify a format to decide which parts of the time picker to display

 * format: String - a format that dictates which parts of the time picker are displayed.
 	Valid parts are:

 	 * H or HH - for hour and double digit hour
 	 * m or mm - for minute and double digit minute
 	 * s or ss - for second and double digit second
 	 * a or A  - for meridian display

So you can decide what to display either by specifying a `format` or just use the appropriate formatting on the `value` you provide.

#### Examples

 * If you want to display only hour & minute, specify a value string with hour and minute (eg: 16:03)
 * If you want to display hour, minute & second, specify eg 16:45:21
 * If you want to display AM/PM, specify an hour format that contains AM/PM eg 10:45 PM

#### Overflowing

By default when minutes/seconds are incremented, and they overflow 59, the next amount is increased. You can also overflow hour to trigger a meridian change by using `overflowHourToMeridian`.

#### Increment steps

When time arrows are triggered, values are incremented with a certain amount - called step. The default `step` value is 1

 * step: Number
 * hourStep: Number - A step for incrementing hours (defaults to null). If not provided, `step` will be used when incrementing the hour
 * minuteStep: Number - A step for incrementing minutes (defaults to null). If not provided, `step` will be used when incrementing the minute
 * secondStep: Number - A step for incrementing seconds (defaults to null). If not provided, `step` will be used when incrementing the second

#### Styling props

The time picker comes with built-in styles, no dependencies on external css files.

 * style

By default, the timepicker is 200px in width and has padding 10px. You can easily change that:

```jsx
<TimePicker style={{width: '100%', padding: 5}} />
```

Styles for time boxes (the div containing the input and the arrows)

 * boxStyle - style to be applied to all boxes (hour, minute, second, meridian)
 * hourStyle
 * minuteStyle
 * secondStyle
 * meridianStyle

Styles for time input fields

 * hourInputStyle
 * minuteInputStyle
 * secondInputStyle
 * meridianInputStyle

#### Other props

 * inputFactory: Function(props) - you can control how to render the time inputs, by using this function. It will be called with some props for the input:

    * props.timeName: String - the name of the input ('hour', 'minute', etc)
    * props.style - the style for the input
    * props.value
    * props.onChange
    * props.onFocus
    * props.onBlur

 	Changing either `onChange`, `onFocus` or `onBlur` of the props passed in to `inputFactory` is not recommended. If you choose to change those, make sure you know what you're doing or you call the initial functions along with your own logic

 * showArrows: Boolean - decides whether to show arrows or not. Defaults to true
 * arrowStyle - style to be applied to all arrows
 * arrowUpStyle
 * arrowDownStyle
 * arrowOverStyle
 * arrowUpOverStyle
 * arrowDownOverStyle
 * arrowFactory
 * stepDelay: Number - defaults to 60. The amount of milliseconds between amount increments when mouse is down on an arrow
 * stopChangePropagation: Boolean - defaults to true. Stops the propagation of the `change` event on the inputs contained in the time picker. Needed so your `onChange` function will not get called multiple times, and with different arguments. Only modify this if you know what you're doing
  * normalizeStyle: Boolean - defaults to true. Uses [react-style-normalizer](https://www.npmjs.com/package/react-style-normalizer) to prefix style names when needed. In this case, all style props are prefixed (style, inputStyle, hourStyle, etc... )


## Contributing

Check out the project, cd into it and do

```sh
$ npm install
$ npm run dev # to run webpack-dev-server
$ npm run serve # to run a web server to serve your files
```
Navigate to [localhost:9091](http://localhost:9091).

Change the sources in the `src` directory. When a change is detected, the browser is auto refreshed.

To make a new build, execute `npm run build`, which refreshes the `lib` folder (for use with npm) from sources found in `src`, and also creates a concatenated file for use in the browser (minified version as well).

## Roadmap

See [Roadmap](./ROADMAP.md)

## Changelog

See [Changelog](./CHANGELOG.md)

## License

#### `MIT`