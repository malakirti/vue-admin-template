import config from '@/config';

export default {
	namespaced: true,
	state: {
		tabsViews: JSON.parse(window.localStorage.getItem(config.localStorageTabsKey)) || [],
		cacheViews: [],
	},
	mutations: {
		SET_TABS_LIST(state, list) {
			window.localStorage.setItem(config.localStorageTabsKey, JSON.stringify(list));
			state.tabsViews = list;
		},
		ADD_CACHE_VIEWS(state, name) {
			state.cacheViews = [...new Set([...state.cacheViews, name])];
		},
		DELETE_CACHE_VIEWS(state, name) {
			const set = new Set([...state.cacheViews]);
			set.delete(name);
			state.cacheViews = [...set];
		},
	},
	actions: {
		async onSetTabsViews({ dispatch, commit, state }, view) {
			return new Promise((resolve) => {
				let list = state.tabsViews;
				const operation = view.operation;
				const index = state.tabsViews.findIndex((item) => item.path === view.path);
				const filterLeft = list.slice(0, index).filter((item) => item.meta && item.meta.pin);
				const filterRight = list.slice(index).filter((item) => item.meta && item.meta.pin);

				switch (operation) {
					case 'add':
						list = [...list, view];
						break;
					case 'update':
						if (index > -1) {
							list = list.reduce((prev, curr, idx) => {
								if (index === idx) {
									prev.push(view);
								} else {
									prev.push(curr);
								}
								return prev;
							}, []);
						}
						break;
					case 'refresh':
						// 没有异步操作，直接使用
						dispatch('onDeleteCacheView', view);
						break;
					case 'close':
						list = list.filter((item) => item.path !== view.path);
						break;
					case 'close-others':
						list = list.filter((item) => item.path === view.path || (item.meta && item.meta.pin));
						console.log('close-others');
						break;
					case 'close-all':
						list = list.filter((item) => item.meta && item.meta.pin);
						break;
					case 'close-left':
						list = [...filterLeft, ...list.slice(index)];
						break;
					case 'close-right':
						list = [...list.slice(0, index), ...filterRight];
						break;
					default:
						if (index > -1) {
							list = list.reduce((prev, curr, idx) => {
								if (index === idx) {
									prev.push(view);
								} else {
									prev.push(curr);
								}
								return prev;
							}, []);
						} else {
							list = [...list, view];
						}
						break;
				}
				commit('SET_TABS_LIST', list);
				resolve(state.tabsViews);
			});
		},
		onAddCacheView({ commit }, view) {
			return new Promise((resolve) => {
				const {
					name,
					meta: { cache },
				} = view;
				if (cache && name) {
					commit('ADD_CACHE_VIEWS', name);
					resolve(view);
				} else {
					// 静默失败
					console.warn('当前组件不可缓存，请检查路由配置', view);
					// reject(new Error('当前组件不可缓存，请检查路由配置'));
				}
			});
		},
		onDeleteCacheView({ commit }, view) {
			return new Promise((resolve) => {
				const {
					name,
					meta: { cache },
				} = view;
				if (cache && name) {
					commit('DELETE_CACHE_VIEWS', name);
					resolve(view);
				}
			});
		},
	},
};
