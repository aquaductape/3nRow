const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          // Disables attributes processing, kept crashing when it was reading favicon path href in index.html
          sources: false,
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/, /server/],
      },
      {
        test: /\.(svg|png|jpg|gif|bmp)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "img",
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/assets/favicon", to: "favicon" },
        { from: "src/assets/open-graph", to: "./" },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
  ],
};
