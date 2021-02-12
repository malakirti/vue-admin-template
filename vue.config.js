const path = require('path');
const webpack = require('webpack');
// const WebpackBar = require('webpackbar');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const pkg = require('./package.json');
const proxy = require('./dev.proxy');

const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
	publicPath: '/',
	outputDir: 'dist',
	assetsDir: 'static',
	lintOnSave: process.env.NODE_ENV === 'development',
	productionSourceMap: false,
	devServer: {
		proxy,
		port: 3000,
		open: true,
		overlay: {
			warnings: true,
			errors: true,
		},
	},

	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'less',
			patterns: [resolve('src/styles/variables/*.less')],
		},
	},

	configureWebpack: (config) => {
		config.mode = process.env.NODE_ENV;
		config.devtool = 'cheap-module-source-map';
	},

	chainWebpack(config) {
		// config
		// 	.plugin('WebpackBar')
		// 	.use(
		// 		new WebpackBar({
		// 			name: '拼命构建中...',
		// 			profile: true,
		// 		}),
		// 	)
		// 	.end();

		config
			.plugin('StyleLintPlugin')
			.use(
				new StyleLintPlugin({
					fix: true,
					cache: true,
					quiet: true,
					files: ['src/**/*.{vue,css,less}'],
				}),
			)
			.end();

		config
			.plugin('DefinePlugin')
			.use(
				new webpack.DefinePlugin({
					'process.env.__APP_NAME__': JSON.stringify(pkg.name),
					'process.env.__APP_VERSION__': JSON.stringify(pkg.version),
					'process.env.__APP_UPDATE_TIME__': JSON.stringify(new Date().toLocaleString()),
				}),
			)
			.end();

		config.module.rule('svg').exclude.add(resolve('src/icons')).end();

		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({ symbolId: 'icon-[name]' })
			.end();
	},
};
