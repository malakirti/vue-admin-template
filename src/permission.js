import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import store from './store';

import router from './router';

NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
	console.log(store.getters.user, '--->>> 此处统一判断权限');
	NProgress.start();
	next();
});

router.afterEach(() => {
	NProgress.done();
});
