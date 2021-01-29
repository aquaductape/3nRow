const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const WebpackShellPlugin = require("webpack-shell-plugin");
const path = require("path");
const { NODE_ENV = "production" } = process.env;

module.exports = {
  entry: "./src/server.ts",
  target: "node",
  mode: "production",
  watch: NODE_ENV === "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackShellPlugin({
      onBuildEnd: NODE_ENV === "development" ? ["yarn run:dev"] : [],
    }),
  ],
};
