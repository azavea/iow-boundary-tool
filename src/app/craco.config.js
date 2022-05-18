reactHotReloadPlugin = require('craco-plugin-react-hot-reload');

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

            // Set up a webpack alias for react-dom to get hook support when hot
            // reloading
            // https://github.com/gaearon/react-hot-loader#hot-loaderreact-dom
            webpackConfig.resolve.alias['react-dom'] = '@hot-loader/react-dom';

            return webpackConfig;
        },
    },
    plugins: [
        {
            plugin: reactHotReloadPlugin,
        },
    ],
};
