const { resolve } = require("path");
const AppleTouchIconsPlugin = require("./src/index");
module.exports = {
  entry: resolve(__dirname, "src/index.js"),
  output: {
    path: resolve(__dirname, "bin"),
    filename: "bundle.js"
  },
  node: {
    child_process: "empty",
    fs: "empty"
  },
  plugins: [new AppleTouchIconsPlugin()]
};
