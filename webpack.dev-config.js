const { resolve } = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './index.dev.js'
    ],
    output: {
        filename: '[name].[hash].js',
        path: resolve(__dirname, 'build/dist'),
        publicPath: '/'
    },
    context: resolve(__dirname, 'src'),
    devtool: 'eval',
    devServer: {
        hot: true,
        contentBase: resolve(__dirname, 'build/dist'),
        publicPath: '/',
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
                exclude: /node_modules/
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
                use: ExtractTextPlugin.extract('css-loader?modules=false&importLoaders=1&sourceMap=true!sass-loader?sourceMap=true&outputStyle=expanded')
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new ExtractTextPlugin('styles.css'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
    ]
}

module.exports = config
