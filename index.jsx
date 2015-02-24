'use strict';

var React  = require('react')
var Picker = require('./src')

var VALUE = '11:00 PM'
var App = React.createClass({

    render: function(){

        function meridian(v){
            return v
        }

        var add = function(allTags){
            tags = allTags
            this.setState({})
        }.bind(this)

        var onChange = function(value, time){
            // console.log(value)
            VALUE = value
            this.setState({})
        }.bind(this)

        return <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <Picker
                    value={VALUE}
                    overflowHourToMeridian={true}
                    onChange={onChange}
                    style={{margin: 20, width: 200}}/>
            </div>
    }
})

React.render((
    <App />
), document.getElementById('content'))