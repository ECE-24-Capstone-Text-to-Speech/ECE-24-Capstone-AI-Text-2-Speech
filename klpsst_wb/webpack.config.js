/** @type {import('webpack').Configuration} */
const webpackConfig = {
  module: {
    // …
    rules: [
      // …
      {
        test: /\.mdx?$/,
        use: [
          {
            loader: "@mdx-js/loader",
            /** @type {import('@mdx-js/loader').Options} */
            options: {
              /* jsxImportSource: …, otherOptions… */
            },
          },
        ],
      },
    ],
  },
};

export default webpackConfig;
