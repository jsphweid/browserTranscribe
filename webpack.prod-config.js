const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractSass = new ExtractTextPlugin({
    filename: '[name].[contenthash].css',
    disable: process.env.NODE_ENV === 'development'
})

require('babel-polyfill')

const config = {
    name: 'browser',
    devtool: 'source-map',
    entry: {
        app: './src/index',
        css: './src/assets/scss/styles'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-0']
                },
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'url-loader',
                query: {
                    name: '[hash].[ext]'
                }
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(scss|css)$/,
                loader: extractSass.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }],
                    // use style-loader in development
                    fallback: 'style-loader'
                })

            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss']
    },
    plugins: [
        extractSass,
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            __DEVCLIENT__: false,
            __DEVSERVER__: false
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
    ]
}

module.exports = config
