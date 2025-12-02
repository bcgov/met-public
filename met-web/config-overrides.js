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
            maxSize: 300 * 1024, // Aim for chunks around 300KB (before gzip)
            minSize: 100 * 1024, // Try to avoid chunks smaller than 100KB
            cacheGroups: {
                // Separate large libraries into their own JS chunks
                // to be delivered separately for better performance
                mui: {
                    test: /[\\/]node_modules[\\/]@mui[\\/]/,
                    name: 'mui',
                    priority: 50, // If multiple groups match a regex, webpack chooses the higher priority
                    reuseExistingChunk: true,
                },
                fontawesome: {
                    test: /[\\/]node_modules[\\/](@fortawesome|@bcgov-artifactory)[\\/]/,
                    name: 'fontawesome',
                    priority: 45,
                    reuseExistingChunk: true,
                },
                maplibs: {
                    test: /[\\/]node_modules[\\/](mapbox-gl|maplibre-gl|react-map-gl|@maplibre)[\\/]/,
                    name: 'maplibs',
                    priority: 40,
                    reuseExistingChunk: true,
                },
                coreJs:{
                    test: /[\\/]node_modules[\\/](core-js|core-js-pure|core-js-compat)[\\/]/,
                    name: 'core-js',
                    priority: 35,
                    reuseExistingChunk: true,
                },
                formio: {
                    test: /[\\/]node_modules[\\/](@formio|formiojs|met-formio|inputmask)[\\/]/,
                    name: 'formio',
                    priority: 35,
                    reuseExistingChunk: true,
                },
                recharts: {
                    test: /[\\/]node_modules[\\/](recharts|es-toolkit)[\\/]/,
                    name: 'recharts',
                    priority: 30,
                    reuseExistingChunk: true,
                },
                jspdf: {
                    test: /[\\/]node_modules[\\/](jspdf|html2canvas|html-to-image|canvg|stackblur-canvas)[\\/]/,
                    name: 'jspdf',
                    priority: 30,
                    reuseExistingChunk: true,
                },
                draftjs: {
                    test: /[\\/]node_modules[\\/](draft-js|draftjs-to-html|html-to-draftjs|draftjs-utils|react-draft-wysiwyg)[\\/]/,
                    name: 'draftjs',
                    priority: 25,
                    reuseExistingChunk: true,
                },
                lodash: {
                    test: /[\\/]node_modules[\\/](lodash|lodash-es)[\\/]/,
                    name: 'lodash',
                    priority: 25,
                    reuseExistingChunk: true,
                },
                moment: {
                    test: /[\\/]node_modules[\\/]moment[\\/]/,
                    name: 'moment',
                    priority: 15,
                    reuseExistingChunk: true,
                },
                helloPangea: {
                    test: /[\\/]node_modules[\\/](@hello-pangea)[\\/]/,
                    name: 'hello-pangea',
                    priority: 15,
                    reuseExistingChunk: true,
                },
                // Remaining vendor libraries
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10,
                    reuseExistingChunk: true,
                },
                // Separate common code used across routes
                common: {
                    minChunks: 2,
                    priority: 5,
                    name: 'app-common',
                    reuseExistingChunk: true,
                    enforce: true,
                },
            },
        };
    }

    return config;
};
