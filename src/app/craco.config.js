module.exports = {
    webpack: {
        configure: (webpackConfig, { env }) => {
            if (env !== 'development') {
                return webpackConfig;
            }

            webpackConfig.module.rules.unshift({
                test: /\.js?$/,
                use: ['prettier-loader'],
                // force this loader to run first if it's not first in loaders list
                enforce: 'pre',
                exclude: /node_modules/,
            });

            return webpackConfig;
        },
    },
};
