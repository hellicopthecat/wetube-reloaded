const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
    recorder: "./src/client/js/recorder.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  mode: "development",
  watch: true,
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          // babel-loader 설치
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", {targets: "defaults"}]],
          },
        },
      },
      {
        //sass-loader , css-loader, style-loader 설치
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        //webpack의 loader들은 적힌 반대 순서 즉, 뒤에서부터 시작
      },
    ],
  },
};
