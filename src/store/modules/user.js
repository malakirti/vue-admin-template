import { getToken, setToken, removeToken } from '@/utils/token';

export default {
	namespaced: true,
	state: {
		token: getToken(),
		userInfo: {},
		permissions: {
			roles: [], // 角色。控制路由级权限。eg: admin、trader
			authority: {}, // 权限。控制操作级权限。eg: { user_change-user-info: true }
		},
	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token;
		},
		SET_USER_INFO(state, userInfo) {
			state.userInfo = userInfo;
		},
		SET_PERMISSIONS(state, permissions) {
			state.permissions = permissions;
		},
	},
	actions: {
		async login({ commit }, loginInfo) {
			const { name, password } = loginInfo;
			console.log(name, password, commit);
			commit('SET_TOKEN', 'vue-admin-template');
			commit('SET_USER_INFO', {});
			commit('SET_PERMISSIONS', { roles: [], authority: {} });
			setToken();
		},
		async logout({ state, commit, dispatch }) {
			commit('SET_TOKEN', '');
			commit('SET_USER_INFO', {});
			commit('SET_PERMISSIONS', { roles: [], authority: {} });
			removeToken();
			console.log(state.token, commit, dispatch);
		},
	},
};
