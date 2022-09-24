/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                      moveElemsAttrsToGroup: false,
                      convertShapeToPath: false,
                      mergePaths: false,
                      collapseGroups: false,
                    },
                  },
                },
                'prefixIds',
              ],
            },
          },
        },
      ],
    })
    return config
  },
}

module.exports = nextConfig
