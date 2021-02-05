const { resolve } = require("path");
const appletouchiconsplugin = require("./src");
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
  plugins: [new appletouchiconsplugin()]
};
