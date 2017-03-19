const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename : 'bundle.css'
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
                    },
                        'postcss-loader',
                        {
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
        extractSass,
        new CopyWebpackPlugin([
            { from : 'app/images', to : 'images', ignore : ['.DS_Store'] },
            { from : 'index.html', to : 'index.html' },
        ]),
        new CompressionPlugin({
            asset : "[path].gz[query]",
            algorithm : "gzip",
            test : /\.(js|html)$/,
            threshold : 10240,
            minRatio : 0.8
        })
    ]
};
