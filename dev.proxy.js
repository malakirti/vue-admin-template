module.exports = {
	'/api': {
		target: 'http://localhost:10086',
		changeOrigin: true,
		pathRewrite: {
			'^/api': '/api',
		},
	},
};
