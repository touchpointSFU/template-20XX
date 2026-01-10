import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // turbopack: {
  //   rules: {
  //     "*.{vert,frag,glsl,vs,fs}": {
  //       loaders: ["raw-loader", "webpack-lygia-loader"],
  //       as: "*.js",
  //     },
  //   },
  // },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ["raw-loader", "webpack-lygia-loader"],
    });
    return config;
  },
};

export default nextConfig;
