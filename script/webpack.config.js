const path = require("path");

module.exports = {
  entry: "./script.js", // Your entry point file
  output: {
    filename: "bundle.js", // The name of the bundled file
    path: path.resolve(battleship, "dist"), // The directory where the bundled file should be saved
  },
};
