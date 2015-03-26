'use strict';

var React      = require('react')
var TimePicker = require('./src')

var VALUE = '14:00:01'

var onChange = function(value){
    // value = value.substring(0, 5)
    picker.setProps({value: value})
}

var picker = React.render(
    <TimePicker
        value={VALUE}
        onChange={onChange}
    />,
    document.getElementById('content')
)