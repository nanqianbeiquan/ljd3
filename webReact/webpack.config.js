var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry:'./src/main.js',
  // entry:'./src2/main2.js',
  // entry:'./src/mainLanJing.js',
  output: {
    path: path.resolve(__dirname, './js'),  //index.jsp
    // path: path.resolve(__dirname, './js'),       //develop.jsp
    publicPath: 'js/', //尝试修正webfont图片无法获取问题，项目服务器文件目录为js
    filename: 'bundle.js'
    // filename: 'build.js'
    // filename: 'develop.js'
    // filename: 'develop1.js'
    // filename: 'lanjing.js'
  },
  // "scripts": {
  //   "dev": "webpack-dev-server --devtool eval --progress --colors",
  //   "deploy": "NODE_ENV=production webpack -p"
  // },
  module: {
    loaders:[
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      // { test: /\.vue$/, loader: 'vue-loader'},
      // { test: /\.js$/, loader: 'babel',exclude: /node_modules/},
      { test: /\.json$/,loader: 'json'},
      /*----start for ES6 ----------------------------------------------------------------------------------*/
      {
        test: /\.js|jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      /*---- end --------------------------------------------------------------------------------------------*/
      /*---- start for bootstrap ----------------------------------------------------------------------------*/
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
      { test: /\.(woff|woff2)$/,  loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf$/,    loader: "file-loader" },
      { test: /\.eot$/,    loader: "file-loader" },
      /*----end --------------------------------------------------------------------------------------------*/
    ]
  },
  plugins:[
      new webpack.DefinePlugin({
        'process.env':{
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      // new webpack.DefinePlugin({
      //     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      // }),
      // new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
   extensions: ['', '.js','.jsx' ,'.es6']
  },
  // devServer: {
  //   historyApiFallback: true,
  //   noInfo: true
  // },
 // devtool: 'eval-source-map'
};

// if (process.env.NODE_ENV === 'production') {
//   module.exports.devtool = 'source-map'
//   // http://vuejs.github.io/vue-loader/workflow/production.html
//   module.exports.plugins = (module.exports.plugins || []).concat([
//     new webpack.DefinePlugin({
//       'process.env': {
//         NODE_ENV: '"production"'
//       }
//     }),
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {
//         warnings: false
//       }
//     }),
//     new webpack.optimize.OccurenceOrderPlugin()
//   ])
// }
