const path = require('\frontend\src\App.js');

module.exports = {
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"), // For handling 'path' module
      "os": require.resolve("os-browserify/browser"), // For handling 'os' module
      "crypto": require.resolve("crypto-browserify") // For handling 'crypto' module
    }
  },
};
