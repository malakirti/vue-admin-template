/*
 * @Author: your name
 * @Date: 2020-11-11 10:39:25
 * @LastEditTime: 2020-11-12 11:40:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vas-fe/src/store/index.js
 */
import Vue from 'vue';
import Vuex, { createLogger } from 'vuex';
import cfg from '@/config';
import getters from './getters';

const { isDevelopment } = cfg;

Vue.use(Vuex);

const webpackContext = require.context('./modules', true, /\.js$/);

const modules = webpackContext.keys().reduce((res, path) => {
	// eg: './global.js' => 'global'
	const moduleName = path.replace(/^\.\/(.*)\.js$/, '$1');
	res[moduleName] = webpackContext(path).default;
	return res;
}, {});

export default new Vuex.Store({
	modules,
	getters,
	strict: isDevelopment,
	plugins: isDevelopment ? [createLogger()] : [],
});
