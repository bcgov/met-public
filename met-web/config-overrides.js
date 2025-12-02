const path = require('node:path');
const webpack = require('webpack');
module.exports = function override(config) {
    
    config.resolve.fallback = {
        ...(config.resolve.fallback),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        url: require.resolve('url'),
    };
    
    // Alias lodash to lodash-es for better tree-shaking
    config.resolve.alias = {
        ...(config.resolve.alias),
        lodash: 'lodash-es',
        engagements: path.resolve(__dirname, 'src/components/engagement'),
    };

    // Make sure the build target is web
    config.target = 'web';

    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ]);

    config.module.rules.unshift({
        test: /\.m?js$/,
        resolve: {
            fullySpecified: false, // disable the behavior
        },
    });

    const sassRule = config.module.rules.find((rule) =>
        rule.oneOf?.find((oneOfRule) =>
        oneOfRule.test?.toString().includes('scss') || oneOfRule.test?.toString().includes('sass')
        )
    );

    if (sassRule) {
        sassRule.oneOf.forEach((oneOfRule) => {
        if (oneOfRule.test?.toString().includes('scss') || oneOfRule.test?.toString().includes('sass')) {
            const sassLoader = oneOfRule.use.find((use) =>
            use.loader?.includes('sass-loader')
            );
            if (sassLoader) {
            // Force use of the modern Sass API
            sassLoader.options = {
                ...sassLoader.options,
                api: 'modern',
            };
            }
        }
        });
    }

    // Fix CSS ordering warnings from mini-css-extract-plugin
    const miniCssExtractPlugin = config.plugins.find(
        (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
    );
    if (miniCssExtractPlugin) {
        miniCssExtractPlugin.options.ignoreOrder = true;
    }

    // Optimize chunk splitting for better caching and lazy loading
    if (config.optimization && process.env.NODE_ENV === 'production') {
        config.optimization.splitChunks = {
            // Split async chunks only - this saves on # of requests during initial load
            // If main.js is too large, make sure imports from App.tsx and routes are lazy-loaded
            chunks: 'async',
            minSize: 150 * 1024, // Try to make chunks larger to reduce # of files
            maxSize: 350 * 1024, // Try to keep chunks under 350KB each
            enforceSizeThreshold: 450 * 1024, // Allow some flexibility for libraries that are hard to split
            maxAsyncRequests: 20, // Number of possible parallel requests for async chunks
            maxInitialRequests: 10, // Number of possible parallel requests at initial load
            cacheGroups: {
                // Separate large libraries into their own JS chunks
                // to be delivered separately for better performance
                mui: {
                    test: /[\\/]node_modules[\\/]@mui[\\/]/,
                    name: 'mui',
                    priority: 50, // If multiple groups match a regex, webpack chooses the higher priority
                },
                fontawesome: {
                    test: /[\\/]node_modules[\\/](@fortawesome|@bcgov-artifactory)[\\/]/,
                    name: 'fontawesome',
                    priority: 45,
                },
                maplibs: {
                    test: /[\\/]node_modules[\\/](mapbox-gl|maplibre-gl|react-map-gl|@maplibre)[\\/]/,
                    name: 'maplibs',
                    priority: 40,
                },
                coreJs:{
                    test: /[\\/]node_modules[\\/](core-js|core-js-pure|core-js-compat)[\\/]/,
                    name: 'core-js',
                    priority: 35,
                },
                formio: {
                    test: /[\\/]node_modules[\\/](@formio|formiojs|met-formio|inputmask)[\\/]/,
                    name: 'formio',
                    priority: 35,
                },
                recharts: {
                    test: /[\\/]node_modules[\\/](recharts|es-toolkit)[\\/]/,
                    name: 'recharts',
                    priority: 30,
                },
                jspdf: {
                    test: /[\\/]node_modules[\\/](jspdf|html2canvas|html-to-image|canvg|stackblur-canvas)[\\/]/,
                    name: 'jspdf',
                    priority: 30,
                },
                draftjs: {
                    test: /[\\/]node_modules[\\/](draft-js|draftjs-to-html|html-to-draftjs|draftjs-utils|react-draft-wysiwyg)[\\/]/,
                    name: 'draftjs',
                    priority: 25,
                },
                lodash: {
                    test: /[\\/]node_modules[\\/](lodash|lodash-es)[\\/]/,
                    name: 'lodash',
                    priority: 25,
                },
                helloPangea: {
                    test: /[\\/]node_modules[\\/](@hello-pangea)[\\/]/,
                    name: 'hello-pangea',
                    priority: 15,
                },
                // Remaining vendor libraries
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                },
                // Separate common code used across routes
                common: {
                    minChunks: 2,
                    priority: 5,
                    name: 'app-common',
                    enforce: true,
                },
            },
        };
    }

    return config;
};
