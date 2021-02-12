import Vue from 'vue';
import ElementUI from 'element-ui';
import getAppInfo from '@/utils/app-info';
import 'normalize.css/normalize.css';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App.vue';
import store from './store';
import router from './router';
import reportWebVitals from './reportWebVitals';

import './registerServiceWorker';
import './assets/icons';
import './permission';
import './styles/global.less';

getAppInfo(true);

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: 'small' });

new Vue({
	store,
	router,
	render: (h) => h(App),
}).$mount('#app');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals(console.log);
