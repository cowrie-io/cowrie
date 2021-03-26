const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const rootDir = path.resolve(__dirname, '..');

module.exports = {
    entry: rootDir + '/src/index.js',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {
            '@': rootDir + '/src/',
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
};
