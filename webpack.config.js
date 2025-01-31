const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = (_env, argv) => ({
  mode: argv.mode,
  entry: './src/index.ts',
  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 3000,
  },
  plugins: [new CleanWebpackPlugin(), new HTMLWebpackPlugin({ template: './index.html' })],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: ['file-loader'],
      },
      {
        test: /\.mp3$/i,
        use: ['file-loader'],
      },
      // {
      //   test: /\.json$/i,
      //   use: ['json-loader'],
      // },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules|\.d\.ts$/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
});
