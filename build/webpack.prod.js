const path = require("path");
const common = require("./webpack.js");
const { merge } = require("webpack-merge");
const rootDir = path.resolve(__dirname, "..");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    publicPath: "dist/",
    path: rootDir + "/dist/",
    filename: "index.js",
    library: "Cowrie",
    libraryTarget: "umd",
    libraryExport: "default",
    globalObject: "this",
  },
});
