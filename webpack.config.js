/*此文件未使用，只是为了让idea可以识别实际位置，点击跳转*/
const path = require("path");

function resolve (dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  resolve: {
    alias: {
      "@": resolve("src"),
      "assets": resolve('src/assets'),
      "components": resolve('src/components'),
      "views": resolve('src/views')
    },
  }
}