const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename : 'bundle.css'
    // disable : process.env.NODE_ENV === 'dddevelopment'
});

module.exports = {
    entry : './app/index.js',
    devtool : 'source-map',
    devServer : {
        port : 3000,
        compress : true,
        watchOptions : {
            aggregateTimeout : 300,
            poll : 1000
        }
    },
    module : {
        rules : [
            {
                test : /\.js$/,
                exclude : /node_modules/,
                loader : 'babel-loader'
            },
            {
                test : /\.scss$/,
                use : extractSass.extract({
                    use : [{
                        loader : 'css-loader', options : {
                            sourceMap : true
                        }
                    }, {
                        loader : 'sass-loader', options : {
                            sourceMap : true
                        }
                    }],
                    // use style-loader in development
                    fallback : 'style-loader'
                })
            }
        ]
    },
    output : {
        filename : 'bundle.js',
        path : path.resolve(__dirname, 'build'),
        publicPath : '/build'
    },
    plugins : [
        extractSass
    ]
};
