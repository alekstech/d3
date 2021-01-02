var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path'); 


module.exports = { 
  entry: './src/index.js', 
  output: {
    path: path.resolve('/dist'), 
    filename: 'index_bundle.js' 
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    hot: true // enable hot module replacement
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'src/index.html'
  })],
  devtool: 'eval-source-map'
} 