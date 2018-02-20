const path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
// const config = [
// {
//     entry: {
//         app: './src/widget.js',
//         // vendors: path.resolve(__dirname, 'dist', 'widget'),
//     },
//     output: {
//         filename: 'bundle-widget.js',
//         path: path.resolve(__dirname, 'dist', 'widget')
//     }
// },
// {
//     entry: {
//         script: './src/iframe/js/script.js',
//         progress: './src/iframe/js/progress-bar.js',
//         countdown: './src/iframe/js/countdown.js',
//         // vendors: path.resolve(__dirname, 'dist', 'widget'),
//     },
//     output: {
//         filename: 'bundle-iframe.js',
//         path: path.resolve(__dirname, 'dist', 'iframe')
//     }
// },
// ];

// module.exports = {
//   entry: './src/widget.js',
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist', 'widget')
//   }
// };
const config = {
    entry: {
        widget: ['./src/widget.js'],
        iframe: ['./src/iframe/js/validator.js', './src/iframe/js/script.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            { test: /\.css$/, use: 'css-loader' },
        ]
    },
    plugins: [new HtmlWebpackPlugin({template: './src/iframe/iframe.html'})],
    externals: {
        jquery: 'jQuery'
    }
};

module.exports = config;