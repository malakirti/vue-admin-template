import pkg from '../../package.json';
import baseUrls from './base-urls';

export default {
	environment: process.env.NODE_ENV,
	isDevelopment: process.env.NODE_ENV !== 'production',
	appName: pkg.name,
	localStorageTabsKey: `${pkg.name}-tabs`,
	baseUrls,
	keyMap: {
		w: 87,
	},
};
