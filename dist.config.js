module.exports = {
    entry: './index.jsx',
    output: {
        path         : __dirname + '/dist',
        libraryTarget: 'umd',
        filename     : 'app.js'
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