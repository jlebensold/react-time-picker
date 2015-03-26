module.exports = {
    entry: './src/index.jsx',
    output: {
        path         : __dirname + "/dist",
        libraryTarget: 'umd',
        library      : 'ReactTimePicker',
        filename     : 'react-time-picker.min.js'
    },
    module: {
        loaders: require('./loaders.config')
    },
    externals: {
        'react': 'React',
        'moment': 'moment'
    },
    resolve: {
        // Allow to omit extensions when requiring these files
        extensions: ['', '.js', '.jsx']
    }
}