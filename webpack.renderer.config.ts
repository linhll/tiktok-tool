import type { Configuration } from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import path from "path";

const copyPlugins = new CopyWebpackPlugin({
  patterns: [
    {
      from: path.resolve(__dirname, "src/assets"),
      to: path.resolve(__dirname, ".webpack/renderer/assets"),
    },
  ],
});

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [...plugins, copyPlugins],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    fallback: {
      fs: false,
      path: false,
      crypto: false,
    },
    alias: {
      "@ui": path.resolve(__dirname, "src/ui/"),
    },
  },
};
