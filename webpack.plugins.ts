import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import DotEnv from "dotenv-webpack";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

export const plugins: any[] = [
  new ForkTsCheckerWebpackPlugin({
    logger: "webpack-infrastructure",
  }),
  new DotEnv(),
];
