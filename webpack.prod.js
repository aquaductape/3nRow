const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });
const common = require("./webpack.common");
const merge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniExtractCssPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "main.[contentHash].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: MiniExtractCssPlugin.loader },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: "postcss.config.js",
              },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniExtractCssPlugin({ filename: "[name].[contentHash].css" }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.parsed),
    }),
  ],
});
