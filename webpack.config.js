const { resolve } = require("path");
const appletouchiconsplugin = require("./src/index");
module.exports = {
  entry: resolve(__dirname, "src/index.js"),
  output: {
    path: resolve(__dirname, "bin"),
    filename: "plugin.js"
  },
  node: {
    child_process: "empty",
    fs: "empty"
  },
  plugins: [new appletouchiconsplugin()]
};
