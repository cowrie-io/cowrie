const path = require("path");
const webpack = require("webpack");
const common = require("./webpack.js");
const { merge } = require("webpack-merge");
const rootDir = path.resolve(__dirname, "..");

module.exports = merge(common, {
  mode: "development",
  output: {
    path: rootDir + "/dist/",
    filename: "[name].js",
  },
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    port: 3000,
    stats: "errors-only",
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
